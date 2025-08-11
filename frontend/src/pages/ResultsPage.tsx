import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import getResult from '../api/room/getResult';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import { alpha, useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

type Result = {
    playerId: string;
    username: string;
    score: number;
};

const ResultsPage = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [results, setResults] = useState<Result[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (!roomId) {
            setError('No room ID provided.');
            setLoading(false);
            return;
        }
        getResult(roomId)
            .then((data) => {
                setResults(data.results);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch results. Please try again later.');
                setLoading(false);
            });
    }, [roomId]);

    // Derive leaderboard info
    const sortedResults = (results ?? []).slice().sort((a, b) => b.score - a.score);
    const highestScore = sortedResults.length > 0 ? sortedResults[0].score : null;

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

    const rankLabel = (index: number) => {
        if (index === 0) return 'Winner';
        if (index === 1) return 'Runner-up';
        if (index === 2) return 'Third Place';
        return `#${index + 1}`;
    };

    const rankStyles = (index: number) => {
        if (index === 0) {
            return {
                chipColor: 'warning' as const,
                iconColor: theme.palette.warning.main,
                rowBg: alpha(theme.palette.warning.main, 0.08),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.25)}`,
            };
        }
        if (index === 1) {
            return {
                chipColor: 'info' as const,
                iconColor: theme.palette.info.main,
                rowBg: alpha(theme.palette.info.main, 0.08),
                border: `1px solid ${alpha(theme.palette.info.main, 0.25)}`,
            };
        }
        if (index === 2) {
            return {
                chipColor: 'secondary' as const,
                iconColor: theme.palette.secondary.main,
                rowBg: alpha(theme.palette.secondary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.25)}`,
            };
        }
        return {
            chipColor: 'default' as const,
            iconColor: theme.palette.text.secondary,
            rowBg: alpha(theme.palette.grey[500], 0.06),
            border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
        };
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.12)} 0%, ${alpha(theme.palette.secondary.light, 0.12)} 100%)`,
                p: { xs: 2, sm: 4 },
            }}
        >
            <Container maxWidth="md">
                <Card elevation={6} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 8 }}>
                    <CardHeader
                        avatar={
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '50%',
                                    display: 'grid',
                                    placeItems: 'center',
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.25)} 0%, ${alpha(theme.palette.primary.main, 0.25)} 100%)`,
                                }}
                            >
                                <EmojiEventsIcon sx={{ color: theme.palette.warning.dark, fontSize: 28 }} />
                            </Box>
                        }
                        title={
                            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
                                Room Results
                            </Typography>
                        }
                        subheader={
                            <Typography variant="body2" color="text.secondary">
                                {roomId ? `Room ID: ${roomId}` : 'No room selected'}
                            </Typography>
                        }
                        sx={{ p: { xs: 2, sm: 3 } }}
                    />
                    <Divider />
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        {loading && (
                            <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
                                <CircularProgress size={56} />
                                <Typography color="text.secondary">Fetching results...</Typography>
                            </Stack>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {!loading && !error && sortedResults.length === 0 && (
                            <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
                                <Typography>No results found for this room.</Typography>
                                <Button variant="contained" onClick={() => navigate('/dashboard')}>
                                    Back to Dashboard
                                </Button>
                            </Stack>
                        )}

                        {!loading && !error && sortedResults.length > 0 && (
                            <Stack spacing={2.5}>
                                {sortedResults.map((res, idx) => {
                                    const styles = rankStyles(idx);
                                    const percent = highestScore ? Math.round((res.score / highestScore) * 100) : 0;
                                    return (
                                        <Box
                                            key={`${res.playerId}-${idx}`}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: styles.rowBg,
                                                border: styles.border,
                                            }}
                                        >
                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                                                <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                                                    <Avatar
                                                        component={RouterLink}
                                                        to={`/profile/${res.playerId}`}
                                                        sx={{
                                                            bgcolor: alpha(styles.iconColor, 0.15),
                                                            color: styles.iconColor,
                                                            fontWeight: 700,
                                                            textDecoration: 'none'
                                                        }}
                                                    >
                                                        {getInitials(res.username)}
                                                    </Avatar>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                                            {idx === 0 && (
                                                                <EmojiEventsIcon sx={{ color: styles.iconColor }} />
                                                            )}
                                                            <Link
                                                                component={RouterLink}
                                                                to={`/profile/${res.playerId}`}
                                                                underline="hover"
                                                                color="inherit"
                                                                sx={{ fontWeight: 600 }}
                                                            >
                                                                <Typography variant="h6" noWrap component="span">
                                                                    {res.username}
                                                                </Typography>
                                                            </Link>
                                                        </Stack>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Score: <strong>{res.score}</strong>
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                <Chip label={rankLabel(idx)} color={styles.chipColor} variant={idx > 2 ? 'outlined' : 'filled'} />
                                            </Stack>

                                            <Box sx={{ mt: 2 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={percent}
                                                    sx={{ height: 8, borderRadius: 999 }}
                                                />
                                                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        0%
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {percent}% of top score
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        )}

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                            <Button fullWidth variant="outlined" color="primary" onClick={() => navigate('/dashboard')}>
                                Back to Dashboard
                            </Button>
                            <Button fullWidth variant="contained" color="secondary" onClick={() => navigate('/find-room')}>
                                Find Another Match
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ResultsPage;
