import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import DescriptionIcon from '@material-ui/icons/Description';
import { Box, Grid } from '@material-ui/core';

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
      console.log('Not Successfull');
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
          Choose a HAR file to filter
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
        <Box m={3}>
          {loaded ? (
            <>
              <Typography component="p" variant="h5">
                Your file has been successfully filtered!
              </Typography>

              <h4>
                Click{' '}
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
                    style={{
                      width: 70,
                      height: 30,
                      marginLeft: 3,
                      marginRight: 4,
                    }}
                    component="span"
                  >
                    <GetAppIcon
                      fontSize="small"
                      style={{ position: 'absolute', left: '5' }}
                    />
                    <Box ml={2.5}>
                      <h6>Save</h6>
                    </Box>
                  </Button>
                </Link>
                to save the file locally or click
                <Button
                  onClick={handleUpload}
                  variant="contained"
                  color="primary"
                  style={{
                    width: 80,
                    height: 30,
                    marginLeft: 6,
                    marginRight: 6,
                  }}
                  component="span"
                >
                  <PublishIcon
                    fontSize="small"
                    style={{ position: 'absolute', left: '6' }}
                  />
                  <Box ml={2}>
                    <h6>Upload</h6>
                  </Box>
                </Button>
                to upload it to your profile.
              </h4>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default UploadFiles;
