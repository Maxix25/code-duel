import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Grid,
} from '@mui/material';
import createRoom from '../api/room/createRoom';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = async () => {
        const response = await createRoom();
        if (response.status === 400) {
            alert(
                'Error creating room: Already in room with ID ' +
                    response.roomId
            );
            return;
        } else if (response.status === 200) {
            navigate(`/room?roomId=${response.roomId}`);
        } else {
            alert('Unexpected error occurred while creating room');
        }
    };

    const handleJoinRoom = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/room?roomId=${roomId}`);
        setRoomId(''); // Clear the input field after joining
    };

    return (
        <Container maxWidth='md' sx={{ mt: 4 }}>
            <Typography variant='h4' component='h1' gutterBottom align='center'>
                Dashboard
            </Typography>
            <Grid container spacing={4} justifyContent='center'>
                <Grid sx={{ xs: 12, sm: 6 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant='h6' component='h2' gutterBottom>
                            Create New Room
                        </Typography>
                        <Typography variant='body1' sx={{ mb: 2 }}>
                            Start a new 1v1 code duel.
                        </Typography>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleCreateRoom}
                        >
                            Create Room
                        </Button>
                    </Paper>
                </Grid>

                <Grid sx={{ xs: 12, sm: 6 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant='h6' component='h2' gutterBottom>
                            Join Existing Room
                        </Typography>
                        <Box
                            component='form'
                            onSubmit={handleJoinRoom}
                            sx={{ width: '100%', mt: 1 }}
                        >
                            <TextField
                                margin='normal'
                                fullWidth
                                id='roomId'
                                label='Enter Room ID'
                                name='roomId'
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                type='submit'
                                fullWidth
                                variant='contained'
                                color='secondary'
                            >
                                Join Room
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DashboardPage;
