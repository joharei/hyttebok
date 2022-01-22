import {
  Alert,
  CircularProgress,
  Fab,
  Grid,
  Hidden,
  Paper,
  Snackbar,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import * as React from 'react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactMde, { getDefaultToolbarCommands, TextApi } from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useNavigate, useParams } from 'react-router-dom';
import { TripDetails } from '../../models/Trip';
import { useTripDetails } from '../../firebase/useTripDetails';
import { formatDateForInput } from '../../utils/date';
import { useEditTrip } from '../../firebase/useEditTrip';
import { OneDrivePhotoPicker } from './OneDrivePhotoPicker';
import SettingsSystemDaydreamIcon from '@mui/icons-material/SettingsSystemDaydream';
import { Markdown } from '../Markdown';
import { useTripPhotos } from '../../firebase/useTripPhotos';

const PREFIX = 'EditTripPage';

const classes = {
  root: `${PREFIX}-root`,
};

const RootForm = styled(`form`)(({ theme: { spacing } }) => ({
  [`& .${classes.root}`]: {
    paddingBottom: spacing(8),
  },
}));

interface Props {
  trip: TripDetails | null;
}

const EditTripPageUI = (props: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [trip, setTrip] = useState<Partial<TripDetails>>(props.trip ?? {});
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [oneDrivePhotoApi, setOneDrivePhotoApi] = useState<TextApi | null>(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  const mobileView = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const { title, startDate, endDate, text, slug }: Partial<TripDetails> = trip;
  const { loading, error, saveTrip } = useEditTrip((slug: string) => {
    if (!props.trip) {
      navigate(`/admin/${slug}`);
    }
    setSavedSuccessfully(true);
  });

  const { tripPhotos, loading: tripPhotosLoading } = useTripPhotos(slug);

  const handleChange =
    (name: 'title' | 'startDate' | 'endDate' | 'text') => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = name === 'startDate' || name === 'endDate' ? new Date(event.target.value) : event.target.value;
      setTrip((prevTrip) => ({ ...prevTrip, [name]: value }));
    };
  const handleTextChange = (value: string) => {
    setTrip((prevTrip) => ({ ...prevTrip, text: value }));
  };

  const toolbarCommands = getDefaultToolbarCommands();
  toolbarCommands[1].push('oneDriveImage');

  return (
    <>
      <RootForm className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4">Endre tur</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField label="Tittel" value={title ?? ''} onChange={handleChange('title')} fullWidth />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Startdato"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formatDateForInput(startDate) ?? ''}
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
                    value={formatDateForInput(endDate) ?? ''}
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
                  generateMarkdownPreview={async (markdown) => <ReactMarkdown>{markdown}</ReactMarkdown>}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  minEditorHeight={500}
                  maxEditorHeight={Number.MAX_VALUE}
                  minPreviewHeight={0}
                  commands={{
                    oneDriveImage: {
                      buttonProps: { 'aria-label': 'Sett inn bilde fra OneDrive' },
                      // eslint-disable-next-line react/display-name
                      icon: () => <SettingsSystemDaydreamIcon fontSize="small" />,
                      execute: ({ textApi }) => {
                        setOneDrivePhotoApi(textApi);
                      },
                    },
                  }}
                  toolbarCommands={toolbarCommands}
                />
              </Paper>
            </Grid>

            <Hidden smDown>
              <Grid item xs={6}>
                <Paper
                  sx={{
                    p: 2,
                    height: 555,
                    overflowY: 'scroll',
                  }}
                >
                  <Markdown tripText={text} tripPhotos={tripPhotos ?? undefined} loading={!text || tripPhotosLoading} />
                </Paper>
              </Grid>
            </Hidden>
          </Grid>
        </Grid>
      </RootForm>

      <Fab
        sx={{
          position: 'fixed',
          bottom: theme.spacing(2),
          right: theme.spacing(2),
        }}
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
        {loading ? <CircularProgress sx={{ mr: 1 }} color="inherit" size={24} /> : <SaveIcon sx={{ mr: 1 }} />}
        Lagre
      </Fab>

      {oneDrivePhotoApi && (
        <OneDrivePhotoPicker
          onSuccess={(photos) => {
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
          <Alert severity="error" variant="filled">
            Lagring feilet!
          </Alert>
        </Snackbar>
      )}

      {savedSuccessfully && (
        <Snackbar open={savedSuccessfully} autoHideDuration={6000} onClose={() => setSavedSuccessfully(false)}>
          <Alert severity="success" variant="filled" onClose={() => setSavedSuccessfully(false)}>
            Turen ble lagret
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export const EditTripPage: React.FunctionComponent = () => {
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
