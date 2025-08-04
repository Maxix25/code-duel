import getAllRooms from '../api/room/getAllRooms';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Lock from '@mui/icons-material/Lock';
import LockOpen from '@mui/icons-material/LockOpen';

type Room = {
    id: string;
    name: string;
    maxCapacity: number;
    num_players: number;
    visibility: 'public' | 'private';
};

const FindRoomPage = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const allRooms = await getAllRooms();
                console.log(allRooms);
                setRooms(allRooms);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Typography variant='h4' gutterBottom>
                Available Rooms
            </Typography>
            {rooms.length === 0 ? (
                <Typography variant='body1' color='textSecondary'>
                    No rooms available at the moment.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {rooms.map((room) => (
                        <Grid key={room.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card
                                elevation={3}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant='h6'
                                        component='div'
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}
                                    >
                                        {room.name}
                                        {room.visibility === 'private' ? (
                                            <Lock
                                                fontSize='small'
                                                color='action'
                                            />
                                        ) : (
                                            <LockOpen
                                                fontSize='small'
                                                color='action'
                                            />
                                        )}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color='textSecondary'
                                    >
                                        ID: {room.id}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color='textSecondary'
                                        sx={{ mt: 1 }}
                                    >
                                        Players: {room.num_players}/
                                        {room.maxCapacity}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size='small'
                                        variant='contained'
                                        onClick={() =>
                                            navigate(`/room?roomId=${room.id}`)
                                        }
                                    >
                                        Join
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default FindRoomPage;
