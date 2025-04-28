import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import register from '../api/auth/register';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setSnackbarOpen(true);
            return;
        }
        register({ username, email, password }).then((response) => {
            localStorage.setItem('token', response.data.token);
            console.log(response.status);
            if (response.status === 201) {
                navigate('/dashboard');
            }
        });
    };

    return (
        <Container component='main' maxWidth='xs'>
            <Snackbar
                open={snackbarOpen}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                message='Passwords do not match'
                action={
                    <Button
                        color='inherit'
                        onClick={() => setSnackbarOpen(false)}
                    >
                        Close
                    </Button>
                }
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity='error'
                    sx={{ width: '100%' }}
                >
                    Passwords do not match
                </Alert>
            </Snackbar>
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component='h1' variant='h5'>
                    Sign up
                </Typography>
                <Box
                    component='form'
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 3 }}
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
                        onChange={(e) => setUsername(e.target.value)}
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
                        onChange={(e) => setPassword(e.target.value)}
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
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Box textAlign='center'>
                        <RouterLink to='/login'>
                            {'Already have an account? Sign in'}
                        </RouterLink>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;
