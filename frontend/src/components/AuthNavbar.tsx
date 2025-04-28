import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Removed useNavigate
import { useThemeContext } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
import IconButton from '@mui/material/IconButton';

// Define props type to include onLogout
interface AuthNavbarProps {
    onLogout: () => void;
}

// Remove React.FC and type props directly
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
