import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import generalInfoService from '../../../../services/admin/generalInfo';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },

  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#212121',
  },
  container: {
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

const CountTable = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper);
  // Get logged user
  const user = useSelector((state) => state.user);

  // const [numberOfUsers, setNumberOfUsers] = useState(0);
  // const [numberOfDomains, setNumberOfDomains] = useState(0);
  // const [numberOfISPs, setNumberOfISPs] = useState(0);
  const [rows, setRows] = useState([]);

  // Fetch upload data from server
  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    async function fetchData() {
      const info = await generalInfoService.countInfo(user.token);
      if (isMounted) {
        // setNumberOfUsers(info.usersCount);
        // setNumberOfDomains(info.domainsCount);
        // setNumberOfISPs(info.ispsCount);
        function createData(name, count) {
          return { name, count };
        }
        const rows = [
          createData('Users', info.usersCount),
          createData('Unique Domains', info.domainsCount),
          createData('Unique ISPs', info.ispsCount),
        ];
        setRows(rows);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} direction="column">
          <Box display="flex" justifyContent="center">
            <Grid item xs={12} md={8} lg={3}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <h3>Name</h3>
                      </TableCell>
                      <TableCell align="center">
                        <h3>Count</h3>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell align="left" component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="center">{row.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Box>
        </Grid>
      </Container>
    </div>
  );
};

export default CountTable;
