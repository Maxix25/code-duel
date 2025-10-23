import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useTheme, alpha } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BadgeIcon from '@mui/icons-material/Badge';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveIcon from '@mui/icons-material/Remove';
import getPlayerProfile from '../api/profile/getPlayerProfile';
import getAvatar from '../api/profile/getAvatar';
import { isAxiosError } from 'axios';

interface PlayerProfile {
    id: string;
    username: string;
    avatar?: string;
    wins: number;
    losses: number;
    draws: number;
}

const ProfilePage: React.FC = () => {
    const { playerId } = useParams<{ playerId: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<PlayerProfile | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    useEffect(() => {
        let isMounted = true;
        let objectUrl: string | undefined;

        const fetchPlayerProfile = async () => {
            if (!playerId) {
                if (isMounted) {
                    setError('Player ID is required');
                    setLoading(false);
                }
                return;
            }

            try {
                setLoading(true);
                const response = await getPlayerProfile(playerId);
                const playerData: PlayerProfile = response.data.player;
                if (isMounted) setProfile(playerData);

                if (playerData.avatar) {
                    try {
                        const avatarResponse = await getAvatar(playerId);
                        const avatarBlob = avatarResponse.data;
                        objectUrl = URL.createObjectURL(avatarBlob);
                        if (isMounted) setAvatarUrl(objectUrl);
                    } catch (avatarError) {
                        console.error('Error fetching avatar:', avatarError);
                    }
                } else if (isMounted) {
                    setAvatarUrl(null);
                }
            } catch (error) {
                console.error('Error fetching player profile:', error);
                if (isMounted) {
                    if (isAxiosError(error)) {
                        if (error.response?.status === 404) {
                            setError('Player not found');
                        } else if (error.response?.status === 401) {
                            setError(
                                'You need to be logged in to view profiles'
                            );
                        } else {
                            setError(
                                error.response?.data?.message ||
                                    'Failed to load player profile'
                            );
                        }
                    } else {
                        setError('Failed to load player profile');
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchPlayerProfile();

        return () => {
            isMounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [playerId]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <CircularProgress size={60} color='primary' />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.light,
                        0.12
                    )} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`
                }}
            >
                <Container maxWidth='sm'>
                    <Card elevation={6} sx={{ borderRadius: 4, p: 3 }}>
                        <CardContent>
                            <Stack spacing={3} alignItems='center'>
                                <Alert severity='error' sx={{ width: '100%' }}>
                                    {error}
                                </Alert>
                                <Button
                                    variant='contained'
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => navigate(-1)}
                                >
                                    Go Back
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.light,
                    0.12
                )} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`
            }}
        >
            <Container maxWidth='sm'>
                <Card
                    elevation={6}
                    sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, boxShadow: 8 }}
                >
                    <CardContent>
                        <Stack spacing={4} alignItems='center'>
                            {/* Back Button */}
                            <Box sx={{ alignSelf: 'flex-start' }}>
                                <Button
                                    variant='text'
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => navigate(-1)}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Back
                                </Button>
                            </Box>

                            {/* Avatar */}
                            {avatarUrl ? (
                                <Avatar
                                    src={avatarUrl}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        boxShadow: 4
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        color: theme.palette.primary
                                            .contrastText,
                                        borderRadius: '50%',
                                        width: 120,
                                        height: 120,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 4
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: 60 }} />
                                </Box>
                            )}

                            {/* Profile Information */}
                            <Stack spacing={3} sx={{ width: '100%' }}>
                                <Typography
                                    variant='h4'
                                    component='h1'
                                    fontWeight='bold'
                                    align='center'
                                >
                                    {profile?.username}
                                </Typography>

                                {/* User Details */}
                                <Stack spacing={2}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            bgcolor: alpha(
                                                theme.palette.primary.main,
                                                0.05
                                            ),
                                            borderRadius: 2
                                        }}
                                    >
                                        <BadgeIcon color='primary' />
                                        <Box>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                            >
                                                Username
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                fontWeight='medium'
                                            >
                                                {profile?.username}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>

                                {/* Game Statistics */}
                                <Box>
                                    <Typography
                                        variant='h6'
                                        fontWeight='bold'
                                        align='center'
                                        sx={{ mb: 2 }}
                                    >
                                        Game Statistics
                                    </Typography>
                                    <Stack
                                        direction='row'
                                        spacing={1}
                                        sx={{ width: '100%' }}
                                    >
                                        {/* Wins */}
                                        <Box
                                            sx={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                p: 2,
                                                bgcolor: alpha(
                                                    theme.palette.success.main,
                                                    0.1
                                                ),
                                                borderRadius: 2,
                                                border: `2px solid ${alpha(
                                                    theme.palette.success.main,
                                                    0.3
                                                )}`
                                            }}
                                        >
                                            <EmojiEventsIcon
                                                sx={{
                                                    color: theme.palette.success
                                                        .main,
                                                    fontSize: 28,
                                                    mb: 1
                                                }}
                                            />
                                            <Typography
                                                variant='h5'
                                                fontWeight='bold'
                                                color='success.main'
                                            >
                                                {profile?.wins || 0}
                                            </Typography>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                            >
                                                Wins
                                            </Typography>
                                        </Box>

                                        {/* Losses */}
                                        <Box
                                            sx={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                p: 2,
                                                bgcolor: alpha(
                                                    theme.palette.error.main,
                                                    0.1
                                                ),
                                                borderRadius: 2,
                                                border: `2px solid ${alpha(
                                                    theme.palette.error.main,
                                                    0.3
                                                )}`
                                            }}
                                        >
                                            <CancelIcon
                                                sx={{
                                                    color: theme.palette.error
                                                        .main,
                                                    fontSize: 28,
                                                    mb: 1
                                                }}
                                            />
                                            <Typography
                                                variant='h5'
                                                fontWeight='bold'
                                                color='error.main'
                                            >
                                                {profile?.losses || 0}
                                            </Typography>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                            >
                                                Losses
                                            </Typography>
                                        </Box>

                                        {/* Ties */}
                                        <Box
                                            sx={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                p: 2,
                                                bgcolor: alpha(
                                                    theme.palette.grey[500],
                                                    0.1
                                                ),
                                                borderRadius: 2,
                                                border: `2px solid ${alpha(
                                                    theme.palette.grey[500],
                                                    0.3
                                                )}`
                                            }}
                                        >
                                            <RemoveIcon
                                                sx={{
                                                    color: theme.palette
                                                        .grey[600],
                                                    fontSize: 28,
                                                    mb: 1
                                                }}
                                            />
                                            <Typography
                                                variant='h5'
                                                fontWeight='bold'
                                                color='text.primary'
                                            >
                                                {profile?.draws || 0}
                                            </Typography>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                            >
                                                Ties
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Win Rate */}
                                    {profile &&
                                        profile.wins +
                                            profile.losses +
                                            profile.draws >
                                            0 && (
                                            <Box
                                                sx={{
                                                    mt: 2,
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                >
                                                    Win Rate:{' '}
                                                    <Typography
                                                        component='span'
                                                        fontWeight='bold'
                                                        color={
                                                            profile.wins /
                                                                (profile.wins +
                                                                    profile.losses +
                                                                    profile.draws) >
                                                            0.5
                                                                ? 'success.main'
                                                                : 'text.primary'
                                                        }
                                                    >
                                                        {(
                                                            (profile.wins /
                                                                (profile.wins +
                                                                    profile.losses +
                                                                    profile.draws)) *
                                                            100
                                                        ).toFixed(1)}
                                                        %
                                                    </Typography>
                                                </Typography>
                                            </Box>
                                        )}
                                </Box>

                                {/* Player ID */}
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Typography
                                        variant='caption'
                                        color='text.secondary'
                                    >
                                        Player ID
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            fontFamily: 'monospace',
                                            bgcolor: alpha(
                                                theme.palette.grey[500],
                                                0.1
                                            ),
                                            p: 1,
                                            borderRadius: 1,
                                            mt: 0.5
                                        }}
                                    >
                                        {profile?.id}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ProfilePage;
