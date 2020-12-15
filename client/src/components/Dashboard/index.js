import React from 'react';
import { useSelector } from 'react-redux';
import { Route, useRouteMatch, Switch, Redirect } from 'react-router-dom';

import User from './User/index';
import Admin from './Admin/index';
import Error404 from '../Error404/index';

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const { path } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${path}/user`}>
          <User />
        </Route>
        <Route path={`${path}/admin`}>
          <Admin />
        </Route>
        <Route path={`${path}`}>
          {user.isAdmin ? (
            <Redirect to={`${path}/admin`} />
          ) : (
            <Redirect to={`${path}/user`} />
          )}
        </Route>
        <Route path={'/'}>
          <Error404 />
        </Route>
      </Switch>
    </div>
  );
};

export default Dashboard;
