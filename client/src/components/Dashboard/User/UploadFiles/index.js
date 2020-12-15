import React from 'react';
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';
import { Box } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';

import useStyles from './style';

const UploadFiles = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <input
        accept=".har"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
      />
      <Box padding={5} textAlign="center">
        <Typography component="p" variant="h3">
          Upload your HAR file
        </Typography>
      </Box>
      <Box textAlign="center">
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="primary"
            style={{ width: 250, height: 70 }}
            component="span"
          >
            <PublishIcon />
            <Box m={2}>
              <h2>Upload File</h2>
            </Box>
          </Button>
        </label>
      </Box>
    </div>
  );
};

export default UploadFiles;
