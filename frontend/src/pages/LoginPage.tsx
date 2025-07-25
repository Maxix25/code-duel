import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    Stack,
    useTheme,
    alpha
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import loginApi from '../api/auth/login';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useAuth from '../hooks/useAuth';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loginApi({ username, password })
            .then((response) => {
                if (response.status === 200) {
                    login(response.data.token);
                    navigate('/dashboard');
                }
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
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
