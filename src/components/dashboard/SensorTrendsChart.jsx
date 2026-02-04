import { useState } from 'react';
import { Card, CardContent, Typography, Box, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
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
import { Circle as CircleIcon } from '@mui/icons-material';

const sensorConfig = {
  temperature: { color: '#f44336', unit: '°C', label: 'Temperature' },
  vibration: { color: '#2196f3', unit: 'mm/s', label: 'Vibration' },
  pressure: { color: '#4caf50', unit: 'PSI', label: 'Pressure' },
};

const SensorTrendsChart = ({ data, title = 'Sensor Trends', lastUpdated }) => {
  const [activeSensors, setActiveSensors] = useState(['temperature', 'vibration', 'pressure']);

  const handleSensorToggle = (event, newSensors) => {
    if (newSensors.length) {
      setActiveSensors(newSensors);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'white',
            p: 1.5,
            borderRadius: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: '1px solid #eee',
          }}
        >
          <Typography variant="body2" fontWeight={500} gutterBottom>
            Time: {label}
          </Typography>
          {payload.map((entry, index) => {
            const sensor = sensorConfig[entry.dataKey];
            return (
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
                <Typography variant="body2" color="text.secondary">
                  {sensor?.label}: <strong>{entry.value.toFixed(2)} {sensor?.unit}</strong>
                </Typography>
              </Box>
            );
          })}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            <Chip
              icon={<CircleIcon sx={{ fontSize: '10px !important', color: '#f44336 !important', animation: 'pulse 1.5s infinite' }} />}
              label="Live"
              size="small"
              sx={{
                bgcolor: '#ffebee',
                color: '#f44336',
                fontSize: '0.7rem',
                '& .MuiChip-icon': { ml: 0.5 },
              }}
            />
          </Box>
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated}
            </Typography>
          )}
        </Box>

        <ToggleButtonGroup
          value={activeSensors}
          onChange={handleSensorToggle}
          size="small"
          sx={{ mb: 2 }}
        >
          {Object.entries(sensorConfig).map(([key, config]) => (
            <ToggleButton
              key={key}
              value={key}
              sx={{
                textTransform: 'none',
                px: 2,
                '&.Mui-selected': {
                  bgcolor: `${config.color}15`,
                  color: config.color,
                  '&:hover': { bgcolor: `${config.color}25` },
                },
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: config.color,
                  mr: 1,
                }}
              />
              {config.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box sx={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => {
                  const config = sensorConfig[value];
                  return (
                    <span style={{ color: '#666', fontSize: '0.85rem' }}>
                      {config?.label || value}
                    </span>
                  );
                }}
              />
              {activeSensors.includes('temperature') && (
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke={sensorConfig.temperature.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: sensorConfig.temperature.color }}
                  activeDot={{ r: 5 }}
                />
              )}
              {activeSensors.includes('vibration') && (
                <Line
                  type="monotone"
                  dataKey="vibration"
                  stroke={sensorConfig.vibration.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: sensorConfig.vibration.color }}
                  activeDot={{ r: 5 }}
                  yAxisId="right"
                />
              )}
              {activeSensors.includes('pressure') && (
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke={sensorConfig.pressure.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: sensorConfig.pressure.color }}
                  activeDot={{ r: 5 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Card>
  );
};

export default SensorTrendsChart;
