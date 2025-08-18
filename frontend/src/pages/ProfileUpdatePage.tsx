import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import { useTheme, alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import updateProfile from '../api/auth/updateProfile';
import getProfile from '../api/auth/getProfile';
import uploadAvatar from '../api/auth/uploadAvatar';
import UserAvatar from '../components/UserAvatar';
import { isAxiosError } from 'axios';

const ProfileUpdate: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('error');
    const [userId, setUserId] = useState<string>('');
    const [avatarKey, setAvatarKey] = useState<number>(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getProfile();
                setUsername(profile.username);
                setEmail(profile.email);
                setUserId(profile.id);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setSnackbarMessage('Failed to load profile');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, []);

    // Cleanup preview URL when component unmounts
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // If user wants to change password, both old and new password are required
        if (password || oldPassword) {
            if (!oldPassword) {
                setSnackbarMessage(
                    'Current password is required to change password'
                );
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            if (!password) {
                setSnackbarMessage('New password is required');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            if (password !== confirmPassword) {
                setSnackbarMessage('New passwords do not match');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
        }

        setLoading(true);
        try {
            const response = await updateProfile({
                username,
                email,
                old_password: oldPassword,
                password
            });
            if (response.status === 200) {
                setSnackbarMessage('Profile updated successfully!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                // Clear password fields after successful update
                setOldPassword('');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            if (isAxiosError(error) && error.response?.data.message) {
                setSnackbarMessage(error.response.data.message);
            } else {
                setSnackbarMessage('Failed to update profile');
            }
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setSnackbarMessage('Please select a valid image file');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setSnackbarMessage('File size must be less than 5MB');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            setSelectedFile(file);

            // Create preview URL
            const objectUrl = URL.createObjectURL(file);
            // Clean up previous preview URL if it exists
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(objectUrl);
        }
    };

    const handleAvatarUpload = async () => {
        if (!selectedFile) return;

        setUploadingAvatar(true);
        try {
            await uploadAvatar(selectedFile);
            setSnackbarMessage('Avatar updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Clean up preview URL
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            setSelectedFile(null);
            setPreviewUrl('');
            // Force UserAvatar component to re-fetch the avatar
            setAvatarKey((prev) => prev + 1);
        } catch (error) {
            if (isAxiosError(error) && error.response?.data.message) {
                setSnackbarMessage(error.response.data.message);
            } else {
                setSnackbarMessage('Failed to upload avatar');
            }
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleCancelPreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl('');
    };

    if (loadingProfile) {
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
            <Container maxWidth='xs' disableGutters>
                <Snackbar
                    open={snackbarOpen}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={4000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
                <Card
                    elevation={6}
                    sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, boxShadow: 8 }}
                >
                    <CardContent>
                        <Stack spacing={3} alignItems='center'>
                            {/* Show preview if file is selected, otherwise show UserAvatar */}
                            {previewUrl ? (
                                <Box sx={{ textAlign: 'center' }}>
                                    <Avatar
                                        src={previewUrl}
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            mb: 1,
                                            boxShadow: 2,
                                            border: `2px solid ${theme.palette.primary.main}`
                                        }}
                                    />
                                    <Typography
                                        variant='caption'
                                        color='primary'
                                        sx={{
                                            display: 'block',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Preview
                                    </Typography>
                                </Box>
                            ) : (
                                <UserAvatar
                                    key={avatarKey}
                                    playerId={userId}
                                    username={username}
                                    size={64}
                                />
                            )}

                            {/* Avatar Upload Section */}
                            <Box sx={{ textAlign: 'center', mt: 1, mb: 2 }}>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    id='avatar-upload'
                                />
                                <Stack
                                    direction='row'
                                    spacing={1}
                                    justifyContent='center'
                                    alignItems='center'
                                >
                                    <label htmlFor='avatar-upload'>
                                        <Button
                                            variant='outlined'
                                            component='span'
                                            size='small'
                                        >
                                            Choose Image
                                        </Button>
                                    </label>
                                    {selectedFile && (
                                        <>
                                            <Button
                                                variant='contained'
                                                size='small'
                                                onClick={handleAvatarUpload}
                                                disabled={uploadingAvatar}
                                            >
                                                {uploadingAvatar
                                                    ? 'Uploading...'
                                                    : 'Upload'}
                                            </Button>
                                            <Button
                                                variant='outlined'
                                                size='small'
                                                color='secondary'
                                                onClick={handleCancelPreview}
                                                disabled={uploadingAvatar}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                </Stack>
                                {selectedFile && (
                                    <Typography
                                        variant='caption'
                                        color='textSecondary'
                                        sx={{ mt: 1, display: 'block' }}
                                    >
                                        Selected: {selectedFile.name}
                                    </Typography>
                                )}
                            </Box>

                            <Typography
                                component='h1'
                                variant='h5'
                                fontWeight='bold'
                            >
                                Update Profile
                            </Typography>
                            <Box
                                component='form'
                                onSubmit={handleSubmit}
                                noValidate
                                sx={{ width: '100%' }}
                            >
                                <TextField
                                    margin='normal'
                                    required
                                    fullWidth
                                    id='username'
                                    label='Username'
                                    name='username'
                                    autoFocus
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                                <TextField
                                    margin='normal'
                                    required
                                    fullWidth
                                    id='email'
                                    label='Email Address'
                                    name='email'
                                    autoComplete='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TextField
                                    margin='normal'
                                    fullWidth
                                    name='oldPassword'
                                    label='Current Password (optional)'
                                    type='password'
                                    id='oldPassword'
                                    autoComplete='current-password'
                                    value={oldPassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                    helperText='Only required if you want to change your password'
                                />
                                <TextField
                                    margin='normal'
                                    fullWidth
                                    name='password'
                                    label='New Password (optional)'
                                    type='password'
                                    id='password'
                                    autoComplete='new-password'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    helperText='Leave empty to keep current password'
                                />
                                <TextField
                                    margin='normal'
                                    fullWidth
                                    name='confirmPassword'
                                    label='Confirm New Password'
                                    type='password'
                                    id='confirmPassword'
                                    autoComplete='new-password'
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                                {loading ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            mt: 3,
                                            mb: 2
                                        }}
                                    >
                                        <CircularProgress
                                            size={32}
                                            color='primary'
                                        />
                                    </Box>
                                ) : (
                                    <Button
                                        type='submit'
                                        fullWidth
                                        variant='contained'
                                        size='large'
                                        sx={{
                                            mt: 3,
                                            mb: 2,
                                            fontWeight: 600,
                                            fontSize: 18,
                                            borderRadius: 3
                                        }}
                                    >
                                        Update Profile
                                    </Button>
                                )}
                                <Button
                                    component={Link}
                                    to='/dashboard'
                                    variant='text'
                                    color='secondary'
                                    sx={{ mt: 1 }}
                                >
                                    Dashboard
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ProfileUpdate;
