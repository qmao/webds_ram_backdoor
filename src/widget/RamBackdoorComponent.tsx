import React, { useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider } from '@mui/material/styles';


import Landing from './Landing';
import { requestAPI, webdsService } from './local_exports';
import { GetSymbolTable } from './api';

const getIdentify = async (): Promise<any> => {
    const dataToSend: any = {
        command: 'identify'
    };
    try {
        const response = await requestAPI<any>('command', {
            body: JSON.stringify(dataToSend),
            method: 'POST'
        });
        return response;
    } catch (error) {
        console.error(`Error - POST /webds/command\n${dataToSend}\n${error}`);
        return Promise.reject('Failed to get Identify report');
    }
};

export const RamBackdoorComponent = (props: any): JSX.Element => {
    const [initialized, setInitialized] = useState<boolean>(false);
    const [alert, setAlert] = useState<string | undefined>(undefined);
    const [table, setTable] = useState({});

    const webdsTheme = webdsService.ui.getWebDSTheme();

    useEffect(() => {
        const checkHex = async () => {
            if (webdsService.pinormos) {
                webdsService.packrat.cache.addApplicationHex().then((ret: any) => {
                    console.log(ret);
                }).catch((e: any) => {
                    console.log(e.toString());
                    throw new Error("HEX file not found"); 
                })
                
            }
        }

        const initialize = async () => {
            getIdentify().then((identify: any) => {
                console.log(identify);
                return GetSymbolTable(identify["buildID"]);
            }).then((table: any) => {
                setTable(table);
                return checkHex();
            }).then((ret: any) => {
                setInitialized(true);
            }).catch((e: any) => {
                setAlert(e.toString());
            })
        };
        initialize();
    }, []);

    return (
        <ThemeProvider theme={webdsTheme}>
            <div className="jp-webds-widget-body">
                {alert !== undefined && (
                    <Alert
                        severity="error"
                        onClose={() => setAlert(undefined)}
                        sx={{ whiteSpace: 'pre-wrap' }}
                    >
                        {alert}
                    </Alert>
                )}
                {initialized && <Landing setAlert={setAlert} table={table}/>}
            </div>
            {!initialized && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <CircularProgress color="primary" />
                </div>
            )}
        </ThemeProvider>
    );
};

export default RamBackdoorComponent;