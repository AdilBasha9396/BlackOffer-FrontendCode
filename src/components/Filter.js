import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Filter = ({ name, value, options, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{name}</InputLabel>
      <Select name={name} value={value} onChange={onChange}>
        <MenuItem value=""><em>None</em></MenuItem>
        {options.map(option => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Filter;
