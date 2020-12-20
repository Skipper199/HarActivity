import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import generalInfoService from '../../../../services/admin/generalInfo';

const NumberOfDomains = () => {
  // Get logged user
  const user = useSelector((state) => state.user);

  const [numberOfDomains, setNumberOfDomains] = useState(0);

  // Fetch upload data from server
  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    async function fetchData() {
      const domains = await generalInfoService.numberOfDomains(user.token);
      if (isMounted) {
        setNumberOfDomains(domains.count);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  });

  return (
    <div>
      <h1>Number of Domains: {numberOfDomains} </h1>
    </div>
  );
};

export default NumberOfDomains;
