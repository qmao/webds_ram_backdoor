import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
  Stack,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  InputBase,
  Badge
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

import FilterListIcon from '@mui/icons-material/FilterList';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '20ch'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  fontSize: 14,
  height: 30,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '10ch'
    }
  }
}));

interface IProps {
  onSearch?: any;
  onFilterClick?: any;
  rows: any;
  filtered: any;
  onRowUpdate: any;
}

export default function SearchBar(props: IProps) {
  const [searchText, setSearchText] = useState('');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onKeyPress={(event: any) => {
                if (event.key === 'Enter') {
                  props.onSearch(searchText);
                }
              }}
              onChange={(event: any) => {
                setSearchText(event.currentTarget.value);
              }}
              value={searchText}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1}>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              onClick={(e: any) => {
                props.onFilterClick();
              }}
            >
              <Badge badgeContent={props.filtered} color="error">
                <FilterListIcon />
              </Badge>
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export const MemoizeSearchBar = React.memo(SearchBar);
