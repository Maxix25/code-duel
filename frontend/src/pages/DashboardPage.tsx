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
        const data = await createRoom();
        console.log(`Room created with ID: ${data.roomId}`);
        navigate(`/room?roomId=${data.roomId}`);
    };

    const handleJoinRoom = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO: Implement API call to join the room with roomId
        console.log(`Joining room: ${roomId}`);
        if (roomId.trim()) {
            alert(
                `Joining room ${roomId} - functionality not implemented yet.`
            );
            // Potentially navigate to the room page: navigate(`/room/${roomId}`);
        } else {
            alert('Please enter a Room ID.');
        }
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
