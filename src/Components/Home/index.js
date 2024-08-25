import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import axios from 'axios';

const Home = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [filters, setFilters] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post('http://localhost:3001/bfhl', parsedInput, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setResponse(res.data);
    } catch (err) {
      setError('Invalid JSON or API error');
      console.error(err);
    }
  };

  const handleFilterChange = (event) => {
    setFilters(event.target.value);
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    let filteredContent = '';
    filters.forEach(filter => {
      if (filter === 'Numbers' && response.numbers) {
        filteredContent += `Numbers: ${response.numbers.join(',')}\n`;
      }
      if (filter === 'Alphabets' && response.alphabets) {
        filteredContent += `Alphabets: ${response.alphabets.join(',')}\n`;
      }
      if (filter === 'Highest lowercase alphabet' && response.highest_lowercase_alphabet) {
        filteredContent += `Highest lowercase alphabet: ${response.highest_lowercase_alphabet}\n`;
      }
    });

    return filteredContent;
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        API Input
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"data":["M","1","334","4","B"]}'
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
          Submit
        </Button>
      </form>

      {response && (
        <>
          <Typography variant="h6" gutterBottom>
            Full Response
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={JSON.stringify(response, null, 2)}
            InputProps={{
              readOnly: true,
            }}
            sx={{ mb: 2 }}
          />
        </>
      )}

      {response && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="multi-filter-label">Multi Filter</InputLabel>
          <Select
            labelId="multi-filter-label"
            multiple
            value={filters}
            onChange={handleFilterChange}
            input={<OutlinedInput label="Multi Filter" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            <MenuItem value="Numbers">Numbers</MenuItem>
            <MenuItem value="Alphabets">Alphabets</MenuItem>
            <MenuItem value="Highest lowercase alphabet">Highest lowercase alphabet</MenuItem>
          </Select>
        </FormControl>
      )}

      {filters.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Filtered Response
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={renderFilteredResponse()}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Home;
