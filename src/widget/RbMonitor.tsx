import React, { useRef, useEffect, useState } from 'react';
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
    Checkbox,
    Snackbar,
    Alert,
    AlertColor,
    Typography
} from '@mui/material';

import { openJsonInNewWindow } from './RbLog';
import { webdsService } from './local_exports';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { MyTypography } from './constants';
import { ReadRAM, WriteRegisters, TerminateSSE } from './api';

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

    const updateValue = (event: any, format: any) => {
        let data: any = event.target.value;
        const newValue = parseInt(data, format);

        if (format === 2) {
            const binaryPattern = /^[01]+$/; // Regular expression pattern for binary string
            const isValidBinary = binaryPattern.test(data);

            if (!isValidBinary || data.length > 32) {
                const substringLength = data.length - 1;
                const substring = data.substring(0, substringLength);
                event.target.value = substring;
                return;
            }
        }

        if (newValue > 0xffffffff) return;

        if (!isNaN(newValue)) {
            props.update(props.index, newValue);
        } else {
            props.update(props.index, '');
            event.target.value = '';
        }
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
                                    updateValue(event, 16);
                                }}
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <MyTypography sx={{ width: 60 }}>Decimal</MyTypography>
                            <Input
                                sx={{ fontSize: 12, width: 120 }}
                                value={data[0].toString(10)}
                                onChange={(event: any) => {
                                    updateValue(event, 10);
                                }}
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <MyTypography sx={{ width: 60 }}>Binary</MyTypography>
                            <Input
                                sx={{ fontSize: 12, width: 300 }}
                                defaultValue={data[0].toString(2)}
                                onChange={(event: any) => {
                                    updateValue(event, 2);
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            );
        return <></>;
    };

    const webdsTheme = webdsService.ui.getWebDSTheme();

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                sx={{ backgroundColor: webdsTheme.palette.section, height: 30 }}
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
                                                        : 'scale(1)',
                                            color:
                                                index === 0
                                                    ? d === props.symbol.latest
                                                        ? 'white'
                                                        : 'white'
                                                    : 'black'
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
            <Stack>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {LoadContent(props.symbol.data)}
                </Collapse>
                <Divider />
            </Stack>
        </>
    );
};

