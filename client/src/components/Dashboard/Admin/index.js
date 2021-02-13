import React, { useState } from 'react';
import clsx from 'clsx';
import { Route, useRouteMatch, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';

import ListItems from './ListItems/index';
import GeneralInfo from './GeneralInfo/index';
import ResponseTime from './ResponseTime/index';
import CacheInfo from './CacheInfo/index';
import Flowmap from './Flowmap/index';
import Error404 from '../../Error404/index';

import useStyles from './style';

const Admin = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);

  // eslint-disable-next-line no-unused-vars
  const [username, setUsername] = useState(user.username);

  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogoutClick = () => {
    window.localStorage.removeItem('loggedUser');
  };

  const { path } = useRouteMatch();

  if (!user.isAdmin) {
    return <Redirect to="/dashboard/user" />;
  }

  return (
    <div className={classes.root}>
      <Switch>
        <Route
          exact
          path={[
            `${path}/generalinfo`,
            `${path}/responsetime`,
            `${path}/cacheinfo`,
            `${path}/flowmap`,
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
                Hello, {username}!
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
                  path="/admin"
                  component={() => <Redirect to="/admin/generalinfo" />}
                />
                <Route exact path={`${path}/generalinfo`}>
                  <GeneralInfo />
                </Route>
                <Route exact path={`${path}/responsetime`}>
                  <ResponseTime />
                </Route>
                <Route exact path={`${path}/cacheinfo`}>
                  <CacheInfo />
                </Route>
                <Route exact path={`${path}/flowmap`}>
                  <Flowmap />
                </Route>
              </Switch>
              <Box pt={4}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  {'Copyright © '}
                  HarActivity {new Date().getFullYear()}
                  {'.'}
                </Typography>
              </Box>
            </Container>
          </main>
        </Route>
        <Route exact path={`${path}`}>
          {' '}
          <Redirect to={`${path}/generalinfo`} />
        </Route>
        <Route path="/">
          <Error404 />
        </Route>
      </Switch>
    </div>
  );
};

export default Admin;
