import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Container
} from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
import { useThemeContext } from '../context/ThemeContext'; // Adjust path if needed
import CssBaseline from '@mui/material/CssBaseline'; // Ensures baseline styles match theme
import AuthNavbar from './AuthNavbar'; // Import the authenticated navbar
import useAuth from '../hooks/useAuth';

const Layout: React.FC = () => {
    const { mode, toggleTheme } = useThemeContext();
    const { isAuthenticated, logout } = useAuth(); // Use custom hook to get auth state
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <CssBaseline /> {/* Apply baseline styles based on the theme */}
            {isAuthenticated ? (
                <AuthNavbar onLogout={handleLogout} /> // Pass logout handler
            ) : (
                <AppBar position='relative'>
                    <Toolbar>
                        <Typography
                            variant='h6'
                            component='div'
                            sx={{ flexGrow: 1 }}
                        >
                            Code Duel
                        </Typography>
                        <Button color='inherit' component={RouterLink} to='/'>
                            Home
                        </Button>
                        <Button
                            color='inherit'
                            component={RouterLink}
                            to='/login'
                        >
                            Login
                        </Button>
                        <Button
                            color='inherit'
                            component={RouterLink}
                            to='/register'
                        >
                            Register
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
                    </Toolbar>
                </AppBar>
            )}
            <Container component='main' sx={{ mt: 4, mb: 4 }}>
                <Outlet /> {/* Child routes will render here */}
            </Container>
            <Box component='footer' sx={{ bgcolor: 'background.paper', p: 6 }}>
                <Typography
                    variant='body2'
                    color='text.secondary'
                    align='center'
                >
                    {'Copyright © '}
                    <RouterLink color='inherit' to='/'>
                        Code Duel
                    </RouterLink>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Box>
        </>
    );
};

export default Layout;
