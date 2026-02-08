import { Box, Typography, useTheme } from '@mui/material';
import { useThemeMode } from '../../context/ThemeContext';

const Footer = () => {
  const theme = useTheme();
  const { isDark } = useThemeMode();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: isDark ? '#1a1a1a' : '#fafafa',
        borderTop: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">


      </Typography>
    </Box>
  );
};

export default Footer;
