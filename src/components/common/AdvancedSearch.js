import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Typography,
  Divider,
  Fade,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  Article,
  Category,
  Tag,
  AccessTime,
  TrendingUp,
} from '@mui/icons-material';

const AdvancedSearch = ({ 
  onSearch, 
  placeholder = "Search posts, categories, tags...",
  suggestions = [],
  filters = {},
  onFilterChange,
  loading = false,
  showFilters = true,
}) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(filters);
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    setShowSuggestions(newQuery.length > 0);
    
    if (onSearch) {
      onSearch(newQuery, selectedFilters);
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    if (onSearch) {
      onSearch('', selectedFilters);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title || suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion.title || suggestion, selectedFilters);
    }
  };

  const handleFilterToggle = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: value,
    };
    setSelectedFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
    
    if (onSearch) {
      onSearch(query, newFilters);
    }
  };

  const removeFilter = (filterType) => {
    const newFilters = { ...selectedFilters };
    delete newFilters[filterType];
    setSelectedFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
    
    if (onSearch) {
      onSearch(query, newFilters);
    }
  };

  const getFilterIcon = (type) => {
    switch (type) {
      case 'category': return <Category />;
      case 'tag': return <Tag />;
      case 'date': return <AccessTime />;
      case 'popularity': return <TrendingUp />;
      default: return <FilterList />;
    }
  };

  const getFilterLabel = (type, value) => {
    switch (type) {
      case 'category': return `Category: ${value}`;
      case 'tag': return `Tag: ${value}`;
      case 'date': return `Date: ${value}`;
      case 'popularity': return `Popularity: ${value}`;
      default: return `${type}: ${value}`;
    }
  };

  const activeFilters = Object.entries(selectedFilters).filter(([_, value]) => value);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Search Input */}
      <TextField
        ref={inputRef}
        fullWidth
        value={query}
        onChange={handleQueryChange}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <Search color="action" />
              )}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {query && (
                <IconButton size="small" onClick={handleClear}>
                  <Clear />
                </IconButton>
              )}
              {showFilters && (
                <IconButton 
                  size="small" 
                  onClick={handleFilterToggle}
                  color={activeFilters.length > 0 ? 'primary' : 'default'}
                >
                  <FilterList />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      />

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {activeFilters.map(([type, value]) => (
            <Chip
              key={type}
              label={getFilterLabel(type, value)}
              onDelete={() => removeFilter(type)}
              size="small"
              color="primary"
              variant="outlined"
              icon={getFilterIcon(type)}
            />
          ))}
        </Box>
      )}

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
          <List dense>
            {suggestions.map((suggestion, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon>
                    <Article fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={suggestion.title || suggestion}
                    secondary={suggestion.excerpt || suggestion.category}
                  />
                </ListItem>
                {index < suggestions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Filter Popper */}
      {showFilters && (
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          sx={{ zIndex: 1000 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper
                elevation={8}
                sx={{
                  p: 2,
                  minWidth: 300,
                  mt: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Search Filters
                </Typography>
                
                {/* Category Filter */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Category
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education'].map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        size="small"
                        variant={selectedFilters.category === category ? 'filled' : 'outlined'}
                        color={selectedFilters.category === category ? 'primary' : 'default'}
                        onClick={() => handleFilterChange('category', 
                          selectedFilters.category === category ? null : category
                        )}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Date Filter */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Date Range
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['Today', 'This Week', 'This Month', 'This Year'].map((dateRange) => (
                      <Chip
                        key={dateRange}
                        label={dateRange}
                        size="small"
                        variant={selectedFilters.date === dateRange ? 'filled' : 'outlined'}
                        color={selectedFilters.date === dateRange ? 'primary' : 'default'}
                        onClick={() => handleFilterChange('date',
                          selectedFilters.date === dateRange ? null : dateRange
                        )}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Clear All Filters */}
                {activeFilters.length > 0 && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => {
                        setSelectedFilters({});
                        if (onFilterChange) onFilterChange({});
                        if (onSearch) onSearch(query, {});
                      }}
                    >
                      Clear All Filters
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Fade>
          )}
        </Popper>
      )}
    </Box>
  );
};

export default AdvancedSearch; 