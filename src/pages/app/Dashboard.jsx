import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Skeleton,
} from '@mui/material';
import {
  PrecisionManufacturing as MachineIcon,
  Warning as WarningIcon,
  Assignment as WorkOrderIcon,
  TrendingDown as PredictionIcon,
} from '@mui/icons-material';
import { api } from '../../services/api';
import { connectSocket, disconnectSocket, getSocket } from '../../services/socket';
import {
  StatCard,
  HealthPieChart,
  TrendLineChart,
  AIInsightCard,
  SensorTrendsChart,
} from '../../components/dashboard';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [healthData, setHealthData] = useState([]);
  const [failureTrend, setFailureTrend] = useState([]);
  const [trendPeriod, setTrendPeriod] = useState('monthly');
  const [sensorTrends, setSensorTrends] = useState([]);
  const [aiInsights, setAIInsights] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('0s ago');
  const [filters, setFilters] = useState({
    timeRange: '7d',
    asset: 'all',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsData, health, trend, sensors, insights] = await Promise.all([
          api.getDashboardStats(),
          api.getHealthDistribution(),
          api.getFailureTrend('monthly'),
          api.getSensorTrends(),
          api.getAIInsights(),
        ]);

        setStats(statsData);
        setHealthData(health);
        setFailureTrend(trend);
        setSensorTrends(sensors);
        setAIInsights(insights);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Connect to socket for real-time updates
    const socket = connectSocket();

    socket.on('machine_update', (data) => {
      // Update sensor trends with new data
      setSensorTrends((prev) => {
        const newData = [...prev];
        if (newData.length > 10) newData.shift();
        newData.push({
          time: new Date().toLocaleTimeString(),
          temperature: data.sensors.temperature,
          vibration: data.sensors.vibration,
          pressure: data.sensors.pressure,
        });
        return newData;
      });
      setLastUpdated('0s ago');
    });

    // Update last updated time
    const interval = setInterval(() => {
      setLastUpdated((prev) => {
        const seconds = parseInt(prev) || 0;
        return `${seconds + 3}s ago`;
      });
    }, 3000);

    return () => {
      disconnectSocket();
      clearInterval(interval);
    };
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrendPeriodChange = async (newPeriod) => {
    setTrendPeriod(newPeriod);
    try {
      const trend = await api.getFailureTrend(newPeriod);
      setFailureTrend(trend);
    } catch (error) {
      console.error('Failed to fetch failure trend data:', error);
    }
  };

  if (loading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={350} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={350} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select
            size="small"
            name="timeRange"
            value={filters.timeRange}
            onChange={handleFilterChange}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            name="asset"
            value={filters.asset}
            onChange={handleFilterChange}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="all">All Assets</MenuItem>
            <MenuItem value="cnc">CNC Machines</MenuItem>
            <MenuItem value="pumps">Pumps</MenuItem>
            <MenuItem value="engines">Engines</MenuItem>
          </TextField>
          <Button variant="outlined" size="small">
            Apply
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Assets"
            value={stats?.total_assets || 0}
            icon={MachineIcon}
            color="#2E75B6"
            trend="up"
            trendValue="+5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="At Risk"
            value={stats?.warning + stats?.critical || 0}
            icon={WarningIcon}
            color="#ff9800"
            subtitle={`${stats?.warning} warning, ${stats?.critical} critical`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Work Orders"
            value={stats?.active_work_orders || 0}
            icon={WorkOrderIcon}
            color="#4caf50"
            trend="down"
            trendValue="-12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Predicted Failures"
            value={stats?.predicted_failures || 0}
            icon={PredictionIcon}
            color="#f44336"
            subtitle="Next 7 days"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <HealthPieChart
            data={healthData}
            title="Asset Health Distribution"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TrendLineChart
            data={failureTrend}
            title="Failure Probability Trend"
            lines={[{ dataKey: 'probability', color: '#f44336', name: 'Failure %' }]}
            xAxisKey="label"
            showPeriodFilter={true}
            onPeriodChange={handleTrendPeriodChange}
            defaultPeriod="monthly"
          />
        </Grid>
      </Grid>

      {/* AI Insights and Sensor Trends */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <AIInsightCard insights={aiInsights} />
        </Grid>
        <Grid item xs={12} md={7}>
          <SensorTrendsChart
            data={sensorTrends}
            title="Live Sensor Trends"
            lastUpdated={lastUpdated}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
