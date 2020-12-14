import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

import Footer from '../Footer';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://i.imgur.com/2EiDBoG.png)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Signup = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  handleEmailChange,
  username,
  password,
  email,
  errorMessage,
}) => {
  const classes = useStyles();
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    name="username"
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    autoFocus
                    value={username}
                    onChange={handleUsernameChange}
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
                    autoComplete="off"
                    value={email}
                    onChange={handleEmailChange}
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
                    autoComplete="off"
                    value={password}
                    onChange={handlePasswordChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip
                            title="Password: must be at least 8 characters long, contain at
                                  least an upper case letter, a number and a symbol."
                          >
                            <InfoIcon />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  ></TextField>
                </Grid>
              </Grid>
              {/* If the error exists show it */}
              {errorMessage === null ? (
                <></>
              ) : (
                <div>
                  <br></br>
                  <Alert variant="outlined" severity="error">
                    {errorMessage}
                  </Alert>
                </div>
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
                    Already have an account? Log in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={5}>
            <Footer />
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Signup;
