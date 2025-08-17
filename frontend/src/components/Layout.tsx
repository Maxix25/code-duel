import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
import { useThemeContext } from '../context/ThemeContext'; // Adjust path if needed
import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Ensures baseline styles match theme
import AuthNavbar from './AuthNavbar'; // Import the authenticated navbar
import useAuth from '../hooks/useAuth';

const Layout: React.FC = () => {
    const { mode, toggleTheme } = useThemeContext();
    const theme = useTheme();
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
                <AppBar
                    position='relative'
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
                        sx={{
                            px: { xs: 2, md: 4 },
                            minHeight: '70px !important'
                        }}
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
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
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
                                    color:
                                        mode === 'dark' ? '#ffffff' : 'inherit',
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
                                to='/login'
                                sx={{
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.3s ease',
                                    color:
                                        mode === 'dark' ? '#ffffff' : 'inherit',
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
                                Login
                            </Button>
                            <Button
                                color='inherit'
                                component={RouterLink}
                                to='/register'
                                sx={{
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.3s ease',
                                    color:
                                        mode === 'dark' ? '#ffffff' : 'inherit',
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
                                Register
                            </Button>
                            <IconButton
                                sx={{
                                    ml: 2,
                                    p: 1.5,
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    color:
                                        mode === 'dark' ? '#ffffff' : 'inherit',
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
                                    <Brightness7Icon
                                        sx={{ fontSize: '1.4rem' }}
                                    />
                                ) : (
                                    <Brightness4Icon
                                        sx={{ fontSize: '1.4rem' }}
                                    />
                                )}
                            </IconButton>
                        </Box>
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
