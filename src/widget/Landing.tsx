import React from 'react';

import Stack from '@mui/material/Stack';

import { Canvas } from './mui_extensions/Canvas';
import { Content } from './mui_extensions/Content';
import { Controls } from './mui_extensions/Controls';
import { CustomControl } from './CustomControl';
import { RbSymbolView } from './RbSymbolView';
import { RbCards } from './RbCards';
import { RbMonitor } from './RbMonitor';

export const Landing = (props: any): JSX.Element => {
    const [callback, setCallback] = React.useState('');
    const [ui, setUi] = React.useState({
        page: 'cards',
        watch: {}
    });

    const onUpdate = (u: any) => {
        if (JSON.stringify(ui) === JSON.stringify(u) && u.force_update === false) {
            return;
        }

        let update: any = JSON.parse(JSON.stringify(u));
        update.force_update = false;
        setUi(update);
        console.log('UPDATE UI@@@@@@@111', update);
    };

    const onButtonClick = (title: any) => {
        setCallback(title);
    };

    return (
        <>
            <Canvas title={'RAM Backdoor'} sx={{ width: 1200 }}>
                <Content sx={{ height: 480 }}>
                    <Stack direction="row" sx={{ height: '100%' }}>
                        {ui.page === 'cards' && <RbCards ui={ui} onUpdate={onUpdate} />}
                        {ui.page === 'table' && (
                            <RbSymbolView ui={ui} onUpdate={onUpdate} />
                        )}
                        {ui.page === 'monitor' && (
                            <RbMonitor
                                ui={ui}
                                onUpdate={onUpdate}
                                resetCallback={() => {
                                    setCallback('');
                                }}
                                callback={callback}
                            />
                        )}
                    </Stack>
                </Content>
                <Controls
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <CustomControl
                        onUpdate={onUpdate}
                        ui={ui}
                        onButtonClick={onButtonClick}
                    />
                </Controls>
            </Canvas>
        </>
    );
};

export default Landing;
