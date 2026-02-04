import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PrecisionManufacturing as MachineIcon,
  Assignment as WorkOrderIcon,
  Build as MaintenanceIcon,
  Assessment as ReportsIcon,
  NotificationsActive as AlertsIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import { getNavItems } from '../../utils/permissions';

const drawerWidth = 240;
const collapsedWidth = 64;

const iconMap = {
  Dashboard: DashboardIcon,
  PrecisionManufacturing: MachineIcon,
  Assignment: WorkOrderIcon,
  Build: MaintenanceIcon,
  Assessment: ReportsIcon,
  NotificationsActive: AlertsIcon,
  People: UsersIcon,
  Settings: SettingsIcon,
};

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = getNavItems(user);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // For desktop, open means expanded, !open means collapsed
  const isCollapsed = !isMobile && !open;

  // Theme-aware colors
  const sidebarBgColor = isDark ? '#1a1a1a' : '#fafafa';
  const borderColor = isDark ? '#333' : '#e0e0e0';
  const hoverBgColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
  const textColor = isDark ? '#e0e0e0' : 'text.primary';
  const iconColor = isDark ? '#a0a0a0' : 'text.secondary';

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar />
      <List sx={{ px: isCollapsed ? 0.5 : 1 }}>
        {navItems.map((item) => {
          const IconComponent = iconMap[item.icon] || DashboardIcon;
          const active = isActive(item.path);

          const listItemButton = (
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                bgcolor: active ? 'primary.main' : 'transparent',
                color: active ? 'white' : textColor,
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: isCollapsed ? 1.5 : 2,
                transition: 'background-color 0.2s ease, color 0.2s ease',
                '&:hover': {
                  bgcolor: active ? 'primary.dark' : hoverBgColor,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? 'white' : iconColor,
                  minWidth: isCollapsed ? 0 : 40,
                  justifyContent: 'center',
                  transition: 'color 0.2s ease',
                }}
              >
                <IconComponent />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: active ? 600 : 400,
                }}
                sx={{
                  opacity: isCollapsed ? 0 : 1,
                  display: isCollapsed ? 'none' : 'block',
                  transition: theme.transitions.create(['opacity'], {
                    duration: theme.transitions.duration.shorter,
                  }),
                }}
              />
            </ListItemButton>
          );

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              {isCollapsed ? (
                <Tooltip title={item.label} placement="right" arrow>
                  {listItemButton}
                </Tooltip>
              ) : (
                listItemButton
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: `1px solid ${borderColor}`,
            bgcolor: sidebarBgColor,
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          },
        }}
        SlideProps={{
          easing: {
            enter: theme.transitions.easing.easeOut,
            exit: theme.transitions.easing.sharp,
          },
          timeout: {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${borderColor}`,
          bgcolor: sidebarBgColor,
          overflowX: 'hidden',
          transition: 'width 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
