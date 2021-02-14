/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { DataGrid } from '@material-ui/data-grid';

import profileService from '../../../../services/user/profile';
import userStatsService from '../../../../services/user/userStats';
import useStyles from './style';

const Profile = ({ setUsername }) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper);

  // Get logged user
  const user = useSelector((state) => state.user);

  const [rows, setRows] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0);

  const [lastUpload, setLastUpload] = useState();

  // Fetch upload data from server
  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    async function fetchData() {
      const rows = await userStatsService.userstats(user.token);
      if (isMounted) {
        setRows(rows);
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        const requestsArray = rows.map((item) => item.requests);
        const dateArray = rows.map((item) => item.date);
        if (rows.length !== 0) {
          setTotalRequests(requestsArray.reduce(reducer));
          setLastUpload(dateArray[rows.length - 1]);
        }
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  },[]);

  // Set collumns for table
  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'date', headerName: 'Date & Time', width: 250 },
    {
      field: 'requests',
      headerName: 'Requests',
      type: 'number',
      width: 150,
    },
  ];

  // useState for username update form
  const [newUsername, setNewUsername] = useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [correctUsernameEntry, setCorrectUsernameEntry] = useState(false);
  const [usernameHelperText, setUsernameHelperText] = useState('');

  // useState for password update form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [correctPasswordEntry, setCorrectPasswordEntry] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordHelperText, setPasswordHelperText] = useState('');

  const deleteMessage = () => {
    setUsernameHelperText('');
    setUsernameErrorMessage('');
    setPasswordHelperText('');
    setPasswordErrorMessage('');
  };

  // Handle username update
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

      setUsername(newUsernameObj.newUsername);
      window.localStorage.setItem('loggedUser', JSON.stringify(newUser));

      setNewUsername('');
      setUsernameErrorMessage('');
      setCorrectUsernameEntry(true);
      setUsernameHelperText('Username updated successfully!');
      setTimeout(deleteMessage, 5000);
    } catch (exception) {
      setNewUsername('');
      setTimeout(deleteMessage, 5000);
      setUsernameErrorMessage(exception.response.data.error);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    try {
      await profileService.password(user.token, {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      setOldPassword('');
      setNewPassword('');
      setPasswordErrorMessage('');
      setCorrectPasswordEntry(true);
      setPasswordHelperText('Password updated successfully!');
      setTimeout(deleteMessage, 5000);
    } catch (exception) {
      setPasswordErrorMessage(exception.response.data.error);
      setOldPassword('');
      setNewPassword('');
      setTimeout(deleteMessage, 5000);
    }
  };

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} direction="column">
          {/* Recent Uploaded Files */}
          <Box marginTop={4} marginLeft={2}>
            <Typography component="p" variant="h4">
              Uploaded Files
            </Typography>
          </Box>
          <Grid item xs={12} md={8} lg={7}>
            <Paper className={fixedHeightPaper}>
              <div style={{ height: 280, width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  hideFooter={true}
                />
              </div>
              <h4>
                Total Files: {rows.length} <br></br> Total Requests:{' '}
                {totalRequests} <br></br> Date of Last Upload: {lastUpload}
              </h4>
            </Paper>
          </Grid>
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
                onSubmit={handleUpdateUsername}
                className={classes.form}
                noValidate
              >
                <Grid container alignItems="center">
                  <Box mt={1} mr={0} mb={1} ml={1}>
                    <TextField
                      autoComplete="off"
                      error={usernameErrorMessage === '' ? false : true}
                      variant="outlined"
                      style={{ width: 175 }}
                      size="small"
                      color="primary"
                      name="usernameChange"
                      label="New Username"
                      id="usernameChange"
                      value={newUsername}
                      onChange={({ target }) => setNewUsername(target.value)}
                      helperText={
                        usernameErrorMessage === '' && correctUsernameEntry
                          ? usernameHelperText
                          : usernameErrorMessage
                      }
                      FormHelperTextProps={{
                        className:
                          usernameErrorMessage === '' && correctUsernameEntry
                            ? classes.helperTextSuccess
                            : classes.helperTextError,
                      }}
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
                      <h4>Update</h4>
                    </Button>
                  </Box>
                </Grid>
              </form>

              <Box marginTop={3} paddingLeft={1}>
                <Typography component="p" variant="h5">
                  Change Password
                </Typography>
              </Box>
              <form
                onSubmit={handleUpdatePassword}
                className={classes.form}
                noValidate
              >
                <Grid container alignItems="center">
                  <Box mt={1} mr={1.5} mb={1} ml={1}>
                    <TextField
                      error={passwordErrorMessage === '' ? false : true}
                      type="password"
                      variant="outlined"
                      style={{ width: 175 }}
                      size="small"
                      color="primary"
                      name="oldPassword"
                      label="Old Password"
                      id="oldPassword"
                      value={oldPassword}
                      onChange={({ target }) => setOldPassword(target.value)}
                      helperText={
                        passwordErrorMessage === '' && correctPasswordEntry
                          ? passwordHelperText
                          : passwordErrorMessage
                      }
                      FormHelperTextProps={{
                        className:
                          passwordErrorMessage === '' && correctPasswordEntry
                            ? classes.helperTextSuccess
                            : classes.passwordHelperTextError,
                      }}
                    />
                  </Box>
                  <Box mt={1} mr={0} mb={1} ml={1}>
                    <TextField
                      error={passwordErrorMessage === '' ? false : true}
                      type="password"
                      variant="outlined"
                      style={{ width: 175 }}
                      size="small"
                      color="primary"
                      name="newPassword"
                      label="New Password"
                      id="newPassword"
                      value={newPassword}
                      onChange={({ target }) => setNewPassword(target.value)}
                      FormHelperTextProps={{
                        className:
                          passwordErrorMessage === '' && correctPasswordEntry
                            ? classes.helperTextSuccess
                            : classes.helperTextError,
                      }}
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
                      <h4>Update</h4>
                    </Button>
                  </Box>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Profile;
