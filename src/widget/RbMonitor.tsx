import React, { useEffect, useState } from 'react';
import {
  Divider,
  Stack,
  Toolbar,
  Chip,
  Input,
  Collapse,
  IconButton,
  Grid,
  AppBar,
  FormGroup,
  FormControlLabel,
  Switch,
  Checkbox
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { MyTypography } from './constants';

interface ISymbol {
  address: any;
  name: any;
  data: any;
  latest: any;
  select: any;
  format: any;
}

const SymbolRow = (props: any) => {
  const [open, setOpen] = useState(false);

  const handleChange = (index: any) => {
    props.onSelectChange(index);
  };

  const updateValue = (data: any, format: any) => {
    const newValue = parseInt(data, format);
    if (newValue > 0xffffffff) return;
    if (!isNaN(newValue)) props.update(props.index, newValue);
    if (data === '') props.update(props.index, '');
  };

  const LoadContent = (data: any) => {
    if (data.length)
      return (
        <Stack direction="row" spacing={2} sx={{ p: 1 }}>
          <Stack direction="column" sx={{ p: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <MyTypography sx={{ width: 60 }}>Hex</MyTypography>
              <Input
                sx={{ fontSize: 12, width: 120 }}
                value={data[0].toString(16)}
                onChange={(event: any) => {
                  updateValue(event.target.value, 16);
                }}
              />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <MyTypography sx={{ width: 60 }}>Decimal</MyTypography>
              <Input
                sx={{ fontSize: 12, width: 120 }}
                value={data[0].toString(10)}
                onChange={(event: any) => {
                  updateValue(event.target.value, 10);
                }}
              />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <MyTypography sx={{ width: 60 }}>Binary</MyTypography>
              <Input
                sx={{ fontSize: 12, width: 300 }}
                value={data[0].toString(2)}
                onChange={(event: any) => {
                  updateValue(event.target.value, 2);
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      );
    return <></>;
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{ backgroundColor: '#f0f0f0', height: 30 }}
      >
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setOpen(!open)}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <Checkbox
          checked={props.symbol.select}
          onChange={(e) => {
            handleChange(props.index);
          }}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <Stack
          alignItems="center"
          sx={{
            width: '45%',
            height: '100%',
            overflow: 'true',
            p: 1
          }}
          direction="row"
          spacing={2}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 60,
              height: '100%',
              textAlign: 'center'
            }}
          >
            <MyTypography>
              {'0x' + props.symbol.address.toString(16)}
            </MyTypography>
          </Stack>

          <MyTypography
            sx={{
              width: 250,
              pl: 2,
              fontSize: 12
            }}
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}
          >
            {props.symbol.name}
          </MyTypography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            backgroundColor: 'white',
            width: '100%',
            height: '80%',
            px: 2,
            borderRadius: 0
          }}
        >
          {props.symbol.data.map((d: any, index: any) => (
            <Chip
              key={'chip' + index}
              color={
                index === 0
                  ? d === props.symbol.latest
                    ? 'success'
                    : 'error'
                  : 'default'
              }
              label={
                <Stack alignItems="center">
                  <MyTypography
                    sx={{
                      transform:
                        props.symbol.format === 16
                          ? 'scale(1)'
                          : props.symbol.format === 2
                          ? 'scale(0.7)'
                          : 'scale(1)'
                    }}
                  >
                    {d
                      .toString(props.symbol.format)
                      .padStart(
                        props.symbol.format === 16
                          ? 8
                          : props.symbol.format === 2
                          ? 16
                          : 0,
                        '0'
                      )
                      .toUpperCase()}
                  </MyTypography>
                </Stack>
              }
              variant={index === 0 ? 'filled' : 'outlined'}
              size="small"
              sx={{ width: '13ch' }}
            />
          ))}
        </Stack>
      </Stack>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {LoadContent(props.symbol.data)}
      </Collapse>
      <Divider />
    </>
  );
};

export const RbMonitor = (props: any): JSX.Element => {
  const [checked, setChecked] = useState(true);
  const [symbols, setSymbols] = useState<ISymbol[]>([]);

  useEffect(() => {
    let update: ISymbol[] = [];
    props.ui.watch.symbols.forEach((s: any) => {
      let newSymbol: ISymbol = {
        address: s.address,
        name: s.name,
        data: [],
        latest: undefined,
        select: true,
        format: props.ui.watch.settings.format
      };
      update.push(newSymbol);
    });
    setSymbols(update);
  }, []);

  const ReadSymbols = (all: any) => {
    let update: any = symbols;
    update.forEach((s: any) => {
      if (s.select || all) {
        const numToRemove = 5;
        if (s.data.length > numToRemove) {
          s.data.splice(-1); // Remove the latest items
        }
        s.data.unshift(Math.floor(Math.random() * 101));
        s.latest = s.data[0];
      }
    });
    setSymbols(update);
  };

  useEffect(() => {
    switch (props.callback) {
      case 'read all':
        console.log('READ ALL');
        props.resetCallback('');
        ReadSymbols(true);
        break;

      case 'write all':
        console.log('WRITE ALL');
        props.resetCallback('');
        break;

      case 'read':
        console.log('READ SELECT');
        props.resetCallback('');
        ReadSymbols(false);
        break;

      case 'write':
        console.log('WRITE SELECT');
        props.resetCallback('');
        break;
    }
  }, [props.callback]);

  const updateSymbolData = (index: any, data: any) => {
    let update: any = JSON.parse(JSON.stringify(symbols));
    update[index].data[0] = data;
    setSymbols(update);
    console.log(update);
  };

  const onSelectItemChange = (index: any) => {
    let update: any = JSON.parse(JSON.stringify(symbols));

    update[index].select = !update[index].select;
    setSymbols(update);
  };

  const onSelectChange = (c: any) => {
    setChecked(!checked);
    let update: any = JSON.parse(JSON.stringify(symbols));

    update.map((s: any) => (s.select = c));
    setSymbols(update);
  };

  function LoadTitle() {
    return (
      <Grid
        container
        alignItems="center"
        sx={{ backgroundColor: '#e0e0e0', height: 40, width: '100%' }}
      >
        <Grid item xs={0.4}></Grid>
        <Grid item xs={0.6}>
          <Checkbox
            checked={checked}
            onChange={(e) => onSelectChange(e.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>

        <Grid item xs={1}>
          <MyTypography fontWeight="bold" sx={{ fontSize: 14 }}>
            Address
          </MyTypography>
        </Grid>
        <Grid item xs={1}>
          <MyTypography fontWeight="bold" sx={{ fontSize: 14 }}>
            Symbol
          </MyTypography>
        </Grid>
      </Grid>
    );
  }

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let update: any = JSON.parse(JSON.stringify(props.ui));
    update.auto = event.target.checked;
    props.onUpdate(update);
  };

  return (
    <Stack
      direction="column"
      sx={{ width: '100%', border: '3px solid #f0f0f0', overflow: 'auto' }}
    >
      <AppBar position="static">
        <Toolbar variant="dense">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch color="secondary" onChange={handleSwitchChange} />
              }
              label="Auto Refresh"
              labelPlacement="start"
            />
          </FormGroup>
        </Toolbar>
      </AppBar>
      {LoadTitle()}
      <Divider />

      {symbols.map((s: any, index: any) => (
        <SymbolRow
          key={`symbol-${index}`} // Unique key prop
          symbol={s}
          index={index}
          update={updateSymbolData}
          onSelectChange={onSelectItemChange}
        />
      ))}
    </Stack>
  );
};

export default RbMonitor;
