import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme, alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import loginApi from '../api/auth/login';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useAuth from '../hooks/useAuth';
import { BACKEND_URL } from '../api/api';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loginApi({ username, password })
            .then((response) => {
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    navigate('/dashboard');
                }
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
    };

    const handleGoogleLogin = () => {
        // Redirect to Google OAuth endpoint
        window.location.href = `${BACKEND_URL}/auth/google`;
    };

    const theme = useTheme();
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.light,
                    0.12
                )} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`
            }}
        >
            <Container maxWidth='xs' disableGutters>
                <Card
                    elevation={6}
                    sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, boxShadow: 8 }}
                >
                    <CardContent>
                        <Stack spacing={3} alignItems='center'>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    borderRadius: '50%',
                                    width: 64,
                                    height: 64,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 1,
                                    boxShadow: 2
                                }}
                            >
                                <LockOutlinedIcon fontSize='large' />
                            </Box>
                            <Typography
                                component='h1'
                                variant='h5'
                                fontWeight='bold'
                            >
                                Sign in
                            </Typography>
                            <Box
                                component='form'
                                onSubmit={handleSubmit}
                                noValidate
                                sx={{ width: '100%' }}
                            >
                                <TextField
                                    margin='normal'
                                    required
                                    fullWidth
                                    id='username'
                                    label='Username'
                                    name='username'
                                    autoFocus
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                                <TextField
                                    margin='normal'
                                    required
                                    fullWidth
                                    name='password'
                                    label='Password'
                                    type='password'
                                    id='password'
                                    autoComplete='current-password'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <Button
                                    type='submit'
                                    fullWidth
                                    variant='contained'
                                    size='large'
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        fontWeight: 600,
                                        fontSize: 18,
                                        borderRadius: 3
                                    }}
                                >
                                    Sign In
                                </Button>

                                <Divider sx={{ my: 2 }}>
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                    >
                                        or
                                    </Typography>
                                </Divider>

                                <Button
                                    fullWidth
                                    variant='outlined'
                                    size='large'
                                    onClick={handleGoogleLogin}
                                    sx={{
                                        mb: 2,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        borderRadius: 3,
                                        borderColor: '#dadce0',
                                        color: '#3c4043',
                                        backgroundColor: '#fff',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#f8f9fa',
                                            borderColor: '#dadce0'
                                        },
                                        '& .MuiButton-startIcon': {
                                            marginRight: 1
                                        }
                                    }}
                                    startIcon={
                                        <Box
                                            component='img'
                                            src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPHBhdGggZD0iTTE3LjY0IDkuMjA0NTQ1NGMwLS42MzgxODE4LS4wNTczMjczLS45NTQ1NDU0LS4xNjQzNjM2LS45NTQ1NDU0SC45djMuNzcyNzI3M0g1LjQ4Yy0uMjMzNjM2NCAxLjI1NTQ1NDUtLjkyNTQ1NDUgMi4zMTgtMS44MzQwOTA5IDMuMDI5MDkwOXY2LjM1NDU0NTVoMi45Nzc0NTQ1QzE2LjUxODYzNjQgMTAuNjMgMTcuNjQgOS45NTQ1NDU0IDE3LjY0IDkuMjA0NTQ1NHoiIGZpbGw9IiM0Mjg1RjQiLz4KICAgIDxwYXRoIGQ9Ik05IDIyYzIuNDMgMCA0LjQ2NzI3MjctLjggNS45NTYzNjM2LTIuMTUyNzI3M2wtMi45Nzc0NTQ1LTYuMzU0NTQ1NUMxMC43MjM2MzY0IDEzLjYgMTAuMDA2MzY0IDEzLjg1NDU0NTQgOSAxMy44NTQ1NDU0Yy0yLjE5NTQ1NDUgMC00LjA2MTgxODE4LTEuNDc4MTgxOC00LjcyMzYzNjM2LTMuNDc3MjcyN0gwLjExNTQ1NDU1djYuNzEwOTA5MUMxLjU5NDU0NTQ1IDIwLjAyMDkwOTEgNS4yNzI3MjcyNSAyMiA5IDIyeiIgZmlsbD0iIzM0QTg1MyIvPgogICAgPHBhdGggZD0iTTQuMjc2MzYzNjQgMTAuMzc3MjcyN0MzLjkzIDkuNDggMy45MyA4LjUyIDQuMjc2MzYzNjQgNy42MjI3MjcyN1YwLjkxMTgxODE4MDBIMS4xMTU0NTQ1NUM0LjMxODU0NTQ1IDE4LjIwOTA5MDkgOS40ODM2MzY0IDE4IDkuNDgzNjM2NCAxOGMzLjc1OTk5OTk2IDAgNy4xMTgxODE4IDIuMjMwOTA5MDkgOS4wNDU0NTQ1IDUuODExODE4MThsLTYuOTgzNjM2NCA1LjU2NTQ1NDU0QzkuMDEzNjM2MzYgOC41NzI3MjcyNyA2Ljc4NTQ1NDU0IDcuNDU0NTQ1NDUgNC4yNzYzNjM2NCAxMC4zNzcyNzI3eiIgZmlsbD0iI0ZCQkMwNCIvPgogICAgPHBhdGggZD0iTTkgMy42NzI3MjcyOGMyLjIwNzI3MjcgMCA0LjIwOTA5MDkuNzY3MjcyNzMgNS43NDkwOTA5IDIuMjkwOTA5MDlsMS42MzI3MjczLTEuNjMyNzI3M0MxNC40ODM2MzY0IDIuMTYgMTEuODc0NTQ1NCAwIDkgMGMtNC45NDU0NTQ1NCAwLTkuMjQgMy4xNDA5MDkwOS0xMC44ODQ1NDU0NSA3LjY5MDkwOTA5bDUuMTYxODE4MTcgNC4wNDE4MjczQzQuMDYxODE4MTggNy45NzA5MDkwOSA2LjMxNjM2MzY0IDMuNjcyNzI3MjggOSAzLjY3MjcyNzI4eiIgZmlsbD0iI0VBNDMzNSIvPgogIDwvZz4KPC9zdmc+'
                                            alt='Google logo'
                                            sx={{ width: 18, height: 18 }}
                                        />
                                    }
                                >
                                    Continue with Google
                                </Button>
                                <Typography
                                    variant='body2'
                                    align='center'
                                    sx={{ mt: 2 }}
                                >
                                    Don't have an account?{' '}
                                    <Button
                                        component={RouterLink}
                                        to='/register'
                                        color='secondary'
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: 16
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default LoginPage;
