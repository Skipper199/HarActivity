import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MapIcon from '@material-ui/icons/Map';
import InfoIcon from '@material-ui/icons/Info';
import TimelineIcon from '@material-ui/icons/Timeline';
import HttpIcon from '@material-ui/icons/Http';

import { useHistory } from 'react-router-dom';

const ListItems = () => {
  const history = useHistory();
  return (
    <div>
      <ListItem button onClick={() => history.push('/admin/generalinfo')}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary="General Info" />
      </ListItem>
      <ListItem button onClick={() => history.push('/admin/responsetime')}>
        <ListItemIcon>
          <TimelineIcon />
        </ListItemIcon>
        <ListItemText primary="Response Time" />
      </ListItem>
      <ListItem button onClick={() => history.push('/admin/httpheaders')}>
        <ListItemIcon>
          <HttpIcon />
        </ListItemIcon>
        <ListItemText primary="HTTP Headers" />
      </ListItem>
      <ListItem button onClick={() => history.push('/admin/flowmap')}>
        <ListItemIcon>
          <MapIcon />
        </ListItemIcon>
        <ListItemText primary="Flow Map" />
      </ListItem>
    </div>
  );
};

export default ListItems;
