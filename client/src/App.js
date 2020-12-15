import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Home from './components/Home/index';
import Login from './components/Login/index';
import Signup from './components/Signup/index';
import Dashboard from './components/Dashboard/index';
import Error404 from './components/Error404/index';
import { setLoggedUser } from './reducers/user';

const App = () => {
  const dispatch = useDispatch();

  // Check is user is already logged in
  const loggedUserJSON = window.localStorage.getItem('loggedUser');
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    dispatch(setLoggedUser(user));
  }

  const user = useSelector((state) => state.user);

  return (
    <Router>
      <Switch>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route path="/dashboard">
          {user.username !== '' ? <Dashboard /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route path={'/'}>
          <Error404 />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
