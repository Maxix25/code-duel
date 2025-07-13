import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import getResult from '../api/room/getResult';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

type Result = {
    player: string;
    score: number;
    // Add more fields as needed
};

const ResultsPage = () => {
    const urlparams = new URLSearchParams(window.location.search);
    const roomId = urlparams.get('roomId');
    const [results, setResults] = useState<Result[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!roomId) {
            setError('No room ID provided.');
            setLoading(false);
            return;
        }
        getResult(roomId).then((data) => {
            console.log(data);
            setResults(data.results);
            setLoading(false);
        });
    }, [roomId]);

    // Find the highest score
    const highestScore =
        results && results.length > 0
            ? Math.max(...results.map((r) => r.score))
            : null;

    return (
        <Box
            sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant='h4' gutterBottom>
                Room Results
            </Typography>
            {loading && <CircularProgress />}
            {error && <Typography color='error'>{error}</Typography>}
            {!loading && !error && results && results.length === 0 && (
                <Typography>No results found for this room.</Typography>
            )}
            {!loading && !error && results && results.length > 0 && (
                <Paper sx={{ p: 3, minWidth: 320 }}>
                    {results.map((res, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                                variant='h6'
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                {res.score === highestScore && (
                                    <EmojiEventsIcon
                                        sx={{ color: 'gold', ml: 1 }}
                                    />
                                )}
                                {res.player}
                            </Typography>
                            <Typography marginInlineStart={1}>
                                Score: {res.score}
                            </Typography>
                        </Box>
                    ))}
                </Paper>
            )}
            <Button
                sx={{ mt: 3 }}
                variant='contained'
                onClick={() => navigate('/dashboard')}
            >
                Back to Dashboard
            </Button>
        </Box>
    );
};

export default ResultsPage;
