import React, { useState } from 'react';
import {
  Button,
  TextField,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

export const RbNameDialog = (props: any) => {
  const [name, setName] = useState('');
  const handleClose = (create: any) => {
    props.onClose(create, name);
  };

  const onChange = (e: any) => {
    console.log(e.target.value);
    setName(e.target.value);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => handleClose(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{props.title}</DialogTitle>
        <DialogContent sx={{ width: 300 }}>
          <Stack>
            <TextField
              id="standard-basic"
              label="Name"
              variant="standard"
              onChange={onChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleClose(true)}
            autoFocus
            disabled={name === ''}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RbNameDialog;
