import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react';
import getProfile from '../api/auth/getProfile';
import getAvatar from '../api/auth/getAvatar';

interface AuthNavbarProps {
    onLogout: () => void;
}

interface ProfileData {
    id: string;
    username: string;
    email?: string;
}

const AuthNavbar = ({ onLogout }: AuthNavbarProps) => {
    const { mode, toggleTheme } = useThemeContext();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const open = Boolean(anchorEl);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await getProfile();
                setProfileData(response.data);
                
                // Fetch avatar
                if (response.data?.player.id) {
                    try {
                        const avatarResponse = await getAvatar(response.data.player.id);
                        const avatarBlob = new Blob([avatarResponse.data]);
                        const avatarObjectUrl = URL.createObjectURL(avatarBlob);
                        setAvatarUrl(avatarObjectUrl);
                    } catch {
                        console.log('No avatar found, using default');
                        // Avatar will default to first letter of username
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfileData();
    }, []);

    // Cleanup avatar URL when component unmounts or avatarUrl changes
    useEffect(() => {
        return () => {
            if (avatarUrl) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
    }, [avatarUrl]);

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleViewProfile = () => {
        handleClose();
        if (profileData?.id) {
            navigate(`/profile/${profileData.id}`);
        }
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
        <AppBar position='static'>
            <Toolbar>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    Code Duel
                </Typography>
                <Box>
                    <Button color='inherit' component={RouterLink} to='/'>
                        Home
                    </Button>
                    <Button
                        color='inherit'
                        component={RouterLink}
                        to='/dashboard'
                    >
                        Dashboard
                    </Button>
                    <IconButton
                        sx={{ ml: 1 }}
                        onClick={toggleTheme}
                        color='inherit'
                    >
                        {mode === 'dark' ? (
                            <Brightness7Icon />
                        ) : (
                            <Brightness4Icon />
                        )}
                    </IconButton>
                    <IconButton
                        onClick={handleProfileClick}
                        sx={{ ml: 1 }}
                        size="small"
                    >
                        <Avatar
                            src={avatarUrl}
                            sx={{ width: 40, height: 40 }}
                        >
                            {profileData?.username?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        slotProps={{
                            paper: {
                                elevation: 0,
                            },
                        }}
                        sx={{
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            minWidth: 180,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        }}
                    >
                        <MenuItem onClick={handleViewProfile}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>View Profile</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleSettings}>
                            <ListItemIcon>
                                <SettingsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Settings</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Logout</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AuthNavbar;
