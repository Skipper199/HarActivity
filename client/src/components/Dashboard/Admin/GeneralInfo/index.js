import React from 'react';
import Button from '@material-ui/core/Button';

import NumberOfUsers from './NumberOfUsers';
import NumberOfMethods from './NumberOfMethods';
import NumberOfStatus from './NumberOfStatus';
import NumberOfDomains from './NumberOfDomains';
import NumberOfISPs from './NumberOfISPs';

const GeneralInfo = () => {
  return (
    <div>
      <Button variant="contained">General Info</Button>
      <NumberOfUsers />
      <NumberOfDomains />
      <NumberOfISPs />
      <NumberOfMethods />
      <NumberOfStatus />
    </div>
  );
};

export default GeneralInfo;
