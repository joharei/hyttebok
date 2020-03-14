import {
  CircularProgress,
  Fab,
  Grid,
  Hidden,
  makeStyles,
  Paper,
  Snackbar,
  SnackbarContent,
  Theme,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import * as React from 'react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactMde, { TextApi } from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useHistory, useParams } from 'react-router-dom';
import { TripDetails } from '../../models/Trip';
import { useTripDetails } from '../../firebase/useTripDetails';
import { formatDateForInput } from '../../utils/date';
import { useEditTrip } from '../../firebase/useEditTrip';
import { OneDrivePhotoPicker } from './OneDrivePhotoPicker';
import SettingsSystemDaydreamIcon from '@material-ui/icons/SettingsSystemDaydream';

interface Props {
  trip: TripDetails | null;
}

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    paddingBottom: spacing(8),
  },
  paper: {
    padding: spacing(2),
  },
  scroll: {
    height: 555,
    overflowY: 'scroll',
  },
  fab: {
    position: 'fixed',
    bottom: spacing(2),
    right: spacing(2),
  },
  fabIcon: {
    marginRight: spacing(1),
  },
}));

const EditTripPageUI = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();

  const [trip, setTrip] = useState<Partial<TripDetails>>(props.trip ?? {});
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [commands, setCommands] = useState(ReactMde.defaultProps.commands ?? []);
  const [oneDrivePhotoApi, setOneDrivePhotoApi] = useState<TextApi | null>(null);

  const mobileView = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));

  const { title, startDate, endDate, text }: Partial<TripDetails> = trip;
  const { loading, error, saveTrip } = useEditTrip(
    props.trip ? undefined : (slug: string) => history.push(`/admin/${slug}`)
  );

  useEffect(() => {
    setCommands(prevState => {
      const commands = Array(...prevState);
      commands[1].commands.push({
        name: 'onedrive_image',
        buttonProps: { 'aria-label': 'Sett inn bilde fra OneDrive' },
        // eslint-disable-next-line react/display-name
        icon: () => <SettingsSystemDaydreamIcon fontSize="small" />,
        execute: (state, api) => {
          setOneDrivePhotoApi(api);
        },
      });
      return commands;
    });
  }, []);

  const handleChange = (name: 'title' | 'startDate' | 'endDate' | 'text') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = name === 'startDate' || name === 'endDate' ? new Date(event.target.value) : event.target.value;
    setTrip(prevTrip => ({ ...prevTrip, [name]: value }));
  };
  const handleTextChange = (value: string) => {
    setTrip(prevTrip => ({ ...prevTrip, text: value }));
  };

  return (
    <>
      <form className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4">Endre tur</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField label="Tittel" value={title} onChange={handleChange('title')} fullWidth />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Startdato"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formatDateForInput(startDate)}
                    onChange={handleChange('startDate')}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Sluttdato"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formatDateForInput(endDate)}
                    onChange={handleChange('endDate')}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item container direction="row" spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper>
                <ReactMde
                  value={text}
                  onChange={handleTextChange}
                  disablePreview={!mobileView}
                  generateMarkdownPreview={async markdown => <ReactMarkdown source={markdown} />}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  minEditorHeight={500}
                  maxEditorHeight={Number.MAX_VALUE}
                  minPreviewHeight={0}
                  commands={commands}
                />
              </Paper>
            </Grid>

            <Hidden xsDown>
              <Grid item xs={6}>
                <Paper className={`${classes.paper} ${classes.scroll}`}>
                  <ReactMarkdown source={text} />
                </Paper>
              </Grid>
            </Hidden>
          </Grid>
        </Grid>
      </form>

      <Fab
        className={classes.fab}
        color="primary"
        variant="extended"
        aria-label="Add"
        disabled={!trip.title || !trip.startDate || !trip.endDate || !trip.text}
        onClick={() => {
          if (!trip.title || !trip.startDate || !trip.endDate || !trip.text) {
            return;
          }
          saveTrip({
            id: trip.id,
            slug: trip.slug,
            title: trip.title,
            startDate: trip.startDate,
            endDate: trip.endDate,
            text: trip.text,
          });
        }}
      >
        {loading ? <CircularProgress /> : <SaveIcon className={classes.fabIcon} />}
        Lagre
      </Fab>

      {oneDrivePhotoApi && (
        <OneDrivePhotoPicker
          onSuccess={photos => {
            const photosTemplate = photos
              .map(({ original, thumbnail }) => `[![](${thumbnail})](${original})`)
              .join('\n');
            oneDrivePhotoApi?.replaceSelection(`${photosTemplate}\n`);
            oneDrivePhotoApi?.setSelectionRange({ start: 2, end: 3 });
            setOneDrivePhotoApi(null);
          }}
          onCancel={() => setOneDrivePhotoApi(null)}
        />
      )}

      {error && (
        <Snackbar open={error}>
          <SnackbarContent message={'Lagring feilet!'} />
        </Snackbar>
      )}
    </>
  );
};

export const EditTripPage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { tripDetails, loading, error } = useTripDetails(slug);

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <p>Error</p>;
  }

  return <EditTripPageUI trip={tripDetails} />;
};