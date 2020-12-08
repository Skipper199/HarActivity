import React, { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import loginService from './services/login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
    console.log('Already logged in');
  }, []);

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
      console.log(`Logged in as: ${user.username}`);
    } catch (exception) {
      console.log('Wrong credentials');
    }
  };

  return (
    <div>
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/login">
          <Login
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Route>
        <Route path="/">
          <Signup />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
