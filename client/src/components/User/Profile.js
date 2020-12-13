import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: '#333333',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    backgroundColor: '#373737',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#212121',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 270,
  },
}));

const Profile = ({
  user,
  newUsername,
  handleUsernameSubmit,
  handleNewUsernameChange,
}) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} direction="column">
          {/* Profile Settings */}
          <Box marginLeft={2}>
            <Typography component="p" variant="h4">
              Profile Settings
            </Typography>
          </Box>
          <Grid item xs={12} md={8} lg={7}>
            <Paper className={fixedHeightPaper}>
              <Box paddingLeft={1}>
                <Typography component="p" variant="h5">
                  Change Username
                </Typography>
              </Box>
              <form
                onSubmit={handleUsernameSubmit}
                className={classes.form}
                noValidate
              >
                <Grid container alignItems="center">
                  <Box mt={1} mr={0} mb={1} ml={1}>
                    <TextField
                      variant="outlined"
                      style={{ width: 175 }}
                      size="small"
                      color="primary"
                      name="usernameChange"
                      label="New Username"
                      id="usernameChange"
                      value={newUsername}
                      onChange={handleNewUsernameChange}
                    />
                  </Box>
                  <Box margin={2.5}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      color="primary"
                      style={{ width: 75, height: 30 }}
                    >
                      Update
                    </Button>
                  </Box>
                </Grid>
              </form>
              <Box paddingTop={3} paddingLeft={1}>
                <Typography component="p" variant="h5">
                  Change Password
                </Typography>
              </Box>
              <Grid container alignItems="center">
                <Box mt={1} mr={1.5} mb={1} ml={1}>
                  <TextField
                    type="password"
                    variant="outlined"
                    style={{ width: 175 }}
                    size="small"
                    color="primary"
                    name="oldPassword"
                    label="Old Password"
                    id="oldPassword"
                  />
                </Box>
                <Box mt={1} mr={0} mb={1} ml={1}>
                  <TextField
                    type="password"
                    variant="outlined"
                    style={{ width: 175 }}
                    size="small"
                    color="primary"
                    name="newPassword"
                    label="New Password"
                    id="newPassword"
                  />
                </Box>
                <Box margin={2.5}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    style={{ width: 75, height: 30 }}
                  >
                    Update
                  </Button>
                </Box>
              </Grid>
            </Paper>
          </Grid>
          {/* Recent Uploaded Files */}
          <Box marginTop={4} marginLeft={2}>
            <Typography component="p" variant="h4">
              Uploaded Files
            </Typography>
          </Box>
          <Grid item xs={12} md={8} lg={7}>
            <Paper className={fixedHeightPaper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date Uploaded</TableCell>
                    <TableCell>Size</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Profile;
