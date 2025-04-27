import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // For linking to register page

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO: Implement login logic here
        console.log('Login attempt:', { email, password });
        alert('Login functionality not implemented yet.');
    };

    return (
        <Container
            maxWidth='xs'
            sx={{
                display: 'flex', // Make Container a flex container
                flexDirection: 'column', // Stack children vertically
                justifyContent: 'center', // Center children vertically
                alignItems: 'center', // Center children horizontally (for the Paper itself)
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%', // Ensure Paper takes full width of the Container
                }}
            >
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>
                <Box
                    component='form'
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1, width: '100%' }} // Ensure form Box takes full width
                >
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        name='email'
                        autoComplete='email'
                        autoFocus
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
                        autoComplete='current-password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Add Remember me checkbox if needed */}
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Box textAlign='center'>
                        <RouterLink to='/register'>
                            {"Don't have an account? Sign Up"}
                        </RouterLink>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
