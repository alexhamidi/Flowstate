import React, { useState, useEffect } from 'react';
import axios from 'axios';
import  Timer  from './Timer/Timer';
import  Settings  from './Timer/Settings';
import { useNavigate } from 'react-router-dom';

export default function TimerPage() {
    const [token, setToken] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [scenicMode, setScenicMode] = useState(false);
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
    

 
    // useEffect(() => {
    //     const fetchData = async () => {
    //         axios.get('http://localhost:443/api/image')
    //             .then(response => {
    //             setImageUrl(response.data.imageUrl);
    //             })
    //             .catch(error => {
    //             console.error('Error fetching data: ', error);
    //             });
    //     }; 
    //     fetchData()
    // }, []);

    useEffect(() => {
        let intervalId;

        if (scenicMode) {
            const fetchData = async () => {
                try {
                    const response = await axios.get('http://localhost:443/api/image');
                    setImageUrl(response.data.imageUrl);
                } catch (error) {
                    console.error('Error fetching data: ', error);
                }
            };

            fetchData();

            intervalId = setInterval(fetchData, 10000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId); 
            }
        };
    }, [scenicMode]);
    


    const handleScenicChange = (event) => {
        const becomingScenic = event.target.checked;
        setScenicMode(becomingScenic);
        if (becomingScenic) {
            navigate('/timerscenic');
        } else {
            navigate('/timer');
        }
    };

    return (
        <main id='timerMain' style={scenicMode ? { 
            backgroundImage: `url(${imageUrl})`,
        } : null}>
            <Settings handleScenicChange = {handleScenicChange} scenicMode = {scenicMode}/>
            {authenticated && (
                <div id='timerCenter'>
                    <Timer scenicMode = {scenicMode}/>
                </div>
            )}
        </main>
    );
    
}
