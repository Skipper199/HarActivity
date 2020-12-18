import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import DescriptionIcon from '@material-ui/icons/Description';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import useStyles from './style';
import filterHarFile from './filterHarFile';
import uploadService from '../../../../services/uploadFile';

const UploadFiles = () => {
  const classes = useStyles();

  const user = useSelector((state) => state.user);

  const [filteredFile, setFilteredFile] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrongFile, setOpenWrongFile] = useState(false);
  const [openError, setOpenError] = useState(false);

  const handleSelectedFile = (event) => {
    const filereader = new FileReader();

    // Reading a file as plain text if is exists
    if (event.target.files[0]) {
      filereader.readAsText(event.target.files[0]);
    }
    // Once the file has been read
    filereader.onload = function () {
      if (/.har/.test(event.target.files[0].name)) {
        const fileObj = JSON.parse(filereader.result);

        setFilteredFile(filterHarFile(fileObj));
        setLoaded(true);
      } else {
        setOpenWrongFile(true);
      }
    };
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setUploading(false);
    setUploaded(false);
    try {
      setUploading(true);
      await uploadService.upload(user.token, {
        harRequests: JSON.parse(filteredFile),
      });
      setOpenSuccess(true);
      setUploaded(true);
    } catch (error) {
      setOpenError(true);
    }
  };

  const handleClose = () => {
    setOpenSuccess(false);
  };

  const handleWrongFileClose = () => {
    setOpenWrongFile(false);
  };

  const handleErrorClose = () => {
    setOpenError(false);
    setUploading(false);
  };

  return (
    <div className={classes.root}>
      <input
        onChange={handleSelectedFile}
        accept=".har"
        className={classes.input}
        id="harFile"
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
                  <Box ml={2.5}>
                    <h6>Upload</h6>
                  </Box>
                </Button>
                to upload it to your profile.
              </h4>
            </>
          ) : (
            <></>
          )}
          {uploading && !uploaded ? (
            <div>
              <p>Please wait while we process your file.</p>
              <CircularProgress />
            </div>
          ) : (
            <></>
          )}

          {uploaded ? (
            <Snackbar
              open={openSuccess}
              autoHideDuration={5000}
              onClose={handleClose}
            >
              <Alert
                style={{ position: 'absolute', width: 490, left: -130 }}
                onClose={handleClose}
                severity="success"
              >
                Your files have been proccessed and uploaded successfully!
              </Alert>
            </Snackbar>
          ) : (
            <></>
          )}
          {openWrongFile ? (
            <Snackbar
              open={openWrongFile}
              autoHideDuration={5000}
              onClose={handleWrongFileClose}
            >
              <Alert
                style={{ position: 'absolute', width: 260, left: -10 }}
                onClose={handleWrongFileClose}
                severity="warning"
              >
                Please select a valid file.
              </Alert>
            </Snackbar>
          ) : (
            <></>
          )}
          {openError ? (
            <Snackbar
              open={openError}
              autoHideDuration={5000}
              onClose={handleErrorClose}
            >
              <Alert
                style={{ position: 'absolute', width: 350, left: -60 }}
                onClose={handleErrorClose}
                severity="error"
              >
                There was an error with the file upload.
              </Alert>
            </Snackbar>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default UploadFiles;
