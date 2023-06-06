import React, { useRef, useEffect, useState } from 'react';
import {
    Stack,
    Typography,
    ButtonBase,
    Box,
    Grid,
    IconButton
} from '@mui/material';

import { webdsService } from './local_exports';
import { v4 as uuidv4 } from 'uuid';
import { getWatchList, setWatchList } from './api';
import { MyTypography } from './constants';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { RbNameDialog } from './RbNameDialog';
import DeleteIcon from '@mui/icons-material/Delete';

interface ICard {
    id: any;
    name: any;
    symbols: any;
    settings: any;
}
export const RbCards = (props: any): JSX.Element => {
    const [open, setOpen] = useState(false);
    const [cards, setCards] = useState<ICard[]>([]);
    const watchList = useRef<ICard[]>([]);
    useEffect(() => {
        getWatchList().then((l: any) => {
            watchList.current = l;
            setCards(l);
        });
    }, []);

    const NewCard = (create: any, name?: any) => {
        if (create) {
            let update: any = JSON.parse(JSON.stringify(props.ui));
            update.page = 'table';
            props.onUpdate(update);
            let new_card: ICard = {
                id: uuidv4(),
                name: name,
                symbols: [],
                settings: {
                    mode: 'Master',
                    format: 16,
                    auto_refresh: 0
                }
            };
            watchList.current.unshift(new_card);
            setWatchList(watchList.current).then((l: any) => {
                console.log('set watch list', l);
            });
            EnterCard(0);
        }
        setOpen(false);
    };

    const EnterCard = (index: any) => {
        let update: any = JSON.parse(JSON.stringify(props.ui));
        update.page = 'table';
        update.watch = cards[index];
        props.onUpdate(update);
        console.log('Enter Card:', update);
    };

    const DeleteCard = (event: any, name: any) => {
        event.stopPropagation();
        watchList.current = watchList.current.filter(
            (item: any) => item.name !== name
        );
        setWatchList(watchList.current).then((l: any) => {
            console.log('set watch list', l);
        });
        setCards(watchList.current);
    };

    const webdsTheme = webdsService.ui.getWebDSTheme();

    const MyCard = styled(ButtonBase)((props) => ({
        width: 250,
        height: 150,
        borderRadius: 2,
        border: '2px solid',
        //backgroundColor: webdsTheme.palette.section.background,
        padding: '0px 0px 0px 0px',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderColor: webdsTheme.palette.divider,
        '&:hover': {
            border: '2px solid',
            borderColor: webdsTheme.palette.primary.main
        }
    }));

    const TitleCard = (props: any) => {
        return (
            <Grid item xs={3}>
                <MyCard
                    key={'card' + props.index}
                    onClick={() => EnterCard(props.index)}
                    sx={{
                        overflowY: 'auto'
                    }}
                >
                    <Stack
                        key={'cardstack' + props.index}
                        direction="column"
                        sx={{
                            width: '100%',
                            position: 'relative'
                        }}
                    >
                        <IconButton
                            key={'cardbutton' + props.index}
                            sx={{
                                color: 'white',
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                '& .MuiSvgIcon-root': {
                                    fontSize: '16px' // Adjust the font size to make the icon smaller
                                }
                            }}
                            onClick={(e) => DeleteCard(e, props.card.name)}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <MyTypography
                            key={'cardname' + props.index}
                            sx={{
                                fontSize: 14,
                                py: 0.5,
                                backgroundColor: 'primary.main',
                                width: '100%',
                                color: 'white'
                            }}
                        >
                            {props.card.name}
                        </MyTypography>
                        <Box sx={{ p: 1 }} key={'cardbox' + props.index}>
                            {props.card.symbols.map((s: any, i: any) => (
                                <Typography
                                    variant="caption"
                                    fontSize={10}
                                    //noWrap
                                    style={{
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-all',
                                        border: '0.1px solid',
                                        margin: '1.5px',
                                        borderColor: webdsTheme.palette.divider,
                                        color: webdsTheme.palette.primary.main,
                                        borderLeftWidth: '4px',
                                        borderTopRightRadius: '10px',
                                        borderBottomRightRadius: '10px'
                                    }}
                                    sx={{
                                        display: 'inline-block',
                                        px: 1,
                                        borderRadius: 0
                                    }}
                                >
                                    {s.name}
                                </Typography>
                            ))}
                        </Box>
                    </Stack>
                </MyCard>
            </Grid>
        );
    };

    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{
                width: '100%',
                backgroundColor: webdsTheme.palette.section.background
            }}
        >
            <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ width: '100%', backgroundColor: 'primary.main' }}
            >
                <Typography sx={{ fontSize: 18, color: 'white', py: 1 }}>
                    Watch List
        </Typography>
            </Stack>
            <Grid container spacing={2} sx={{ width: '100%', overflow: 'auto' }}>
                <Grid item xs={3}>
                    <MyCard
                        onClick={() => setOpen(true)}
                        sx={{
                            border: '1px dashed grey',
                            alignItems: 'center'
                        }}
                    >
                        <AddIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    </MyCard>
                </Grid>
                {cards.map((c: any, index: any) => (
                    <TitleCard card={c} index={index} />
                ))}
            </Grid>
            <RbNameDialog
                title={'Create New Symbol List'}
                open={open}
                onClose={NewCard}
            />
        </Stack>
    );
};

export default RbCards;
