import React from 'react';
import Button from '@material-ui/core/Button';

import CountTable from './CountTable';
import NumberOfMethods from './NumberOfMethods';
import NumberOfStatus from './NumberOfStatus';
import Grid from '@material-ui/core/Grid';

const GeneralInfo = () => {
  return (
    <div>
      <CountTable />
      <div>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <h2 style={{ textAlign: 'center' }}>Request Methods</h2>
            <NumberOfMethods />
          </Grid>
          <Grid item xs={6}>
            <h2 style={{ textAlign: 'center' }}>Status Codes</h2>
            <NumberOfStatus />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default GeneralInfo;
