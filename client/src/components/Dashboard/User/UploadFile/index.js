import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import DescriptionIcon from '@material-ui/icons/Description';
import { Box } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';

import useStyles from './style';
import filterHarFile from './filterHarFile';
import uploadService from '../../../../services/uploadFile';

const UploadFiles = () => {
  const classes = useStyles();

  const user = useSelector((state) => state.user);

  const [filteredFile, setFilteredFile] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSelectedFile = (event) => {
    const filereader = new FileReader();
    // Reading a file as plain text
    filereader.readAsText(event.target.files[0]);
    // Once the file has been read
    filereader.onload = function () {
      if (/.har/.test(event.target.files[0].name)) {
        const fileObj = JSON.parse(filereader.result);

        setFilteredFile(filterHarFile(fileObj));
        setLoaded(true);
      } else {
        setErrorMessage('Please select a valid file.');
      }
    };
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    try {
      await uploadService.upload(user.token, {
        harRequests: JSON.parse(filteredFile),
      });
      console.log('UPLOAD SUCCESSFULL');
    } catch (error) {
      console.log('FUCKs SUCCESSFULL');
    }
  };

  return (
    <div className={classes.root}>
      <input
        onChange={handleSelectedFile}
        accept=".har"
        className={classes.input}
        id="harFile"
        multiple
        type="file"
      />
      <Box padding={5} textAlign="center">
        <Typography component="p" variant="h3">
          Upload your HAR file
        </Typography>
      </Box>
      <Box textAlign="center">
        <label htmlFor="harFile">
          <Button
            variant="contained"
            color="primary"
            style={{ width: 250, height: 70 }}
            component="span"
          >
            <DescriptionIcon />
            <Box m={2}>
              <h2>Choose File</h2>
            </Box>
          </Button>
        </label>
        {loaded ? (
          <>
            <Link
              underline="none"
              href={`data:text/plain;charset=utf-8, ${encodeURIComponent(
                filteredFile
              )}`}
              download="file.json"
            >
              <Button
                variant="contained"
                color="primary"
                style={{ width: 250, height: 70 }}
                component="span"
              >
                <GetAppIcon />
                <Box m={2}>
                  <h2>Save File</h2>
                </Box>
              </Button>
            </Link>
            <Button
              onClick={handleUpload}
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
          </>
        ) : (
          <></>
        )}
      </Box>
    </div>
  );
};

export default UploadFiles;
