import React from 'react';

import Ttl from './Ttl';
import RequestDirectives from './RequestDirectives';
import ResponseDirectives from './ResponseDirectives';

const CacheInfo = () => {
  return (
    <div>
      <Ttl />
      <RequestDirectives />
      <ResponseDirectives />
    </div>
  );
};

export default CacheInfo;
