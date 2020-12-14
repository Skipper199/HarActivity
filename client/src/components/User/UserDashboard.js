import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';

import ListItems from './ListItems';

import Footer from '../Footer';
import Error404 from '../Error404';

import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  Redirect,
  Router,
} from 'react-router-dom';
import Profile from './Profile';
import UploadFiles from './UploadFiles';
import Heatmap from './Heatmap';

const drawerWidth = 230;

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
    height: 240,
  },
}));

const UserDashboard = ({
  user,
  newUsername,
  handleUsernameSubmit,
  handleNewUsernameChange,
  oldPassword,
  newPassword,
  handlePasswordSubmit,
  handleNewPasswordChange,
  handleOldPasswordChange,
  correctEntry,
  helperText,
  errorMessage,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const handleLogoutClick = () => {
    window.localStorage.removeItem('loggedUser');
  };

  let { path } = useRouteMatch();

  return (
    <div className={classes.root}>
      <Switch>
        <Route
          exact
          path={[
            `${path}/`,
            `${path}/profile`,
            `${path}/uploadfiles`,
            `${path}/heatmap`,
          ]}
        >
          <CssBaseline />
          <AppBar
            position="absolute"
            className={clsx(classes.appBar, open && classes.appBarShift)}
            color="inherit"
          >
            <Toolbar className={classes.toolbar}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                className={clsx(
                  classes.menuButton,
                  open && classes.menuButtonHidden
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                Hello, {user.username}!
              </Typography>
              <Tooltip title="Logout">
                <Link color="inherit" href="/login">
                  <IconButton color="inherit" onClick={handleLogoutClick}>
                    <ExitToAppIcon fontSize="large" />
                  </IconButton>
                </Link>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(
                classes.drawerPaper,
                !open && classes.drawerPaperClose
              ),
            }}
            open={open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItems />
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />

            <Container maxWidth="lg" className={classes.container}>
              <Switch>
                <Route
                  exact
                  path="/user"
                  component={() => <Redirect to="/user/uploadfiles" />}
                />
                <Route exact path={`${path}/uploadfiles`}>
                  <UploadFiles />
                </Route>
                <Route exact path={`${path}/profile`}>
                  <Profile
                    user={user}
                    newUsername={newUsername}
                    handleUsernameSubmit={handleUsernameSubmit}
                    handleNewUsernameChange={handleNewUsernameChange}
                    oldPassword={oldPassword}
                    newPassword={newPassword}
                    handlePasswordSubmit={handlePasswordSubmit}
                    handleOldPasswordChange={handleOldPasswordChange}
                    handleNewPasswordChange={handleNewPasswordChange}
                    correctEntry={correctEntry}
                    errorMessage={errorMessage}
                    helperText={helperText}
                  />
                </Route>
                <Route exact path={`${path}/heatmap`}>
                  <Heatmap />
                </Route>
              </Switch>
              <Box pt={4}>
                <Footer />
              </Box>
            </Container>
          </main>
        </Route>
        <Route path="/user" component={Error404} />
      </Switch>
    </div>
  );
};

export default UserDashboard;
