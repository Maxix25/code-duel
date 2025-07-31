import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validateRoomPassword from '../api/room/validateRoomPassword';

const EnterPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('roomId');

    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!roomId) {
        // no room specified
        navigate('/dashboard');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await validateRoomPassword(roomId, password, setError);
        if (isValid) {
            navigate(`/room?roomId=${roomId}`);
        }
    };

    return (
        <>
            <Snackbar
                open={Boolean(error)}
                autoHideDuration={4000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity='error'
                    onClose={() => setError(null)}
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
            <Container maxWidth='xs' sx={{ mt: 8 }}>
                <Card elevation={4} sx={{ p: 3 }}>
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography
                                variant='h5'
                                align='center'
                                gutterBottom
                            >
                                Enter Room Password
                            </Typography>
                            <Box component='form' onSubmit={handleSubmit}>
                                <TextField
                                    label='Password'
                                    type='password'
                                    fullWidth
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    type='submit'
                                    variant='contained'
                                    fullWidth
                                    size='large'
                                >
                                    Join Room
                                </Button>
                                <Button
                                    variant='text'
                                    fullWidth
                                    onClick={() => navigate('/dashboard')}
                                    sx={{ mt: 1 }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};

export default EnterPasswordPage;