export const RbMonitor = (props: any): JSX.Element => {
    const [checked, setChecked] = useState(true);
    const [symbols, setSymbols] = useState<ISymbol[]>([]);
    const [auto, setAuto] = useState(false);
    const autoState = useRef(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState<AlertColor>('success');
    const [alertInfo, setAlertInfo] = useState('');
    const [busy, setBusy] = useState(false);

    const counter = useRef(0);
    const counterUi = useRef(0);

    interface IResponse {
        address: any;
        data: any;
    }

    // SSE START
    const eventSource = useRef<undefined | EventSource>(undefined);
    const eventError = useRef(false);
    const eventType = 'RamBackdoor';
    const eventRoute = 'http://localhost:8889/webds/ram-backdoor';
    const sseData = useRef<IResponse[]>([]);
    const sseDataBuffer = useRef<{ [key: string]: any }>({});
    const sseDataBufferCount = useRef(0);

    const removeEvent = () => {
        const SSE_CLOSED = 2;
        if (eventSource.current && eventSource.current!.readyState !== SSE_CLOSED) {
            eventSource.current!.removeEventListener(eventType, eventHandler, false);
            eventSource.current!.close();
            eventSource.current = undefined;
            console.log('SSE EVENT IS REMOVED');
        }
    };

    const eventHandler = (event: any) => {
        const data = JSON.parse(event.data);

        switch (data.status) {
            case 'run':
                console.log(data.data);
                sseData.current = data.data;
                counter.current = counter.current + 1;
                sseDataBuffer.current[`Index${sseDataBufferCount.current}`] = data.data;
                sseDataBufferCount.current = sseDataBufferCount.current + 1;
                break;
            case 'done':
                console.log('EVENT----DONE');
                break;
            case 'terminate':
                console.log('EVENT----TERMINATE');
                break;
        }
    };

    const errorHandler = (error: any) => {
        eventError.current = true;
        removeEvent();
        //showMessage('error', `Error on GET ${eventRoute}`);
    };

    const addEvent = () => {
        if (eventSource.current) {
            return;
        }
        eventError.current = false;
        eventSource.current = new window.EventSource(eventRoute);
        eventSource.current!.addEventListener(eventType, eventHandler, false);
        eventSource.current!.addEventListener('error', errorHandler, false);
    };
    // SSE END

    function showMessage(atype: any, info: any) {
        setAlertInfo(info);
        setAlertType(atype);
        setOpenAlert(true);
    }

    function getReadList(all: any) {
        let update: any = [];
        symbols.forEach((s: any) => {
            if (s.select || all) {
                update.push({
                    address: parseInt(s.address, 16),
                    length: 1,
                    name: s.name
                });
            }
        });
        return update;
    }

    async function UiLoop() {
        if (autoState.current === false) {
            console.log('---------END-------------');
            return;
        }

        if (counterUi.current < counter.current) {
            counterUi.current = counter.current;

            sseData.current.forEach((data: any) => {
                let sym: any = symbols.find(
                    (s: any) => parseInt(s.address, 16) === data.address
                );
                const numToRemove = 5;
                if (sym.data.length > numToRemove) {
                    sym.data.splice(-1);
                }

                sym.data.unshift(data['data'][0]); //fixme length more than 1
                sym.latest = data['data'][0];
            });
            setSymbols([...symbols]);
        }
        requestAnimationFrame(UiLoop);
    }

    function ResetUI() {
        sseDataBuffer.current = {};
        sseDataBufferCount.current = 0;
        counterUi.current = 0;
        counter.current = 0;

        let newData: any = [...symbols];
        newData.forEach((s: any) => {
            if (s.select) {
                //let value: any = data.shift();
                s.data = [];
                s.latest = undefined;
            }
        });
        setSymbols(newData);
    }

    async function Terminate() {
        if (eventSource.current) {
            try {
                await TerminateSSE();
            } catch (error) {
                // Handle error if needed
            } finally {
                removeEvent();
                setBusy(false);
                //enable ui
                let update: any = JSON.parse(JSON.stringify(props.ui));
                update.auto = auto;
                props.onUpdate(update);
                openJsonInNewWindow(
                    sseDataBuffer.current,
                    getReadList(false),
                    props.ui.watch.settings
                );
            }
        } else {
            setBusy(false);
        }
    }

    useEffect(() => {
        console.log('AUTO:', auto);
        autoState.current = auto;
        setBusy(true);
        if (auto === true) {
            addEvent();
            ResetUI();
            UiLoop();
            //disable ui
            let update: any = JSON.parse(JSON.stringify(props.ui));
            update.auto = auto;
            props.onUpdate(update);

            // start sse
            let ss: any = {
                interval: props.ui.watch.settings.auto_refresh,
                data: []
            };
            ss.data = getReadList(false);
            ReadRAM({ data: ss, sse: true, chip: props.ui.watch.settings.mode }).then(
                (data: any) => {
                    setBusy(false);
                }
            );
        } else {
            Terminate();
        }
    }, [auto]);

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

        return () => {
            if (eventSource.current) {
                removeEvent();
            }
        };
    }, []);

    const ReadSymbols = (all: any) => {
        let update: any = getReadList(all);
        ReadRAM({ data: update, sse: false, chip: props.ui.watch.settings.mode })
            .then((data: any) => {
                let newData: any = [...symbols];
                newData.forEach((s: any) => {
                    if (s.select || all) {
                        const numToRemove = 5;
                        if (s.data.length > numToRemove) {
                            s.data.splice(-1); // Remove the latest items
                        }

                        let value: any = data.shift();
                        s.data.unshift(value[0]); //fixme length more than 1
                        s.latest = value[0]; //fixme length more than 1
                    }
                });
                setSymbols(newData);
                showMessage('success', 'Success');
            })
            .catch((e: any) => {
                showMessage('error', e.toString());
            });
    };

    const WriteSymbols = (all: any) => {
        let update: any = [];
        symbols.forEach((s: any) => {
            if (s.select || all) {
                update.push({ address: parseInt(s.address, 16), value: s.latest });
            }
        });

        WriteRegisters({
            data: update,
            sse: false,
            chip: props.ui.watch.settings.mode
        })
            .then((data: any) => {
                let newData: any = [...symbols];

                newData.forEach((s: any) => {
                    if (s.select || all) {
                        //let value: any = data.shift();
                        s.latest = s.data[0]; //fixme length more than 1
                    }
                });
                setSymbols(newData);

                showMessage('success', 'Success');
            })
            .catch((e: any) => {
                showMessage('error', e.toString());
            });
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
                WriteSymbols(true);
                break;

            case 'read':
                console.log('READ SELECT');
                props.resetCallback('');
                ReadSymbols(false);
                break;

            case 'write':
                console.log('WRITE SELECT');
                props.resetCallback('');
                WriteSymbols(false);
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
        setChecked(false);
    };

    const onSelectChange = (c: any) => {
        setChecked(!checked);
        let update: any = JSON.parse(JSON.stringify(symbols));

        update.map((s: any) => (s.select = c));
        setSymbols(update);
    };

    const webdsTheme = webdsService.ui.getWebDSTheme();

    function LoadTitle() {
        return (
            <Grid
                container
                alignItems="center"
                sx={{
                    backgroundColor: webdsTheme.palette.divider,
                    height: 40,
                    width: '100%'
                }}
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
        setAuto(event.target.checked);
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <Stack
            direction="column"
            sx={{
                width: '100%',
                border: '1px solid',
                overflow: 'auto',
                borderColor: webdsTheme.palette.divider
            }}
        >
            <AppBar position="static">
                <Toolbar variant="dense">
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    color="secondary"
                                    onChange={handleSwitchChange}
                                    disabled={busy}
                                />
                            }
                            label={<Typography color="white">Auto Refresh</Typography>}
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

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openAlert}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={alertType}
                    sx={{ width: '100%' }}
                >
                    {alertInfo}
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default RbMonitor;
