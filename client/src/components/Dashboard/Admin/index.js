import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

const Admin = () => {
  const user = useSelector((state) => state.user);

  const ad = user.isAdmin === true ? 'true' : 'false';

  if (!user.isAdmin) {
    return <Redirect to="/dashboard/user" />;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Hello, {user.username}</h2>
      <h3>isAdmin: {ad}</h3>
    </div>
  );
};

export default Admin;
