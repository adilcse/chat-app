import React, { useEffect } from 'react';
import { IconButton, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchInput = ({ onSearch, sx }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };


  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Stack direction="row" sx={{ justifyContent: "center", ...(sx || {})  }}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyUp={e => {
            if (e.key == "Enter") {
                onSearch(searchTerm);
            }
           }}
        sx={{
            width: '80%'
        }}
      />
      <IconButton onClick={handleSearch} sx={{alignSelf: "center"}}>
        <SearchIcon />
      </IconButton>
    </Stack>
  );
};

export default SearchInput;
