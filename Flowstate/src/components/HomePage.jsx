import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:443/api/todos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(response => response.data)
            .then(data => setTodos(data))
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    console.error('Error:', error);
                }
            });
        }
    }, [token, navigate]);

    return (
        <main id='homeMain'>
            {authenticated ? (
                <>
                    <h1>Welcome to Flowstate.</h1>
                    <h2>Click an icon to get started</h2>
                </>
            ) : (
                <div>Loading...</div> // Optional: Add a loading state if needed
            )}
        </main>
    );
}

