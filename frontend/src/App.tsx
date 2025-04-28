import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { CustomThemeProvider } from './context/ThemeContext';
import { Container } from '@mui/material';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import CssBaseline from '@mui/material/CssBaseline';
import Room from './pages/Room';

function App() {
    return (
        <Container
            sx={{
                alignContent: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CustomThemeProvider>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route path='login' element={<LoginPage />} />
                            <Route path='register' element={<RegisterPage />} />
                            <Route
                                path='dashboard'
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path='room'
                                element={
                                    <ProtectedRoute>
                                        <Room />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CustomThemeProvider>
        </Container>
    );
}

export default App;
