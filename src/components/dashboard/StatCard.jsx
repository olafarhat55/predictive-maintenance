import { Card, CardContent, Box, Typography } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = '#2E75B6',
  trend,
  trendValue,
  subtitle,
}) => {
  const isPositiveTrend = trend === 'up';

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={600} sx={{ color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {Icon && (
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ fontSize: 28, color }} />
            </Box>
          )}
        </Box>

        {trend && trendValue && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
            {isPositiveTrend ? (
              <TrendingUpIcon sx={{ fontSize: 18, color: '#4caf50', mr: 0.5 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 18, color: '#f44336', mr: 0.5 }} />
            )}
            <Typography
              variant="caption"
              sx={{
                color: isPositiveTrend ? '#4caf50' : '#f44336',
                fontWeight: 500,
              }}
            >
              {trendValue}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
