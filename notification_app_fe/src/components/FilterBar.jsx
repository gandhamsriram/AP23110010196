/**
 * FilterBar Component
 * Provides notification type filtering with debounced updates.
 */
import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Select,
  MenuItem,
  Chip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

// Available notification types
const NOTIFICATION_TYPES = ['Event', 'Result', 'Placement'];

// Color mapping for type chips
const TYPE_COLORS = {
  Event: '#00D9FF',
  Result: '#FFAB40',
  Placement: '#00E676',
};

const FilterBar = ({ selectedType, onTypeChange }) => {
  const theme = useTheme();

  const handleChange = useCallback(
    (event) => {
      onTypeChange(event.target.value);
    },
    [onTypeChange]
  );

  // Memoize menu items to prevent unnecessary re-renders
  const menuItems = useMemo(
    () =>
      NOTIFICATION_TYPES.map((type) => (
        <MenuItem key={type} value={type}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: TYPE_COLORS[type],
                boxShadow: `0 0 6px ${TYPE_COLORS[type]}80`,
              }}
            />
            {type}
          </Box>
        </MenuItem>
      )),
    []
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      {/* Label */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
        <FilterListIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>Filter:</Typography>
      </Box>

      {/* Select dropdown — no InputLabel to avoid overlap issues */}
      <Select
        id="filter-type-select"
        value={selectedType}
        onChange={handleChange}
        displayEmpty
        size="small"
        renderValue={(value) => {
          if (!value) return <span style={{ opacity: 0.6 }}>All Types</span>;
          return value;
        }}
        sx={{
          minWidth: 180,
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(10px)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.primary.main, 0.15),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.primary.main, 0.4),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <MenuItem value="">
          <em>All Types</em>
        </MenuItem>
        {menuItems}
      </Select>

      {/* Active filter chip */}
      {selectedType && (
        <Chip
          label={selectedType}
          onDelete={() => onTypeChange('')}
          sx={{
            background: alpha(TYPE_COLORS[selectedType] || '#6C63FF', 0.15),
            color: TYPE_COLORS[selectedType] || '#6C63FF',
            borderColor: alpha(TYPE_COLORS[selectedType] || '#6C63FF', 0.3),
            border: '1px solid',
            fontWeight: 600,
            '& .MuiChip-deleteIcon': {
              color: TYPE_COLORS[selectedType] || '#6C63FF',
              '&:hover': {
                color: '#fff',
              },
            },
          }}
        />
      )}
    </Box>
  );
};

export default React.memo(FilterBar);
