import { Card, CardContent, Typography, Box, Chip, LinearProgress, Button } from '@mui/material';
import {
  Psychology as AIIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const severityConfig = {
  critical: {
    color: '#f44336',
    bgcolor: '#ffebee',
    icon: ErrorIcon,
  },
  warning: {
    color: '#ff9800',
    bgcolor: '#fff3e0',
    icon: WarningIcon,
  },
  info: {
    color: '#2196f3',
    bgcolor: '#e3f2fd',
    icon: AIIcon,
  },
};

const AIInsightCard = ({ insights }) => {
  const navigate = useNavigate();

  const handleViewMachine = (machineId) => {
    navigate(`/machines/${machineId}`);
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AIIcon sx={{ color: '#2E75B6' }} />
          <Typography variant="h6" fontWeight={600}>
            AI Insights
          </Typography>
          <Chip
            label="AI-Powered"
            size="small"
            sx={{
              ml: 'auto',
              bgcolor: '#e3f2fd',
              color: '#1976d2',
              fontSize: '0.7rem',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {insights.map((insight) => {
            const config = severityConfig[insight.severity] || severityConfig.info;
            const SeverityIcon = config.icon;

            return (
              <Box
                key={insight.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: config.bgcolor,
                  border: `1px solid ${config.color}20`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <SeverityIcon sx={{ color: config.color, mt: 0.25 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {insight.asset_id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {insight.machine_name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {insight.insight}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Confidence
                          </Typography>
                          <Typography variant="caption" fontWeight={500}>
                            {insight.confidence}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={insight.confidence}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: '#fff',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: config.color,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => handleViewMachine(insight.machine_id)}
                        sx={{
                          color: config.color,
                          '&:hover': { bgcolor: `${config.color}10` },
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AIInsightCard;
