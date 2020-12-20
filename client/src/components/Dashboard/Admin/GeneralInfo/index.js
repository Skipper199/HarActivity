import React from 'react';
import Button from '@material-ui/core/Button';

import NumberOfUsers from './NumberOfUsers';

const GeneralInfo = () => {
  return (
    <div>
      <Button variant="contained">General Info</Button>
      <NumberOfUsers />
    </div>
  );
};

export default GeneralInfo;
