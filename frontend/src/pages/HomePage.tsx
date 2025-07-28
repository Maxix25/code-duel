import React, { useRef, useEffect, useState } from 'react';
// Custom hook for scroll-based animation
function useScrollReveal(threshold = 0.2) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold]);
    return [ref, visible] as const;
}
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme, alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';

const HomePage: React.FC = () => {
    const theme = useTheme();
    const features = [
        {
            icon: <GroupIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Live Duels',
            description:
                'Challenge your friends or other developers to real-time coding battles.'
        },
        {
            icon: (
                <EmojiEventsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            ),
            title: 'Climb the Leaderboards',
            description:
                'Earn points for every win and see how you rank against the best.'
        },
        {
            icon: <CodeIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Vast Problem Library',
            description:
                'Practice with a wide range of problems from various difficulty levels.'
        }
    ];

    // Animation hooks for each section
    const [heroRef, heroVisible] = useScrollReveal();
    const [aboutRef, aboutVisible] = useScrollReveal();
    const [featuresRef, featuresVisible] = useScrollReveal();
    const [ctaRef, ctaVisible] = useScrollReveal();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.light,
                    0.08
                )} 0%, ${alpha(theme.palette.secondary.light, 0.08)} 100%)`
            }}
        >
            {/* Hero Section */}

            <Container
                maxWidth='md'
                sx={{ textAlign: 'center', py: { xs: 10, md: 16 } }}
                ref={heroRef}
            >
                <Stack
                    spacing={3}
                    alignItems='center'
                    sx={{
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? 'none' : 'translateY(40px)',
                        transition: 'all 0.8s cubic-bezier(.4,1.3,.6,1) 0.1s'
                    }}
                >
                    <Typography
                        variant='h2'
                        component='h1'
                        fontWeight='bold'
                        sx={{
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}
                    >
                        Welcome to Code Duel
                    </Typography>
                    <Typography
                        variant='h5'
                        color='text.secondary'
                        paragraph
                        sx={{ maxWidth: 600 }}
                    >
                        The ultimate platform for competitive programming.
                        Sharpen your skills, challenge your peers, and climb to
                        the top.
                    </Typography>
                    <Button
                        variant='contained'
                        color='primary'
                        size='large'
                        sx={{
                            px: 5,
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: 18,
                            borderRadius: 3
                        }}
                    >
                        Get Started
                    </Button>
                </Stack>
            </Container>

            {/* About Section */}
            <Container
                maxWidth='md'
                sx={{ py: { xs: 4, md: 8 }, textAlign: 'center' }}
                ref={aboutRef}
            >
                <Card
                    elevation={0}
                    sx={{
                        bgcolor: 'background.paper',
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        boxShadow: 2,
                        opacity: aboutVisible ? 1 : 0,
                        transform: aboutVisible ? 'none' : 'translateY(40px)',
                        transition: 'all 0.8s cubic-bezier(.4,1.3,.6,1) 0.2s'
                    }}
                >
                    <CardHeader
                        title={
                            <Typography variant='h4' fontWeight='bold'>
                                Why Code Duel?
                            </Typography>
                        }
                        sx={{ pb: 0 }}
                    />
                    <CardContent>
                        <Typography
                            variant='body1'
                            color='text.secondary'
                            sx={{ mb: 2 }}
                        >
                            Code Duel is designed for programmers of all levels
                            to compete, learn, and grow. Whether you're a
                            beginner or a seasoned coder, our platform offers a
                            fun and challenging environment to test your skills,
                            collaborate, and make new friends.
                        </Typography>
                        <Typography variant='body1' color='text.secondary'>
                            Join live duels, climb the leaderboards, and explore
                            a vast library of problems. Our real-time system
                            ensures a smooth and engaging experience for
                            everyone.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>

            {/* Features Section */}
            <Container
                maxWidth='lg'
                sx={{ py: { xs: 8, md: 12 } }}
                ref={featuresRef}
            >
                <Typography
                    variant='h4'
                    component='h2'
                    fontWeight='bold'
                    textAlign='center'
                    gutterBottom
                    sx={{
                        mb: 6,
                        opacity: featuresVisible ? 1 : 0,
                        transform: featuresVisible
                            ? 'none'
                            : 'translateY(40px)',
                        transition: 'all 0.8s cubic-bezier(.4,1.3,.6,1) 0.3s'
                    }}
                >
                    Features
                </Typography>
                <Grid container spacing={5} justifyContent='center'>
                    {features.map((feature, index) => {
                        const [cardRef, cardVisible] = useScrollReveal(0.15);
                        return (
                            <Grid
                                size={{ xs: 12, sm: 6, md: 4 }}
                                key={index}
                                ref={cardRef}
                            >
                                <Card
                                    elevation={4}
                                    sx={{
                                        height: '100%',
                                        borderRadius: 4,
                                        transition:
                                            'transform 0.4s, box-shadow 0.4s, opacity 0.8s cubic-bezier(.4,1.3,.6,1)',
                                        '&:hover': {
                                            transform:
                                                'translateY(-8px) scale(1.03)',
                                            boxShadow: 8
                                        },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 3,
                                        bgcolor: 'background.paper',
                                        opacity: cardVisible ? 1 : 0,
                                        transform: cardVisible
                                            ? 'none'
                                            : 'translateY(40px)'
                                    }}
                                >
                                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                    <Typography
                                        variant='h6'
                                        component='h3'
                                        fontWeight='bold'
                                        sx={{ mb: 1 }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        color='text.secondary'
                                        sx={{ flexGrow: 1 }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>

            {/* Divider */}
            <Divider
                sx={{
                    my: { xs: 6, md: 10 },
                    mx: 'auto',
                    width: '60%',
                    opacity: ctaVisible ? 1 : 0,
                    transform: ctaVisible ? 'none' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(.4,1.3,.6,1) 0.4s'
                }}
            />

            {/* Call to Action Section */}
            <Container
                maxWidth='md'
                sx={{ textAlign: 'center', pb: { xs: 8, md: 12 } }}
                ref={ctaRef}
            >
                <Card
                    elevation={3}
                    sx={{
                        borderRadius: 4,
                        p: { xs: 3, md: 5 },
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        boxShadow: 6,
                        opacity: ctaVisible ? 1 : 0,
                        transform: ctaVisible ? 'none' : 'translateY(40px)',
                        transition: 'all 0.8s cubic-bezier(.4,1.3,.6,1) 0.5s'
                    }}
                >
                    <Stack spacing={2} alignItems='center'>
                        <Typography variant='h5' fontWeight='bold'>
                            Ready to start your coding journey?
                        </Typography>
                        <Typography variant='body1' sx={{ opacity: 0.9 }}>
                            Sign up now and join a vibrant community of
                            developers. Compete, learn, and grow with Code Duel!
                        </Typography>
                        <Button
                            variant='contained'
                            color='secondary'
                            size='large'
                            sx={{
                                px: 5,
                                py: 1.5,
                                fontWeight: 600,
                                fontSize: 18,
                                borderRadius: 3,
                                boxShadow: 2
                            }}
                        >
                            Join Now
                        </Button>
                    </Stack>
                </Card>
            </Container>
        </Box>
    );
};

export default HomePage;
