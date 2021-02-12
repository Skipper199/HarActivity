import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

import useStyles from './style';
import loginService from '../../services/login';
import { setLoggedUser } from '../../reducers/user';

const Login = () => {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.user);

  if (user.username !== '') {
    return <Redirect to="/dashboard" />;
  }

  // Log in user and store the returned token
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({
        username,
        password,
      });

      dispatch(setLoggedUser(loggedUser));
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

      history.push('/dashboard');
    } catch (exception) {
      // Empties fields
      setUsername('');
      setPassword('');

      // Sets the error from server response
      setErrorMessage(exception.response.data.error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <form onSubmit={handleLogin} className={classes.form} noValidate>
          <TextField
            autoComplete="username"
            name="username"
            variant="outlined"
            required
            fullWidth
            id="username"
            label="Username"
            autoFocus
            margin="normal"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            margin="normal"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          {/* If the error exists show it */}
          {errorMessage !== '' && (username === '' || password === '') ? (
            <div>
              <br></br>
              <Alert variant="outlined" severity="error">
                {errorMessage}
              </Alert>
            </div>
          ) : (
            <>{errorMessage ? setErrorMessage('') : <></>}</>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Log In
          </Button>

          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          HarActivity {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
