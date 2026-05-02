/**
 * PriorityInbox Page
 * Fetches ALL notifications, applies frontend priority sorting,
 * and displays the Top N most important items.
 * Falls back to mock data when API is unavailable.
 *
 * Priority: Placement (3) > Result (2) > Event (1)
 * Tiebreaker: Latest timestamp first
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  Button,
  Fade,
  Grow,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  alpha,
  useTheme,
  Skeleton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import StarIcon from '@mui/icons-material/Star';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import { fetchAllNotifications } from '../services/api';
import NotificationCard from '../components/NotificationCard';
import FilterBar from '../components/FilterBar';
import { getTopPriorityNotifications } from '../utils/prioritySort';

const TOP_N_OPTIONS = [10, 15, 20];

const PriorityInbox = ({ readIds, onMarkRead }) => {
  const theme = useTheme();

  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState('');
  const [isMock, setIsMock] = useState(false);
  const [apiError, setApiError] = useState(null);

  /**
   * Fetch all notifications for priority sorting
   */
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAllNotifications();
      console.log('[PriorityInbox] Data loaded:', result);

      setAllNotifications(result.data);
      setIsMock(result.isMock);
      setApiError(result.error);
    } catch (err) {
      console.error('[PriorityInbox] Unexpected error:', err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /**
   * Apply filter → priority sort → slice top N
   */
  const prioritizedNotifications = React.useMemo(() => {
    let filtered = allNotifications;
    if (filterType) {
      filtered = allNotifications.filter(
        (n) => (n.notification_type || n.type) === filterType
      );
    }
    return getTopPriorityNotifications(filtered, topN);
  }, [allNotifications, filterType, topN]);

  const handleTopNChange = useCallback((_, newValue) => {
    if (newValue !== null) setTopN(newValue);
  }, []);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <StarIcon
            sx={{
              color: '#FFAB40',
              fontSize: 32,
              filter: 'drop-shadow(0 0 8px rgba(255, 171, 64, 0.5))',
            }}
          />
          <Typography
            variant="h4"
            sx={{
              background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Priority Inbox
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
          Top notifications sorted by importance · Placement → Result → Event
        </Typography>
      </Box>


      {/* Controls Row */}
      <Box
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.06)}`,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <FilterBar selectedType={filterType} onTypeChange={setFilterType} />

        {/* Top N selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
            Show Top:
          </Typography>
          <ToggleButtonGroup
            value={topN}
            exclusive
            onChange={handleTopNChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '8px !important',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)} !important`,
                color: 'text.secondary',
                fontWeight: 600,
                px: 2,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #6C63FF, #4A42D4)',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
                  border: 'none !important',
                },
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.08),
                },
              },
            }}
          >
            {TOP_N_OPTIONS.map((n) => (
              <ToggleButton key={n} value={n}>
                {n}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Stats chip */}
      {!loading && prioritizedNotifications.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<PriorityHighIcon />}
            label={`Showing ${prioritizedNotifications.length} of ${allNotifications.length}`}
            size="small"
            sx={{
              background: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontWeight: 600,
            }}
          />
        </Box>
      )}

      {/* Loading */}
      {loading && (
        <Grid container spacing={2}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Grid size={{ xs: 12 }} key={i}>
              <Skeleton
                variant="rounded"
                height={120}
                sx={{ borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.05) }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty */}
      {!loading && prioritizedNotifications.length === 0 && (
        <Fade in>
          <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
            <NotificationsNoneIcon
              sx={{ fontSize: 80, color: alpha(theme.palette.text.secondary, 0.2), mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No Priority Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No notifications match the current criteria.
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Cards */}
      {!loading && prioritizedNotifications.length > 0 && (
        <Grid container spacing={2}>
          {prioritizedNotifications.map((notif, index) => (
            <Grid size={{ xs: 12 }} key={notif.id || index}>
              <Grow in timeout={300 + index * 60}>
                <Box>
                  <NotificationCard
                    notification={notif}
                    isRead={readIds.has(notif.id)}
                    onClick={onMarkRead}
                  />
                </Box>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PriorityInbox;
