import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CloudUpload from '@material-ui/icons/CloudUpload';
import MapIcon from '@material-ui/icons/Map';

import { useHistory } from 'react-router-dom';

const ListItems = () => {
  const history = useHistory();
  return (
    <div>
      <ListItem button onClick={() => history.push('/dashboard/profile')}>
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem button onClick={() => history.push('/dashboard/uploadfiles')}>
        <ListItemIcon>
          <CloudUpload />
        </ListItemIcon>
        <ListItemText primary="Upload Files" />
      </ListItem>
      <ListItem button onClick={() => history.push('/dashboard/heatmap')}>
        <ListItemIcon>
          <MapIcon />
        </ListItemIcon>
        <ListItemText primary="Heatmap" />
      </ListItem>
    </div>
  );
};

export default ListItems;
