import { createStyles, Fab, Grid, Paper, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { RouteComponentProps } from 'react-router';
import { EditTripQuery, GET_EDIT_TRIP } from '../apollo/EditTripQuery';
import { ITripWithText } from '../models/ITrip';
import CircularProgress from './AdminTripsList';

interface IProps extends WithStyles<typeof styles> {
  trip: ITripWithText;
}

interface IState {
  trip: ITripWithText;
}

const styles = (theme: Theme) => createStyles({
  root: {
    paddingBottom: theme.spacing.unit * 8,
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  scroll: {
    height: 555,
    overflowY: 'scroll',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  fabIcon: {
    marginRight: theme.spacing.unit,
  },
});

class EditTripPageComp extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      trip: props.trip,
    };
  }

  public render() {

    const { classes } = this.props;

    const { title, startDate, endDate, text } = this.state.trip;

    return (
      <React.Fragment>
        <form className={classes.root}>
          <Grid container={true} spacing={16} direction="column">
            <Grid item={true}>
              <Paper className={classes.paper}>
                <Grid container={true} spacing={16} direction="column">
                  <Grid item={true} xs={12}>
                    <Typography variant="h4">Endre tur</Typography>
                  </Grid>

                  <Grid item={true}>
                    <TextField
                      label="Tittel"
                      value={title}
                      onChange={this.handleChange('title')}
                      fullWidth={true}
                    />
                  </Grid>

                  <Grid item={true}>
                    <TextField
                      label="Startdato"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={startDate}
                      onChange={this.handleChange('startDate')}
                    />
                  </Grid>

                  <Grid item={true}>
                    <TextField
                      label="Sluttdato"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={endDate}
                      onChange={this.handleChange('endDate')}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item={true} container={true} direction="row" spacing={16}>
              <Grid item={true} xs={6}>
                <Paper>
                  <ReactMde
                    value={text}
                    onChange={this.handleTextChange}
                    selectedTab="write"
                    onTabChange={undefined}
                    generateMarkdownPreview={undefined}
                    minEditorHeight={500}
                    maxEditorHeight={Number.MAX_VALUE}
                    minPreviewHeight={0}
                  />
                </Paper>
              </Grid>

              <Grid item={true} xs={6}>
                <Paper className={`${classes.paper} ${classes.scroll}`}>
                  <ReactMarkdown source={text.replace(/MEDIA_URL/g, 'hyttebok.photos.reitan.app/')}/>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </form>

        <Fab className={classes.fab} color="primary" variant="extended" aria-label="Add">
          <SaveIcon className={classes.fabIcon}/>
          Lagre
        </Fab>

      </React.Fragment>
    );
  }

  private handleChange = (name: 'title' | 'startDate' | 'endDate' | 'text') => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ trip: { ...this.state.trip, [name]: event.target.value } });
  };

  private handleTextChange = (value: string) => {
    this.setState({ trip: { ...this.state.trip, text: value } });
  };
}

const EditTripPage = withStyles(styles)(EditTripPageComp);

export default (props: RouteComponentProps<{ slug: string }>) => (
  <EditTripQuery query={GET_EDIT_TRIP} variables={{ slug: props.match.params.slug }}>
    {({ data: { trip } = { trip: undefined }, loading, error }) => {
      if (loading) {
        return <CircularProgress/>;
      }
      if (error || !trip) {
        return <p>Error</p>;
      }
      return <EditTripPage trip={trip}/>;
    }}
  </EditTripQuery>
)