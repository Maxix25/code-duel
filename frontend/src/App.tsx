import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { CustomThemeProvider } from './context/ThemeContext';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Suspense, lazy } from 'react';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const RoomPage = lazy(() => import('./pages/RoomPage'));
const FindRoomPage = lazy(() => import('./pages/FindRoomPage'));

const Loader = () => {
    return (
        <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            height='100vh'
        >
            <CircularProgress />
        </Box>
    );
};
function App() {
    return (
        <CustomThemeProvider>
            <BrowserRouter>
                <Suspense fallback={<Loader />}>
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
                                        <RoomPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path='results'
                                element={
                                    <ProtectedRoute>
                                        <ResultsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path='find-room'
                                element={
                                    <ProtectedRoute>
                                        <FindRoomPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </CustomThemeProvider>
    );
}

export default App;
