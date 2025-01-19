import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { StationsAutocomplete } from './StationsAutoComplete';
import { IStation } from '../models';

export const Home = () => {
  const [station, setStation] = useState<IStation | undefined>();

  return (
    <Box component="main" width="lg" minHeight="50vh" py={3}>
      <Box display="flex" width="100%" gap={3} justifyContent="space-between">
        <StationsAutocomplete
          onChange={setStation}
          value={station}
          placeholder="Search stations..."
        />
        <Button
          variant="contained"
          sx={{ textTransform: 'none', textWrap: 'nowrap' }}
        >
          Add Station
        </Button>
      </Box>
    </Box>
  );
};
