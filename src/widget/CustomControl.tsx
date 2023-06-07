import React from 'react';

import { Button, Stack, IconButton } from '@mui/material';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const BUTTON_WIDTH = 170;

export const CustomControl = (props: any): JSX.Element => {
  function changePage(page: any) {
    let update: any = JSON.parse(JSON.stringify(props.ui));
    update.page = page;
    props.onUpdate(update);
  }

  return (
    <Stack sx={{ width: '100%', position: 'relative' }}>
      {props.ui.page === 'cards' && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={4}
        ></Stack>
      )}
      {props.ui.page === 'table' && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={4}
        >
          <Stack sx={{ position: 'absolute', left: 0, top: 0 }}>
            <IconButton
              disabled={props.ui.auto}
              onClick={() => {
                changePage('cards');
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </Stack>

          <Button
            variant="contained"
            sx={{ width: BUTTON_WIDTH + 50 }}
            onClick={() => {
              changePage('monitor');
            }}
          >
            Start to Monitor
          </Button>
        </Stack>
      )}
      {props.ui.page === 'monitor' && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={4}
        >
          <Stack sx={{ position: 'absolute', left: 0, top: 0 }}>
            <IconButton
              disabled={props.ui.auto}
              onClick={() => {
                changePage('table');
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </Stack>

          <Button
            variant="contained"
            sx={{ width: BUTTON_WIDTH }}
            onClick={() => props.onButtonClick('read all')}
            disabled={props.ui.auto}
          >
            Read ALL
          </Button>
          <Button
            variant="contained"
            sx={{ width: BUTTON_WIDTH }}
            onClick={() => props.onButtonClick('write all')}
            disabled={props.ui.auto}
          >
            Write ALL
          </Button>
          <Button
            variant="contained"
            sx={{ width: BUTTON_WIDTH }}
            onClick={() => props.onButtonClick('read')}
            disabled={props.ui.auto}
          >
            Read Selected
          </Button>
          <Button
            variant="contained"
            sx={{ width: BUTTON_WIDTH }}
            onClick={() => props.onButtonClick('write')}
            disabled={props.ui.auto}
          >
            Write Selected
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default CustomControl;
