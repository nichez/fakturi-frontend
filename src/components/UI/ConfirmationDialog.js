import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import { deleteRequest } from '../../services/httpService';

const ConfirmationDialog = (props) => {
  const { open, handleClose, item, text, path } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await deleteRequest(`/${path}`, `/${item.shifra}`);
    if (result.status === 200) {
      setTimeout(() => {
        setIsLoading(false);
        handleClose();
      }, 1000);
    }
    else {
      console.log('ERROR REQ DEL ', result);
      setTimeout(() => {
        setIsLoading(false);
        handleClose('error');
      }, 1000);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
        {text}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{item.ime}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <div style={{ marginRight: 230, marginBottom: 10 }}>
            <CircularProgress color='secondary' />
          </div>
        ) : (
          <div>
            <Button autoFocus onClick={() => handleClose()} color='primary'>
              NE
            </Button>
            <Button
              onClick={() => handleDelete()}
              color='primary'
              variant='contained'
              style={{backgroundColor: '#f44336'}}
            >
              DA
            </Button>
          </div>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
