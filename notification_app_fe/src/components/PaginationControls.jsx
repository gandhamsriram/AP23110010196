
import React from 'react';
import {
  Box,
  Pagination,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const theme = useTheme();

  if (totalPages <= 1) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        mt: 4,
        pb: 2,
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPaginationItem-root': {
            borderRadius: 2,
            fontWeight: 600,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.1),
            },
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, #6C63FF, #4A42D4)',
              boxShadow: '0 4px 16px rgba(108, 99, 255, 0.3)',
              border: 'none',
            },
          },
        }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Page {currentPage} of {totalPages}
      </Typography>
    </Box>
  );
};

export default React.memo(PaginationControls);
