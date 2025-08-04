import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';

interface AuthNavbarProps {
    onLogout: () => void;
}

const AuthNavbar = ({ onLogout }: AuthNavbarProps) => {
    const { mode, toggleTheme } = useThemeContext();
    return (
        <AppBar position='static'>
            <Toolbar>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    Code Duel
                </Typography>
                <Box>
                    <Button color='inherit' component={RouterLink} to='/'>
                        Home
                    </Button>
                    <Button
                        color='inherit'
                        component={RouterLink}
                        to='/dashboard'
                    >
                        Dashboard
                    </Button>
                    <Button
                        color='inherit'
                        component={RouterLink}
                        to='/profile-update'
                    >
                        Profile
                    </Button>
                    <Button color='inherit' onClick={onLogout}>
                        Logout
                    </Button>
                    <IconButton
                        sx={{ ml: 1 }}
                        onClick={toggleTheme}
                        color='inherit'
                    >
                        {mode === 'dark' ? (
                            <Brightness7Icon />
                        ) : (
                            <Brightness4Icon />
                        )}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AuthNavbar;
