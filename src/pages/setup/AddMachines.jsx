import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  TablePagination,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PrecisionManufacturing as MachineIcon,
} from '@mui/icons-material';
import { machineTypes } from '../../data/mockData';
import { api } from '../../services/api';
import { useThemeMode } from '../../context/ThemeContext';

const initialMachineState = {
  name: '',
  type: '',
  location: '',
  serial_number: '',
  criticality: 'medium',
};

// View states: 'initial' | 'form' | 'table'
const AddMachines = ({ machines, onUpdate, onNext, onBack }) => {
  const { isDark } = useThemeMode();
  const [machineList, setMachineList] = useState(machines || []);
  const [viewState, setViewState] = useState(machineList.length > 0 ? 'table' : 'initial');
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState(initialMachineState);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleShowForm = (index = null) => {
    if (index !== null) {
      setFormData(machineList[index]);
      setEditIndex(index);
    } else {
      setFormData(initialMachineState);
      setEditIndex(null);
    }
    setViewState('form');
  };

  const handleCancel = () => {
    setFormData(initialMachineState);
    setEditIndex(null);
    setViewState(machineList.length > 0 ? 'table' : 'initial');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveMachine = async (addAnother = false) => {
    setLoading(true);
    try {
      if (editIndex !== null) {
        const updated = [...machineList];
        updated[editIndex] = formData;
        setMachineList(updated);
      } else {
        const newMachine = await api.createMachine(formData);
        setMachineList([...machineList, newMachine]);
      }

      if (addAnother) {
        setFormData(initialMachineState);
        setEditIndex(null);
      } else {
        setFormData(initialMachineState);
        setEditIndex(null);
        setViewState('table');
      }
    } catch (error) {
      console.error('Failed to save machine:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMachine = (index) => {
    const updated = machineList.filter((_, i) => i !== index);
    setMachineList(updated);
    if (updated.length === 0) {
      setViewState('initial');
    }
  };

  const handleNext = () => {
    onUpdate(machineList);
    onNext();
  };

  const getCriticalityColor = (criticality) => {
    switch (criticality) {
      case 'high':
        return { bgcolor: '#ffebee', color: '#f44336' };
      case 'medium':
        return { bgcolor: '#fff3e0', color: '#ff9800' };
      case 'low':
        return { bgcolor: '#e8f5e9', color: '#4caf50' };
      default:
        return { bgcolor: '#f5f5f5', color: '#757575' };
    }
  };

  // Initial State - Card with Add button
  if (viewState === 'initial') {
    return (
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Add Machines
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Add your critical machines so we can set monitoring and predicting failures.
        </Typography>

        <Card
          variant="outlined"
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: '#fafafa',
            borderStyle: 'dashed',
            mb: 4,
          }}
        >
          <CardContent>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <MachineIcon sx={{ fontSize: 40, color: '#2E75B6' }} />
            </Box>
            <Typography variant="h6" gutterBottom>
              Add Machines Manually
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your machine details one by one
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleShowForm()}
            >
              Add
            </Button>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onBack} variant="outlined">
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Box>
      </Paper>
    );
  }

  // Form State
  if (viewState === 'form') {
    return (
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Machines Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {editIndex !== null ? 'Edit machine details' : 'Enter machine details'}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3} sx={{ maxWidth: 800 }}>
            {/* Row 1 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Machine Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Machine Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {machineTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Row 2 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location / Production Line"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Line A, Building 1"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Serial Number"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
              />
            </Grid>

            {/* Row 3 - Criticality */}
            <Grid item xs={12}>
              <FormControl>
                <FormLabel sx={{ mb: 1 }}>Criticality</FormLabel>
                <RadioGroup
                  row
                  name="criticality"
                  value={formData.criticality}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="high"
                    control={
                      <Radio
                        sx={{
                          color: '#f44336',
                          '&.Mui-checked': { color: '#f44336' },
                        }}
                      />
                    }
                    label="High"
                  />
                  <FormControlLabel
                    value="medium"
                    control={
                      <Radio
                        sx={{
                          color: '#ff9800',
                          '&.Mui-checked': { color: '#ff9800' },
                        }}
                      />
                    }
                    label="Medium"
                  />
                  <FormControlLabel
                    value="low"
                    control={
                      <Radio
                        sx={{
                          color: '#4caf50',
                          '&.Mui-checked': { color: '#4caf50' },
                        }}
                      />
                    }
                    label="Low"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          {/* Action Buttons - Centered */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{ minWidth: 150 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSaveMachine(true)}
              disabled={!formData.name || !formData.type || loading}
              sx={{ minWidth: 200 }}
            >
              Save & Add Another
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSaveMachine(false)}
              disabled={!formData.name || !formData.type || loading}
              sx={{ minWidth: 150 }}
            >
              Save Machine
            </Button>
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Table State
  return (
    <Paper sx={{ p: 4, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Machines Table
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {machineList.length} machine{machineList.length !== 1 ? 's' : ''} added
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleShowForm()}
        >
          Add Machine
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: isDark ? '#2d2d2d' : '#f5f5f5',
                '& th': {
                  color: isDark ? '#e5e5e5' : 'inherit',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderBottom: isDark ? '1px solid #404040' : '1px solid #e0e0e0',
                },
              }}
            >
              <TableCell>Machine Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Serial No.</TableCell>
              <TableCell>Criticality</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {machineList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((machine, index) => {
                const actualIndex = page * rowsPerPage + index;
                return (
                  <TableRow key={actualIndex}>
                    <TableCell>{machine.name}</TableCell>
                    <TableCell>{machine.location || '-'}</TableCell>
                    <TableCell>{machine.type}</TableCell>
                    <TableCell>{machine.serial_number || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={machine.criticality.charAt(0).toUpperCase() + machine.criticality.slice(1)}
                        size="small"
                        sx={getCriticalityColor(machine.criticality)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleShowForm(actualIndex)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteMachine(actualIndex)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {machineList.length > rowsPerPage && (
          <TablePagination
            component="div"
            count={machineList.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
          />
        )}
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} variant="outlined">
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Paper>
  );
};

export default AddMachines;
