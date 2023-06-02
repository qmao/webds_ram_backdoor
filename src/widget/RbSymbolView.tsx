import React, { useEffect, useState } from 'react';
import { Divider, Stack, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';

import { RbAccordions } from './RbAccordions';
import { getSymbolTable } from './data';

import EditIcon from '@mui/icons-material/Edit';
import { RbSymbolList } from './RbSymbolList';
import { updateWatch } from './api';
import { RbNameDialog } from './RbNameDialog';

export const RbSymbolView = (props: any): JSX.Element => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let slist: any = getSymbolTable();

    slist = slist.map((s: any) => {
      return {
        ...s,
        search: s.address + ' - ' + s.name
      };
    });

    setRows(slist);

    console.log('UI WATCH', props.ui.watch);
  }, []);

  function onListUpdate(slist: any) {
    let update: any = { ...props.ui };
    update.watch.symbols = slist;
    props.onUpdate(update);
    updateWatch(update.watch).then((l: any) => {
      console.log('Updated:', l);
    });
  }

  const Rename = (modify: any, name?: any) => {
    if (modify) {
      let update: any = { ...props.ui };
      update.watch.name = name;
      props.onUpdate(update);
      updateWatch(update.watch).then((l: any) => {
        console.log('Updated:', l);
      });
    }
    setOpen(false);
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      sx={{ width: '100%', height: '100%' }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: 'primary.main', width: '100%' }}
        spacing={2}
      >
        <Typography sx={{ fontSize: 18, color: 'white', p: 1 }}>
          {props.ui.watch.name}
        </Typography>
        <IconButton
          onClick={() => {
            setOpen(true);
          }}
        >
          <EditIcon sx={{ fontSize: 18, color: 'white' }} />
        </IconButton>
      </Stack>
      <Stack direction="row" sx={{ width: '100%', height: '100%', m: 2 }}>
        <Stack sx={{ width: '50%' }}>
          <RbSymbolList
            symbols={rows}
            default={props.ui.watch.symbols}
            update={onListUpdate}
          />
        </Stack>
        <Divider orientation="vertical" />
        <Stack sx={{ width: '50%', m: 1 }}>
          <RbAccordions onUpdate={props.onUpdate} ui={props.ui} />
        </Stack>
      </Stack>
      <RbNameDialog
        title={'Create New Symbol List'}
        open={open}
        onClose={Rename}
      />
    </Stack>
  );
};

export default RbSymbolView;
