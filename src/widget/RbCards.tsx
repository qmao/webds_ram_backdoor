import React, { useRef, useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  ButtonBase,
  Chip,
  Box,
  IconButton
} from '@mui/material';

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

  const MyCard = styled(ButtonBase)((props) => ({
    width: 200,
    height: 150,
    borderRadius: 1,
    border: '1px solid #e0e0e0',
    backgroundColor: '#fefefe',
    padding: '0px 0px 0px 0px',
    alignItems: 'flex-start',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: '#f0f0f0',
      border: '1px solid black'
    }
  }));

  function loadCard(c: ICard, index: any) {
    return (
      <Stack
        sx={{
          position: 'relative'
        }}
      >
        <IconButton
          key={'cardbutton' + index}
          sx={{
            color: 'white',
            position: 'absolute',
            top: 0,
            right: 0,
            '& .MuiSvgIcon-root': {
              fontSize: '16px' // Adjust the font size to make the icon smaller
            }
          }}
          onClick={(e) => DeleteCard(e, c.name)}
        >
          <DeleteIcon />
        </IconButton>
        <MyCard
          key={'card' + index}
          onClick={() => EnterCard(index)}
          sx={{
            borderColor: 'primary.main',
            overflow: 'auto'
          }}
        >
          <Stack
            key={'cardstack' + index}
            direction="column"
            sx={{
              width: '100%'
            }}
          >
            <MyTypography
              key={'cardname' + index}
              sx={{
                fontSize: 14,
                py: 0.5,
                backgroundColor: 'primary.main',
                width: '100%',
                color: 'white'
              }}
            >
              {c.name}
            </MyTypography>
            <Box sx={{ p: 1 }} key={'cardbox' + index}>
              {c.symbols.map((s: any, i: any) => (
                <Chip
                  key={'cardchip' + index + 'index' + i}
                  label={s.name}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Stack>
        </MyCard>
      </Stack>
    );
  }

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ width: '100%', backgroundColor: '#F9F9F9' }}
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
      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
        <MyCard
          onClick={() => setOpen(true)}
          sx={{
            border: '1px dashed grey',
            alignItems: 'center'
          }}
        >
          <AddIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </MyCard>
        {cards.map((c: any, index: any) => {
          return <div key={c.id}>{loadCard(c, index)}</div>;
        })}
      </Stack>
      <RbNameDialog
        title={'Create New Symbol List'}
        open={open}
        onClose={NewCard}
      />
    </Stack>
  );
};

export default RbCards;
