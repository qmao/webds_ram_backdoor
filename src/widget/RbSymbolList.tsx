import React, { useEffect, useState } from 'react';
import { Checkbox, TextField, Stack, Typography } from '@mui/material';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  limit: 50
});

interface ISymbol {
  search: string;
  name: string;
  address: string;
}

export const RbSymbolList = (props: any) => {
  const [selectedSymbols, setSelectedSymbols] = useState<ISymbol[]>([]);

  useEffect(() => {
    let slist: any = [];
    props.default.forEach((s: any) => {
      slist.push({
        search: s.address.toString(16).toUpperCase() + ' - ' + s.name,
        name: s.name,
        address: s.address
      });
    });
    setSelectedSymbols(slist);
  }, [props.symbols]);

  const handleSymbolChange = (event: any, value: any) => {
    setSelectedSymbols(value);

    let slist: any[] = [];
    value.forEach((s: any) => {
      const { search, ...update } = s;
      slist.push({ ...update, length: 1 });
    });

    props.update(slist);
  };

  const renderOption = (props: any, option: any) => {
    const selected = selectedSymbols.some(
      (item: any) => item.search === option.search
    );

    const handleCheckboxChange = (event: any) => {
      if (event.target.checked) {
        setSelectedSymbols([...selectedSymbols, option]);
      } else {
        setSelectedSymbols(
          selectedSymbols.filter((item) => item.search !== option.search)
        );
      }
    };

    return (
      <li {...props}>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selected}
          onChange={handleCheckboxChange}
        />
        {option.search}
      </li>
    );
  };

  const handleAutocompleteClose = () => {
    let slist: any = [];
    selectedSymbols.forEach((s: any) => {
      const { search, ...update } = s;
      slist.push({ ...update, length: 1 });
    });
    props.update(slist);
  };

  const isOptionEqualToValue = (option: any, value: any) => {
    return option.search === value.search;
  };

  return (
    <Stack direction="column" spacing={2}>
      <Typography>Symbol Table</Typography>
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={props.symbols}
        disableCloseOnSelect
        getOptionLabel={(option: any) => option.search}
        filterOptions={filterOptions}
        renderOption={renderOption}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add Watching Symbol"
            placeholder="Favorites"
          />
        )}
        value={selectedSymbols}
        onChange={handleSymbolChange}
        onClose={handleAutocompleteClose}
        isOptionEqualToValue={isOptionEqualToValue}
      />
    </Stack>
  );
};

export default RbSymbolList;
