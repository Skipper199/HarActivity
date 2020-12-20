import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import generalInfoService from '../../../../services/admin/generalInfo';

const NumberOfISPs = () => {
  // Get logged user
  const user = useSelector((state) => state.user);

  const [numberOfISPs, setNumberOfISPs] = useState(0);

  // Fetch upload data from server
  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    async function fetchData() {
      const ISPs = await generalInfoService.numberOfISPs(user.token);
      if (isMounted) {
        setNumberOfISPs(ISPs.count);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  });

  return (
    <div>
      <h1>Number of ISPs: {numberOfISPs} </h1>
    </div>
  );
};

export default NumberOfISPs;
