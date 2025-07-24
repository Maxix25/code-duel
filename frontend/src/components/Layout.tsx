import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Container,
} from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
import { useThemeContext } from '../context/ThemeContext'; // Adjust path if needed
import CssBaseline from '@mui/material/CssBaseline'; // Ensures baseline styles match theme
import AuthNavbar from './AuthNavbar'; // Import the authenticated navbar

const Layout: React.FC = () => {
    const { mode, toggleTheme } = useThemeContext();
    // Manage authentication state within Layout
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('token')
    );
    const navigate = useNavigate();

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token
        setIsAuthenticated(false); // Update state
        navigate('/login'); // Navigate to login
    };

    // Effect to listen for storage changes (optional, but good practice for multi-tab scenarios)
    useEffect(() => {
        const handleStorageChange = () => {
            console.log('Storage changed, checking auth state');
            setIsAuthenticated(!!localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleStorageChange);

        // Check auth state on mount in case it changed while the component wasn't mounted
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

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
