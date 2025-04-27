import React from 'react';
import { Typography, Container } from '@mui/material';

const HomePage: React.FC = () => {
    return (
        <Container>
            <Typography variant='h4' component='h1' gutterBottom>
                Welcome to Code Duel!
            </Typography>
            <Typography variant='body1'>
                This is the home page. Navigate using the links above.
            </Typography>
        </Container>
    );
};

export default HomePage;
