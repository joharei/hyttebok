import {
  CircularProgress,
  Fab,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import * as React from 'react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { GET_EDIT_TRIP } from '../apollo/EditTripQuery';
import { TripWithText } from '../models/Trip';
import { useQuery } from '@apollo/react-hooks';
import {
  GetEditTrip,
  GetEditTripVariables,
} from '../generated/apollo/GetEditTrip';
import { useParams } from 'react-router-dom';

interface Props {
  trip: TripWithText;
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
  const [trip, setTrip] = useState(props.trip);

  const classes = useStyles();

  const { title, startDate, endDate, text } = trip;

  const handleChange = (name: 'title' | 'startDate' | 'endDate' | 'text') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTrip(prevTrip => ({ ...prevTrip, [name]: event.target.value }));
  };

  const handleTextChange = (value: string) => {
    setTrip(prevTrip => ({ ...prevTrip, text: value }));
  };

  return (
    <>
      <form className={classes.root}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Paper className={classes.paper}>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                  <Typography variant="h4">Endre tur</Typography>
                </Grid>

                <Grid item>
                  <TextField
                    label="Tittel"
                    value={title}
                    onChange={handleChange('title')}
                    fullWidth
                  />
                </Grid>

                <Grid item>
                  <TextField
                    label="Startdato"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={startDate}
                    onChange={handleChange('startDate')}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    label="Sluttdato"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={endDate}
                    onChange={handleChange('endDate')}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item container direction="row" spacing={2}>
            <Grid item xs={6}>
              <Paper>
                <ReactMde
                  value={text}
                  onChange={handleTextChange}
                  selectedTab="write"
                  onTabChange={undefined}
                  generateMarkdownPreview={undefined}
                  minEditorHeight={500}
                  maxEditorHeight={Number.MAX_VALUE}
                  minPreviewHeight={0}
                />
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={`${classes.paper} ${classes.scroll}`}>
                <ReactMarkdown
                  source={text.replace(
                    /MEDIA_URL/g,
                    'hyttebok.photos.reitan.app/'
                  )}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </form>

      <Fab
        className={classes.fab}
        color="primary"
        variant="extended"
        aria-label="Add"
      >
        <SaveIcon className={classes.fabIcon} />
        Lagre
      </Fab>
    </>
  );
};

export const EditTripPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, loading, error } = useQuery<GetEditTrip, GetEditTripVariables>(
    GET_EDIT_TRIP,
    {
      variables: { slug },
    }
  );

  if (loading) {
    return <CircularProgress />;
  }
  if (error || !data) {
    return <p>Error</p>;
  }

  return <EditTripPageUI trip={data.trip} />;
};
