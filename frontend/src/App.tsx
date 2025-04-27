import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout'; // Adjust path if needed
import HomePage from './pages/HomePage'; // Adjust path if needed
import LoginPage from './pages/LoginPage'; // Adjust path if needed
import RegisterPage from './pages/RegisterPage'; // Adjust path if needed
import { CustomThemeProvider } from './context/ThemeContext'; // Adjust path if needed
import { Container } from '@mui/material'; // Import Container for layout
// Import other pages as needed

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
                {/* Wrap the application with the Theme Provider */}
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Layout />}>
                            {/* Child routes are rendered inside Layout's Outlet */}
                            <Route index element={<HomePage />} />
                            <Route path='login' element={<LoginPage />} />
                            <Route path='register' element={<RegisterPage />} />
                            {/* Add other routes here */}
                            {/* Example: <Route path="dashboard" element={<DashboardPage />} /> */}
                        </Route>
                        {/* You could add routes outside the main Layout here if needed */}
                    </Routes>
                </BrowserRouter>
            </CustomThemeProvider>
        </Container>
    );
}

export default App;
