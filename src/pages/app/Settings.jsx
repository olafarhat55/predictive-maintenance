import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  MenuItem,
  Divider,
  Alert,
  Skeleton,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { api } from '../../services/api';
import { timezones, languages } from '../../data/mockData';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [companySettings, setCompanySettings] = useState({
    name: '',
    timezone: '',
    language: '',
    service_type: '',
  });
  const [thresholds, setThresholds] = useState({
    temperature_warning: 80,
    temperature_critical: 90,
    vibration_warning: 0.5,
    vibration_critical: 1.0,
    pressure_warning: 100,
    pressure_critical: 120,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await api.getCompanySettings();
        setCompanySettings({
          name: data.name || '',
          timezone: data.timezone || 'Africa/Cairo',
          language: data.language || 'en',
          service_type: data.service_type || 'both',
        });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanySettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleThresholdChange = (e) => {
    const { name, value } = e.target;
    setThresholds((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSaveCompany = async () => {
    setSaving(true);
    try {
      await api.updateCompanySettings(companySettings);
      setSuccess('Company settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveThresholds = async () => {
    setSaving(true);
    try {
      // In a real app, this would save to backend
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccess('Threshold settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save thresholds:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={48} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={400} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Settings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="Company" />
          <Tab label="Thresholds" />
          <Tab label="Notifications" />
          <Tab label="Integrations" />
        </Tabs>

        <CardContent>
          {/* Company Settings Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Company Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="name"
                    value={companySettings.name}
                    onChange={handleCompanyChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Timezone"
                    name="timezone"
                    value={companySettings.timezone}
                    onChange={handleCompanyChange}
                  >
                    {timezones.map((tz) => (
                      <MenuItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Language"
                    name="language"
                    value={companySettings.language}
                    onChange={handleCompanyChange}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Service Type"
                    name="service_type"
                    value={companySettings.service_type}
                    onChange={handleCompanyChange}
                  >
                    <MenuItem value="monitoring">Monitoring Only</MenuItem>
                    <MenuItem value="predictive">Predictive Only</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveCompany}
                  disabled={saving}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          )}

          {/* Thresholds Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Sensor Thresholds
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure warning and critical thresholds for sensor readings.
              </Typography>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Temperature (°C)
              </Typography>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Warning Threshold"
                    name="temperature_warning"
                    type="number"
                    value={thresholds.temperature_warning}
                    onChange={handleThresholdChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Critical Threshold"
                    name="temperature_critical"
                    type="number"
                    value={thresholds.temperature_critical}
                    onChange={handleThresholdChange}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Vibration (mm/s)
              </Typography>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Warning Threshold"
                    name="vibration_warning"
                    type="number"
                    inputProps={{ step: 0.1 }}
                    value={thresholds.vibration_warning}
                    onChange={handleThresholdChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Critical Threshold"
                    name="vibration_critical"
                    type="number"
                    inputProps={{ step: 0.1 }}
                    value={thresholds.vibration_critical}
                    onChange={handleThresholdChange}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Pressure (PSI)
              </Typography>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Warning Threshold"
                    name="pressure_warning"
                    type="number"
                    value={thresholds.pressure_warning}
                    onChange={handleThresholdChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Critical Threshold"
                    name="pressure_critical"
                    type="number"
                    value={thresholds.pressure_critical}
                    onChange={handleThresholdChange}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveThresholds}
                  disabled={saving}
                >
                  Save Thresholds
                </Button>
              </Box>
            </Box>
          )}

          {/* Notifications Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Typography color="text.secondary">
                Notification settings coming soon...
              </Typography>
            </Box>
          )}

          {/* Integrations Tab */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Integrations
              </Typography>
              <Typography color="text.secondary">
                Integration settings coming soon...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
