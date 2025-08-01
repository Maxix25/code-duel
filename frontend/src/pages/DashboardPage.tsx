import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { useTheme, alpha } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import createRoom from '../api/room/createRoom';
import { useNavigate } from 'react-router-dom';
import checkIfUserIsInRoom from '../api/room/checkIfUserIsInRoom';

const DashboardPage: React.FC = () => {
    const [roomId, setRoomId] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState<string>('');
    const [roomPassword, setRoomPassword] = useState<string>('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserRoomStatus = async () => {
            try {
                const data = await checkIfUserIsInRoom();
                if (data.inRoom) {
                    setIsInRoom(true);
                    if (data.roomId) {
                        setCurrentRoomId(data.roomId);
                    }
                }
            } catch (error) {
                console.error('Failed to check if user is in a room:', error);
            }
        };
        fetchUserRoomStatus();
    }, []);

    const handleCreateRoom = async () => {
        const response = await createRoom(roomPassword);
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

    const theme = useTheme();
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.light,
                    0.1
                )} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
                py: { xs: 6, md: 10 }
            }}
        >
            <Container maxWidth='md'>
                <Typography
                    variant='h3'
                    component='h1'
                    fontWeight='bold'
                    align='center'
                    sx={{ mb: 5 }}
                >
                    Dashboard
                </Typography>
                <Grid container spacing={5} justifyContent='center'>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card
                            elevation={6}
                            sx={{ borderRadius: 4, p: 3, boxShadow: 8 }}
                        >
                            <CardContent>
                                <Stack spacing={2} alignItems='center'>
                                    <Box
                                        sx={{
                                            bgcolor: theme.palette.primary.main,
                                            color: theme.palette.primary
                                                .contrastText,
                                            borderRadius: '50%',
                                            width: 56,
                                            height: 56,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 1,
                                            boxShadow: 2
                                        }}
                                    >
                                        <AddCircleOutlineIcon fontSize='large' />
                                    </Box>
                                    <Typography
                                        variant='h6'
                                        component='h2'
                                        fontWeight='bold'
                                    >
                                        Create New Room
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        sx={{ mb: 2, textAlign: 'center' }}
                                    >
                                        Start a new 1v1 code duel.
                                    </Typography>

                                    <TextField
                                        margin='normal'
                                        fullWidth
                                        type='password'
                                        label='Room Password'
                                        value={roomPassword}
                                        onChange={(e) =>
                                            setRoomPassword(e.target.value)
                                        }
                                        sx={{ mb: 2 }}
                                    />

                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={handleCreateRoom}
                                        disabled={isInRoom}
                                        size='large'
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: 16,
                                            borderRadius: 3,
                                            width: '100%'
                                        }}
                                    >
                                        Create Room
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card
                            elevation={6}
                            sx={{ borderRadius: 4, p: 3, boxShadow: 8 }}
                        >
                            <CardContent>
                                <Stack spacing={2} alignItems='center'>
                                    <Box
                                        sx={{
                                            bgcolor:
                                                theme.palette.secondary.main,
                                            color: theme.palette.secondary
                                                .contrastText,
                                            borderRadius: '50%',
                                            width: 56,
                                            height: 56,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 1,
                                            boxShadow: 2
                                        }}
                                    >
                                        <MeetingRoomIcon fontSize='large' />
                                    </Box>
                                    <Typography
                                        variant='h6'
                                        component='h2'
                                        fontWeight='bold'
                                    >
                                        Join Existing Room
                                    </Typography>
                                    {isInRoom ? (
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            fullWidth
                                            onClick={() =>
                                                navigate(
                                                    `/room?roomId=${currentRoomId}`
                                                )
                                            }
                                            sx={{
                                                mt: 2,
                                                fontWeight: 600,
                                                fontSize: 16,
                                                borderRadius: 3
                                            }}
                                        >
                                            Go to Room (ID: {currentRoomId})
                                        </Button>
                                    ) : (
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
                                                onChange={(e) =>
                                                    setRoomId(e.target.value)
                                                }
                                                sx={{ mb: 2 }}
                                            />
                                            <Button
                                                type='submit'
                                                fullWidth
                                                variant='contained'
                                                color='secondary'
                                                size='large'
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: 16,
                                                    borderRadius: 3
                                                }}
                                            >
                                                Join Room
                                            </Button>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default DashboardPage;
