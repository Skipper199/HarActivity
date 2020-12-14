import React, { useState } from 'react';
import Signup from './components/Authentication/Signup';
import Login from './components/Authentication/Login';
import UserDashboard from './components/User/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import loginService from './services/login';
import signupService from './services/signup';
import profileService from './services/profile';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Error404 from './components/Error404';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [correctEntry, setCorrectEntry] = useState(false);

  // Checks if user is logged in
  const checkLoggedUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setIsLoggedIn(true);
      return user;
    } else {
      return null;
    }
  };

  const [user, setUser] = useState(checkLoggedUser);
  const [errorMessage, setErrorMessage] = useState(null);
  const [helperText, setHelperText] = useState(null);

  const history = useHistory();

  //Deletes messages for Change Username
  const deleteMessage = () => {
    setHelperText(null);
    setErrorMessage(null);
  };

  // Log in user and store the returned token
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedUser', JSON.stringify(user));

      setUser(user);
      setIsLoggedIn(true);
      user.isAdmin ? history.push('/admin') : history.push('/user');
      setErrorMessage(null);
    } catch (exception) {
      // Empties fields
      setUsername('');
      setPassword('');

      // Sets the error from server response
      setErrorMessage(exception.response.data.error);
    }
  };

  // Sign up user
  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      await signupService.signup({
        username,
        password,
        email,
      });

      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedUser', JSON.stringify(user));

      setUser(user);
      setIsLoggedIn(true);
      user.isAdmin ? history.push('/admin') : history.push('/user');
      setErrorMessage(null);
    } catch (exception) {
      // Empties fields
      setUsername('');
      setPassword('');
      setEmail('');

      // Sets the error from server response
      setErrorMessage(exception.response.data.error);
    }
  };

  const handleUpdateUsername = async (event) => {
    event.preventDefault();
    try {
      const newUsernameObj = await profileService.username(user.token, {
        newUsername: newUsername,
      });
      const newUser = {
        ...user,
        username: newUsernameObj.newUsername,
      };
      setUser(newUser);
      window.localStorage.setItem('loggedUser', JSON.stringify(newUser));
      setNewUsername('');
      setErrorMessage(null);
      setCorrectEntry(true);
      setHelperText('Username updated successfully');
      setTimeout(deleteMessage, 5000);
    } catch (exception) {
      setErrorMessage(exception.response.data.error);
      setTimeout(deleteMessage, 5000);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          {user.isAdmin ? (
            <Switch>
              <Route path={'/admin'}>
                <AdminDashboard admin={user} />
              </Route>
              <Route path={'/user'}>
                <Redirect to="/admin" />
              </Route>
              <Route exact path={['/login', '/signup', '/']}>
                <Redirect to="/admin" />
              </Route>
              <Route path={'/'}>
                <Error404 />
              </Route>
            </Switch>
          ) : (
            <Switch>
              <Route path={'/user'}>
                <UserDashboard
                  user={user}
                  newUsername={newUsername}
                  handleUsernameSubmit={handleUpdateUsername}
                  handleNewUsernameChange={({ target }) =>
                    setNewUsername(target.value)
                  }
                  errorMessage={errorMessage}
                  correctEntry={correctEntry}
                  helperText={helperText}
                />
              </Route>
              <Route path={'/admin'}>
                <Redirect to="/user" />
              </Route>
              <Route exact path={['/login', '/signup', '/']}>
                <Redirect to="/user" />
              </Route>
              <Route path={'/'}>
                <Error404 />
              </Route>
            </Switch>
          )}
        </>
      ) : (
        <Switch>
          <Route exact path={'/signup'}>
            <Signup
              username={username}
              password={password}
              email={email}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleEmailChange={({ target }) => setEmail(target.value)}
              handleSubmit={handleSignup}
              errorMessage={errorMessage}
            />
          </Route>
          <Route exact path={['/login', '/user', '/admin', '/']}>
            <Login
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
              errorMessage={errorMessage}
            />
          </Route>
          <Route path={'/'}>
            <Error404 />
          </Route>
        </Switch>
      )}
    </div>
  );
};

export default App;
