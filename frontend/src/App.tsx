import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import RoomPage from './pages/RoomPage';
import FindRoomPage from './pages/FindRoomPage';
import ProtectedRoute from './components/ProtectedRoute';
import { CustomThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <CustomThemeProvider>
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
            </BrowserRouter>
        </CustomThemeProvider>
    );
}

export default App;
