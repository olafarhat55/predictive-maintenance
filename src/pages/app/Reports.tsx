import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Rating,
  CircularProgress,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  TrendingDown as DowntimeIcon,
  Psychology as AccuracyIcon,
  Savings as SavingsIcon,
  Build as MaintenanceIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import html2pdf from 'html2pdf.js';
import { api } from '../../services/api';
import { useThemeMode } from '../../context/ThemeContext';
import type { ReportsData } from '../../types';

const Reports = () => {
  const { isDark } = useThemeMode();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState<ReportsData | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      setLoading(true);
      try {
        const reportsData = await api.getReportsData();
        setData(reportsData);
      } catch (error) {
        console.error('Failed to fetch reports data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  const handleExportPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    setExporting(true);
    try {
      // Wait for any pending renders / chart animations
      await new Promise(resolve => setTimeout(resolve, 300));

      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `predictive-maintenance-report-${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as const },
      };

      // Clone so we can force light styles for the PDF without affecting the UI
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.backgroundColor = '#ffffff';
      clone.style.color = '#333333';
      clone.style.padding = '16px';
      clone.style.width = `${element.scrollWidth}px`;

      // Force light colors on all cards and text inside the clone
      clone.querySelectorAll<HTMLElement>('.MuiCard-root, .MuiPaper-root').forEach(el => {
        el.style.backgroundColor = '#ffffff';
        el.style.color = '#333333';
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
        el.style.border = '1px solid #e0e0e0';
      });
      clone.querySelectorAll<HTMLElement>('.MuiTypography-root').forEach(el => {
        // Preserve colored headings (KPI values) but fix regular text
        if (!el.style.color || el.style.color === 'rgb(241, 245, 249)' || el.style.color === 'rgb(148, 163, 184)') {
          el.style.color = '#333333';
        }
      });
      clone.querySelectorAll<HTMLElement>('.MuiTableCell-root').forEach(el => {
        el.style.color = '#333333';
        el.style.borderBottomColor = '#e0e0e0';
      });

      // Append off-screen, render, then remove
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      document.body.appendChild(clone);

      await html2pdf().set(opt).from(clone).save();

      document.body.removeChild(clone);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            // @ts-expect-error MUI v7 Grid item prop
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
          {/* @ts-expect-error MUI v7 Grid item prop */}
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
          {/* @ts-expect-error MUI v7 Grid item prop */}
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  const pieData = [
    { name: 'Preventive', value: data?.preventive_vs_reactive?.preventive || 75, color: '#4caf50' },
    { name: 'Reactive', value: data?.preventive_vs_reactive?.reactive || 25, color: '#f44336' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Reports & Analytics
        </Typography>
        <Button
          variant="contained"
          startIcon={exporting ? <CircularProgress size={18} color="inherit" /> : <PdfIcon />}
          onClick={handleExportPDF}
          disabled={exporting}
        >
          {exporting ? 'Generating...' : 'Export PDF'}
        </Button>
      </Box>

      <Box ref={reportRef}>
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* @ts-expect-error MUI v7 Grid item prop */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <DowntimeIcon sx={{ color: '#4caf50' }} />
                <Typography variant="body2" color="text.secondary">
                  Downtime Reduction
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600} color="#4caf50">
                {data?.downtime_reduction || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* @ts-expect-error MUI v7 Grid item prop */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccuracyIcon sx={{ color: '#1976d2' }} />
                <Typography variant="body2" color="text.secondary">
                  Prediction Accuracy
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600} color="#1976d2">
                {data?.prediction_accuracy || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* @ts-expect-error MUI v7 Grid item prop */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: '#fff3e0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <SavingsIcon sx={{ color: '#ff9800' }} />
                <Typography variant="body2" color="text.secondary">
                  Cost Savings
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600} color="#ff9800">
                ${(data?.cost_savings / 1000).toFixed(0)}K
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* @ts-expect-error MUI v7 Grid item prop */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: '#f3e5f5' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MaintenanceIcon sx={{ color: '#9c27b0' }} />
                <Typography variant="body2" color="text.secondary">
                  Preventive Rate
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600} color="#9c27b0">
                {data?.preventive_vs_reactive?.preventive || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* @ts-expect-error MUI v7 Grid item prop */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Monthly Downtime Trend
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.monthly_downtime || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#eee'} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: isDark ? '#a0a0a0' : '#666' }} />
                    <YAxis tick={{ fontSize: 12, fill: isDark ? '#a0a0a0' : '#666' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#283444' : '#fff',
                        border: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                        color: isDark ? '#e0e0e0' : '#333',
                      }}
                    />
                    <Bar dataKey="hours" fill={isDark ? '#5a9fd4' : '#2E75B6'} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* @ts-expect-error MUI v7 Grid item prop */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Maintenance Type Distribution
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Technician Performance */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Technician Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: isDark ? '#283444' : '#f5f5f5',
                    '& th': {
                      color: isDark ? '#e5e5e5' : 'inherit',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      borderBottom: isDark ? '1px solid #404040' : '1px solid #e0e0e0',
                    },
                  }}
                >
                  <TableCell>Technician</TableCell>
                  <TableCell align="center">Completed WOs</TableCell>
                  <TableCell align="center">Avg. Time (hrs)</TableCell>
                  <TableCell align="center">Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.technician_performance?.map((tech, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography fontWeight={500}>{tech.name}</Typography>
                    </TableCell>
                    <TableCell align="center">{tech.completed}</TableCell>
                    <TableCell align="center">{tech.avg_time}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Rating value={tech.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2">{tech.rating}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      </Box>
    </Box>
  );
};

export default Reports;
