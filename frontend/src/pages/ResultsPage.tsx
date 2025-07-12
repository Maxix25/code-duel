import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Result = {
    username: string;
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
        fetch(`/api/room/${roomId}/results`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch results');
                return res.json();
            })
            .then((data) => {
                setResults(data.results || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [roomId]);

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
                        <Box key={idx} sx={{ mb: 2 }}>
                            <Typography variant='h6'>{res.username}</Typography>
                            <Typography>Score: {res.score}</Typography>
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
