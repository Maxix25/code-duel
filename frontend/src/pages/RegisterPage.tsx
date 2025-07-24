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
    Snackbar,
    Alert,
    useTheme,
    alpha,
    CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';
import register from '../api/auth/register';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setSnackbarOpen(true);
            return;
        }
        setLoading(true);
        register({ username, email, password })
            .then((response) => {
                localStorage.setItem('token', response.data.token);
                if (response.status === 201) {
                    navigate('/dashboard');
                }
            })
            .finally(() => setLoading(false));
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
                <Snackbar
                    open={snackbarOpen}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={4000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity='error'
                        sx={{ width: '100%' }}
                    >
                        Passwords do not match
                    </Alert>
                </Snackbar>
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
                                Sign up
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
                                    id='email'
                                    label='Email Address'
                                    name='email'
                                    autoComplete='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TextField
                                    margin='normal'
                                    required
                                    fullWidth
                                    name='password'
                                    label='Password'
                                    type='password'
                                    id='password'
                                    autoComplete='new-password'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <TextField
                                    margin='normal'
                                    required
                                    fullWidth
                                    name='confirmPassword'
                                    label='Confirm Password'
                                    type='password'
                                    id='confirmPassword'
                                    autoComplete='new-password'
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                                {loading ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            mt: 3,
                                            mb: 2
                                        }}
                                    >
                                        <CircularProgress
                                            size={32}
                                            color='primary'
                                        />
                                    </Box>
                                ) : (
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
                                        Sign Up
                                    </Button>
                                )}
                                <Typography
                                    variant='body2'
                                    align='center'
                                    sx={{ mt: 2 }}
                                >
                                    Already have an account?{' '}
                                    <Button
                                        component={RouterLink}
                                        to='/login'
                                        color='secondary'
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: 16
                                        }}
                                    >
                                        Sign in
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

export default RegisterPage;
