import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CalendarPage from "./components/CalendarPage";
import TimerPage from "./components/TimerPage"
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const hideNavbarPaths = ['/login', '/register', '/timerscenic'];
    const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

    return (
        <div className='page'>
            {shouldShowNavbar && (
                <>
                    <nav>
                        <Navbar/>
                    </nav>
                    <hr/>
                </>
            )}
            <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage />} />
                <Route exact path="/" element={<HomePage/>} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/timer" element={<TimerPage/>} />
                <Route path="/timerscenic" element={<TimerPage/>} />
            </Routes>
        </div>
    );
}

