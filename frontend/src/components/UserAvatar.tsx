import getAvatar from '../api/profile/getAvatar';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';

interface UserAvatarProps {
    playerId: string;
    username?: string;
    size?: number;
}

const UserAvatar = ({ playerId, username, size = 40 }: UserAvatarProps) => {
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await getAvatar(playerId);
                const avatarBlob = new Blob([response.data]);
                const objectUrl = URL.createObjectURL(avatarBlob);
                setAvatarUrl(objectUrl);
            } catch {
                console.log('No avatar found for user:', playerId);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (playerId) {
            fetchAvatar();
        }
    }, [playerId]);

    // Cleanup avatar URL when component unmounts or avatarUrl changes
    useEffect(() => {
        return () => {
            if (avatarUrl) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
    }, [avatarUrl]);

    if (loading) {
        return (
            <Box
                sx={{
                    width: size,
                    height: size,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <CircularProgress size={size * 0.6} />
            </Box>
        );
    }

    return (
        <Avatar
            src={error ? undefined : avatarUrl}
            sx={{ width: size, height: size }}
            alt={username ? `${username}'s avatar` : 'User avatar'}
        >
            <PersonIcon sx={{ fontSize: size * 0.6 }} />
        </Avatar>
    );
};

export default UserAvatar;
