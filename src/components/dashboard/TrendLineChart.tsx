import { useState } from 'react';
import { Card, CardContent, Typography, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useThemeMode } from '../../context/ThemeContext';

interface ChartLine {
  dataKey: string;
  color: string;
  name: string;
}

interface TrendLineChartProps {
  data: any[];
  title?: string;
  lines?: ChartLine[];
  xAxisKey?: string;
  height?: number;
  showPeriodFilter?: boolean;
  onPeriodChange?: (period: string) => void;
  defaultPeriod?: string;
}

const TrendLineChart = ({
  data,
  title = 'Trend',
  lines = [{ dataKey: 'value', color: '#2E75B6', name: 'Value' }],
  xAxisKey = 'name',
  height = 280,
  showPeriodFilter = false,
  onPeriodChange,
  defaultPeriod = 'monthly',
}: TrendLineChartProps) => {
  const { isDark } = useThemeMode();
  const [period, setPeriod] = useState(defaultPeriod);

  const handlePeriodChange = (_event: React.MouseEvent<HTMLElement>, newPeriod: string | null) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
      if (onPeriodChange) {
        onPeriodChange(newPeriod);
      }
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: isDark ? '#2d2d2d' : 'white',
            p: 1.5,
            borderRadius: 1,
            boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.15)',
            border: `1px solid ${isDark ? '#444' : '#eee'}`,
          }}
        >
          <Typography variant="body2" fontWeight={500} gutterBottom sx={{ color: isDark ? '#e0e0e0' : 'inherit' }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: entry.color,
                }}
              />
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0a0' : 'text.secondary' }}>
                {entry.name}: <strong style={{ color: isDark ? '#e0e0e0' : 'inherit' }}>{entry.value}%</strong>
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          {showPeriodFilter && (
            <ToggleButtonGroup
              value={period}
              exclusive
              onChange={handlePeriodChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  borderColor: isDark ? '#444' : '#e0e0e0',
                  color: isDark ? '#a0a0a0' : '#666',
                  '&.Mui-selected': {
                    bgcolor: isDark ? '#5a9fd4' : '#2E75B6',
                    color: 'white',
                    '&:hover': {
                      bgcolor: isDark ? '#4a8fc4' : '#1a5a96',
                    },
                  },
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  },
                },
              }}
            >
              <ToggleButton value="daily">Daily</ToggleButton>
              <ToggleButton value="weekly">Weekly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly</ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>
        <Box sx={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#eee'} />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: isDark ? '#a0a0a0' : '#666' }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: isDark ? '#a0a0a0' : '#666' }}
                domain={[0, 'auto']}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              {lines.length > 1 && (
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <span style={{ color: isDark ? '#a0a0a0' : '#666', fontSize: '0.85rem' }}>{value}</span>
                  )}
                />
              )}
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: line.color }}
                  activeDot={{ r: 5, fill: line.color }}
                  name={line.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrendLineChart;
