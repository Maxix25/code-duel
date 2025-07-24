import React from 'react';
import { Typography, Container, Button, Box, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { keyframes } from '@mui/system';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HomePage: React.FC = () => {
    const features = [
        {
            icon: <GroupIcon sx={{ fontSize: 40 }} color="primary" />,
            title: 'Live Duels',
            description: 'Challenge your friends or other developers to real-time coding battles.',
        },
        {
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} color="primary" />,
            title: 'Climb the Leaderboards',
            description: 'Earn points for every win and see how you rank against the best.',
        },
        {
            icon: <CodeIcon sx={{ fontSize: 40 }} color="primary" />,
            title: 'Vast Problem Library',
            description: 'Practice with a wide range of problems from various difficulty levels.',
        },
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Container maxWidth="md" sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
                <Box sx={{ animation: `${fadeIn} 1s ease-out` }}>
                    <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                        Welcome to Code Duel
                    </Typography>
                    <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
                        The ultimate platform for competitive programming. Sharpen your skills, challenge your peers, and climb to the top.
                    </Typography>
                    <Button variant="contained" color="primary" size="large">
                        Get Started
                    </Button>
                </Box>
            </Container>

            {/* About Section */}
            <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 }, textAlign: 'center' }}>
                <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
                    Why Code Duel?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Code Duel is designed for programmers of all levels to compete, learn, and grow. Whether you're a beginner or a seasoned coder, our platform offers a fun and challenging environment to test your skills, collaborate, and make new friends.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Join live duels, climb the leaderboards, and explore a vast library of problems. Our real-time system ensures a smooth and engaging experience for everyone.
                </Typography>
            </Container>

            {/* Features Section */}
            <Box sx={{ bgcolor: 'action.hover', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" component="h2" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 6 }}>
                        Features
                    </Typography>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid size={{xs: 12, sm: 6, md: 4}} key={index}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 4,
                                        textAlign: 'center',
                                        height: '100%',
                                        animation: `${fadeIn} 0.5s ease-out ${index * 0.2}s forwards`,
                                        opacity: 0,
                                    }}
                                >
                                    {feature.icon}
                                    <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography color="text.secondary">{feature.description}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;
