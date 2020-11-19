import React, { useState } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function FileUpload(props) {
  const [file, setFile] = useState('');
  const [progress, setProgess] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setProgess(0);
    const file = e.target.files[0]; // accesing file
    console.log(file);
    setFile(file); // storing file
  };

  const uploadFile = () => {
    const formData = new FormData();
    formData.append('file', file); // appending file
    axios
      .post(process.env.REACT_APP_BACKEND_URL + '/calculate/parse', formData, {
        onUploadProgress: (ProgressEvent) => {
          let progress =
            Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
            '%';
          setProgess(progress);
        },
      })
      .then((res) => {
        props.readFile(res.data.result);
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          setErrorMessage(error.response.data.error);
          handleClickOpen();
        }
      });
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Error'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <label htmlFor='upload-photo'>
        <input
          id='upload-photo'
          name='upload-photo'
          type='file'
          onChange={handleChange}
        />

        {/* {file &&  uploadFile()} */}
      </label>
      <Button
        onClick={uploadFile}
        color='secondary'
        variant='contained'
        component='span'
      >
        Upload XML File
      </Button>
    </div>
  );
}
export default FileUpload;
