
import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';
import CircleIcon from '@mui/icons-material/Circle';

const TYPE_ICON_MAP = {
  Event: <EventIcon fontSize="small" />,
  Result: <EmojiEventsIcon fontSize="small" />,
  Placement: <WorkIcon fontSize="small" />,
};

const TYPE_COLOR_MAP = {
  Event: '#0284C7',     // Sky dark
  Result: '#D97706',    // Amber dark
  Placement: '#059669', // Emerald dark
};


const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const NotificationCard = ({ notification, isRead, onClick }) => {
  const theme = useTheme();
  const type = notification.notification_type || notification.type || 'Event';
  const color = TYPE_COLOR_MAP[type] || '#6C63FF';
  const icon = TYPE_ICON_MAP[type] || <EventIcon fontSize="small" />;

  return (
    <Card
      id={`notification-card-${notification.id}`}
      sx={{
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: isRead
          ? alpha(theme.palette.background.paper, 0.5)
          : `linear-gradient(135deg, ${alpha(color, 0.06)}, ${alpha(theme.palette.background.paper, 0.9)})`,
        border: `1px solid ${alpha(color, isRead ? 0.05 : 0.2)}`,
        opacity: isRead ? 0.7 : 1,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 32px ${alpha(color, 0.15)}`,
          border: `1px solid ${alpha(color, 0.35)}`,
          opacity: 1,
        },
        // Glow bar on left for unread
        '&::before': !isRead
          ? {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '15%',
              bottom: '15%',
              width: 3,
              borderRadius: 2,
              background: color,
              boxShadow: `0 0 12px ${alpha(color, 0.6)}`,
            }
          : {},
      }}
    >
      <CardActionArea
        onClick={() => onClick(notification.id)}
        sx={{
          p: 0,
          '&:focus-visible': {
            outline: `2px solid ${color}`,
            outlineOffset: 2,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
            {/* Type chip */}
            <Chip
              icon={icon}
              label={type}
              size="small"
              sx={{
                background: alpha(color, 0.12),
                color: color,
                border: `1px solid ${alpha(color, 0.25)}`,
                '& .MuiChip-icon': {
                  color: color,
                },
              }}
            />

            {/* Unread indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isRead && (
                <CircleIcon
                  sx={{
                    fontSize: 10,
                    color: theme.palette.primary.main,
                    filter: `drop-shadow(0 0 4px ${alpha(theme.palette.primary.main, 0.6)})`,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.4 },
                    },
                  }}
                />
              )}
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
              >
                {formatTimestamp(notification.timestamp || notification.created_at)}
              </Typography>
            </Box>
          </Box>

          {/* Message */}
          <Typography
            variant="body1"
            sx={{
              color: isRead ? 'text.secondary' : 'text.primary',
              fontWeight: isRead ? 400 : 500,
              lineHeight: 1.6,
              mt: 0.5,
            }}
          >
            {notification.message || 'No message content.'}
          </Typography>

          {/* ID badge */}
          <Typography
            variant="caption"
            sx={{
              mt: 1.5,
              display: 'block',
              color: alpha(theme.palette.text.secondary, 0.5),
              fontSize: '0.7rem',
            }}
          >
            ID: {notification.id}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default React.memo(NotificationCard);
