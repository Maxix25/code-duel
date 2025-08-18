import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react';
import UserAvatar from './UserAvatar';
import getProfile from '../api/auth/getProfile';

interface AuthNavbarProps {
    onLogout: () => void;
}

const AuthNavbar = ({ onLogout }: AuthNavbarProps) => {
    const { mode, toggleTheme } = useThemeContext();
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [userId, setUserId] = useState<string>('');
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = await getProfile();
                setUserId(user.id);
                setUsername(user.username);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleViewProfile = () => {
        handleClose();
        navigate(`/profile/${userId}`);
    };
    const handleSettings = () => {
        handleClose();
        navigate('/profile-update');
    };

    const handleLogout = () => {
        handleClose();
        onLogout();
    };

    return (
        <AppBar
            position='static'
            sx={{
                background:
                    mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(33, 33, 33, 0.98) 100%)'
                        : 'linear-gradient(135deg, rgba(25, 118, 210, 0.9) 0%, rgba(21, 101, 192, 0.95) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow:
                    mode === 'dark'
                        ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                borderBottom:
                    mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.08)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                color: theme.palette.text.primary
            }}
        >
            <Toolbar
                sx={{ px: { xs: 2, md: 4 }, minHeight: '70px !important' }}
            >
                <Typography
                    variant='h6'
                    component='div'
                    sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                        background:
                            mode === 'dark'
                                ? 'linear-gradient(45deg, #ffffff 30%, #90caf9 90%)'
                                : 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.5px'
                    }}
                >
                    Code Duel
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        color='inherit'
                        component={RouterLink}
                        to='/'
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease',
                            color: mode === 'dark' ? '#ffffff' : 'inherit',
                            '&:hover': {
                                backgroundColor:
                                    mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                transform: 'translateY(-2px)',
                                boxShadow:
                                    mode === 'dark'
                                        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                        : '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }
                        }}
                    >
                        Home
                    </Button>
                    <Button
                        color='inherit'
                        component={RouterLink}
                        to='/dashboard'
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease',
                            color: mode === 'dark' ? '#ffffff' : 'inherit',
                            '&:hover': {
                                backgroundColor:
                                    mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                transform: 'translateY(-2px)',
                                boxShadow:
                                    mode === 'dark'
                                        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                        : '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }
                        }}
                    >
                        Dashboard
                    </Button>
                    <IconButton
                        sx={{
                            ml: 2,
                            p: 1.5,
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            color: mode === 'dark' ? '#ffffff' : 'inherit',
                            '&:hover': {
                                backgroundColor:
                                    mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                transform: 'rotate(180deg)',
                                boxShadow:
                                    mode === 'dark'
                                        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                        : '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }
                        }}
                        onClick={toggleTheme}
                        color='inherit'
                    >
                        {mode === 'dark' ? (
                            <Brightness7Icon sx={{ fontSize: '1.4rem' }} />
                        ) : (
                            <Brightness4Icon sx={{ fontSize: '1.4rem' }} />
                        )}
                    </IconButton>
                    <IconButton
                        onClick={handleProfileClick}
                        sx={{
                            ml: 1,
                            p: 1,
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            border: '2px solid transparent',
                            '&:hover': {
                                backgroundColor:
                                    mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                borderColor:
                                    mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.2)'
                                        : 'rgba(255, 255, 255, 0.3)',
                                transform: 'scale(1.05)',
                                boxShadow:
                                    mode === 'dark'
                                        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                        : '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }
                        }}
                        size='small'
                    >
                        <UserAvatar
                            playerId={userId}
                            username={username}
                            size={36}
                        />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        transformOrigin={{
                            horizontal: 'right',
                            vertical: 'top'
                        }}
                        anchorOrigin={{
                            horizontal: 'right',
                            vertical: 'bottom'
                        }}
                        slotProps={{
                            paper: {
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter:
                                        mode === 'dark'
                                            ? 'drop-shadow(0px 8px 32px rgba(0,0,0,0.5))'
                                            : 'drop-shadow(0px 8px 32px rgba(0,0,0,0.2))',
                                    mt: 1.5,
                                    minWidth: 200,
                                    borderRadius: 3,
                                    background:
                                        mode === 'dark'
                                            ? 'linear-gradient(145deg, rgba(33, 33, 33, 0.95) 0%, rgba(18, 18, 18, 0.98) 100%)'
                                            : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    border:
                                        mode === 'dark'
                                            ? '1px solid rgba(255, 255, 255, 0.1)'
                                            : '1px solid rgba(255, 255, 255, 0.2)',
                                    color:
                                        mode === 'dark' ? '#ffffff' : 'inherit',
                                    '& .MuiMenuItem-root': {
                                        borderRadius: 2,
                                        mx: 1,
                                        my: 0.5,
                                        transition: 'all 0.2s ease',
                                        color:
                                            mode === 'dark'
                                                ? '#ffffff'
                                                : 'inherit',
                                        '&:hover': {
                                            backgroundColor:
                                                mode === 'dark'
                                                    ? 'rgba(144, 202, 249, 0.08)'
                                                    : 'rgba(25, 118, 210, 0.08)',
                                            transform: 'translateX(4px)'
                                        }
                                    },
                                    '& .MuiListItemIcon-root': {
                                        minWidth: 36,
                                        color:
                                            mode === 'dark'
                                                ? '#90caf9'
                                                : 'primary.main'
                                    },
                                    '& .MuiDivider-root': {
                                        mx: 1,
                                        my: 1,
                                        borderColor:
                                            mode === 'dark'
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'rgba(0, 0, 0, 0.1)'
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor:
                                            mode === 'dark'
                                                ? '#212121'
                                                : 'background.paper',
                                        transform:
                                            'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                        border:
                                            mode === 'dark'
                                                ? '1px solid rgba(255, 255, 255, 0.1)'
                                                : '1px solid rgba(255, 255, 255, 0.2)',
                                        borderBottom: 'none',
                                        borderRight: 'none'
                                    }
                                }
                            }
                        }}
                    >
                        <MenuItem onClick={handleViewProfile} sx={{ py: 1.5 }}>
                            <ListItemIcon>
                                <PersonIcon fontSize='small' />
                            </ListItemIcon>
                            <ListItemText
                                primary='Profile'
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: 500
                                    }
                                }}
                            />
                        </MenuItem>
                        <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
                            <ListItemIcon>
                                <SettingsIcon fontSize='small' />
                            </ListItemIcon>
                            <ListItemText
                                primary='Settings'
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: 500
                                    }
                                }}
                            />
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor:
                                        mode === 'dark'
                                            ? 'rgba(244, 67, 54, 0.12)'
                                            : 'rgba(244, 67, 54, 0.08)',
                                    '& .MuiListItemIcon-root': {
                                        color: 'error.main'
                                    }
                                }
                            }}
                        >
                            <ListItemIcon>
                                <LogoutIcon fontSize='small' />
                            </ListItemIcon>
                            <ListItemText
                                primary='Logout'
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: 500
                                    }
                                }}
                            />
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AuthNavbar;
