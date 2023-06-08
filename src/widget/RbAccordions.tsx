import React, { useState, useEffect } from 'react';
import {
    Accordion,
    Stack,
    AccordionDetails,
    AccordionSummary,
    Typography,
    FormControlLabel,
    Radio,
    RadioGroup,
    Switch,
    Slider,
    FormControl,
    Select,
    MenuItem
} from '@mui/material';

import { MyTypography } from './constants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { updateWatch } from './api';

export const RbAccordions = (props: any): JSX.Element => {
    const [expanded, setExpanded] = useState<string | false>(false);
    const [mode, setMode] = useState(props.ui.watch.settings.mode);
    const [format, setFormat] = useState(props.ui.watch.settings.format);
    const [autoRefreshEnable, setAutoRefreshEnable] = useState(
        props.ui.watch.settings.auto_refresh !== 0
    );
    const [refreshSpeed, setRefreshSpeed] = useState(
        props.ui.watch.settings.auto_refresh
    );
    const [chipName, setChipName] = useState('');

    useEffect(() => { }, []);

    useEffect(() => {
        switch (mode) {
            case -1:
                setChipName('Master');
                break;
            case 0:
                setChipName('Slave ID 0');
                break;
            case 1:
                setChipName('Slave ID 1');
                break;
            case 2:
                setChipName('Slave ID 2');
                break;
        }
    }, [mode]);

    function onSettingsUpdate(settings: any) {
        let update: any = JSON.parse(JSON.stringify(props.ui));
        update.watch.settings = { ...update.watch.settings, ...settings };
        props.onUpdate(update);
        updateWatch(update.watch).then((l: any) => {
            console.log('l');
        });
    }

    const handleChange = (panel: string) => (
        event: React.SyntheticEvent,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleModeChange = (event: any) => {
        const value = event.target.value;

        setMode(value);
        onSettingsUpdate({ mode: value });
    };

    const handleFormatChange = (event: any) => {
        const checked = event.target.checked;
        const value = Number(event.target.value);

        if (checked) {
            setFormat(value);
            onSettingsUpdate({ format: value });
        }
    };

    const handleAutoRefreshChange = (event: any) => {
        const checked = event.target.checked;
        let speed: any = 0;

        setAutoRefreshEnable(checked);
        if (checked) {
            speed = 1000;
        } else {
        }
        onSettingsUpdate({ auto_refresh: speed });
        setRefreshSpeed(speed);
    };

    function handleSliderChange(event: any, newValue: any) {
        setRefreshSpeed(newValue);
    }

    function handleSliderChangeCommitted(event: any, newValue: any) {
        onSettingsUpdate({ auto_refresh: newValue });
        setRefreshSpeed(newValue);
    }

    function valuetext(value: number) {
        return `${value} ms`;
    }

    return (
        <div>
            <Accordion
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Chip</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{chipName}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction="row" alignItems="center" spacing={4}>
                        <Typography>Chip ID</Typography>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={mode}
                                onChange={handleModeChange}
                                label="Age"
                            >
                                <MenuItem value={-1}>Master</MenuItem>
                                <MenuItem value={0}>Slave ID 0</MenuItem>
                                <MenuItem value={1}>Slave ID 1</MenuItem>
                                <MenuItem value={2}>Slave ID 2</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === 'panel2'}
                onChange={handleChange('panel2')}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Data Format
          </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        {' '}
                        {format === 2 ? 'Binary' : format === 10 ? 'Decimal' : 'Hex'}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack alignItems="center" direction="row" spacing={2}>
                        <MyTypography sx={{ fontSize: 16 }}>Format</MyTypography>
                        <FormControlLabel
                            value={16}
                            label="Hex"
                            checked={format === 16}
                            control={<Radio />}
                            onChange={handleFormatChange}
                        />
                        <FormControlLabel
                            value={10}
                            label="Decimal"
                            checked={format === 10}
                            control={<Radio />}
                            onChange={handleFormatChange}
                        />
                        <FormControlLabel
                            value={2}
                            label="Binary"
                            checked={format === 2}
                            control={<Radio />}
                            onChange={handleFormatChange}
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>

            <Accordion
                expanded={expanded === 'panel3'}
                onChange={handleChange('panel3')}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Auto Refresh
          </Typography>

                    <Typography sx={{ color: 'text.secondary' }}>
                        {autoRefreshEnable
                            ? 'Enabled: ' + refreshSpeed + ' ms'
                            : 'Disabled'}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RadioGroup name="use-radio-group" defaultValue="first">
                        <Stack direction="column" spacing={4}>
                            <Stack alignItems="center" direction="row" spacing={2}>
                                <MyTypography sx={{ fontSize: 16 }}></MyTypography>
                                <Switch
                                    checked={autoRefreshEnable}
                                    onChange={handleAutoRefreshChange}
                                />
                            </Stack>
                            {refreshSpeed > 0 && (
                                <Slider
                                    value={refreshSpeed}
                                    valueLabelFormat={valuetext}
                                    valueLabelDisplay="on"
                                    step={50}
                                    marks
                                    min={50}
                                    max={2000}
                                    onChange={handleSliderChange}
                                    onChangeCommitted={handleSliderChangeCommitted}
                                />
                            )}
                        </Stack>
                    </RadioGroup>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default RbAccordions;
