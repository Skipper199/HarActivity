import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
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
import InfoIcon from '@material-ui/icons/Info';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

import useStyles from './style';
import signupService from '../../services/signup';
import loginService from '../../services/login';
import { setLoggedUser } from '../../reducers/user';

const Signup = () => {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.user);

  if (user.username !== '') {
    return <Redirect to="/dashboard" />;
  }

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      await signupService.signup({
        username,
        password,
        confirmPassword,
        email,
      });

      const loggedUser = await loginService.login({
        username,
        password,
      });

      dispatch(setLoggedUser(loggedUser));
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

      history.push('/dashboard');
    } catch (exception) {
      // Empties fields
      if (exception.response.data.error.includes('Username')) setUsername('');
      if (exception.response.data.error.includes('Email')) setEmail('');
      if (exception.response.data.error.includes('Password' || 'Passwords')) {
        setPassword('');
        setConfirmPassword('');
      }

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
          Sign up
        </Typography>
        <form onSubmit={handleSignup} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="username"
                label="Username"
                type="username"
                id="username"
                autoComplete="username"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        title={
                          <>
                            Password must:<br></br>* Be at least 8 characters
                            long<br></br>* Contain at least 1 upper case letter
                            <br></br>* Contain at least 1 number<br></br>*
                            Contain at least 1 symbol<br></br>
                          </>
                        }
                      >
                        <InfoIcon />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                value={confirmPassword}
                onChange={({ target }) => setConfirmPassword(target.value)}
              />
            </Grid>
          </Grid>
          {/* If the error exists show it */}
          {errorMessage !== '' &&
          (username === '' ||
            password === '' ||
            email === '' ||
            confirmPassword === '') ? (
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
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          HarActivity {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
