import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import generalInfoService from '../../../../services/admin/generalInfo';


const NumberOfUsers = () => {

  // Get logged user
  const user = useSelector((state) => state.user);

  const [numberOfUsers, setNumberOfUsers] = useState(0);

  // Fetch upload data from server
  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    async function fetchData() {
      const users = await generalInfoService.numberOfUsers(user.token);
      if (isMounted) {
        setNumberOfUsers(users.count);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  });

  return (
    <div>
      <h1>Number of Users: {numberOfUsers} </h1>
    </div>
  );
};

export default NumberOfUsers;
