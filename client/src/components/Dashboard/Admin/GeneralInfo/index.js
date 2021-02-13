import React from 'react';

import CountTable from './CountTable';
import NumberOfMethods from './NumberOfMethods';
import NumberOfStatus from './NumberOfStatus';
import AverageAge from './AverageAge';

const GeneralInfo = () => {
  return (
    <div>
      <CountTable />

      <h2 style={{ textAlign: 'center' }}>Request Methods</h2>
      <NumberOfMethods />

      <h2 style={{ textAlign: 'center', marginTop: '100px' }}>Status Codes</h2>
      <NumberOfStatus />

      <h2 style={{ textAlign: 'center', marginTop: '100px' }}>
        Average Age Per Content Type (Hours)
      </h2>

      <AverageAge />
    </div>
  );
};

export default GeneralInfo;
