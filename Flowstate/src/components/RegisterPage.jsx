import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [genericErr, setGenericErr] = useState(false);
    const [emptyErr, setEmptyErr] = useState(false);
    const [emailUsedErr, setEmailUsedErr] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !email) {
            setEmptyErr(true);
        } else {
            setEmptyErr(false);
            setGenericErr(false);
            setEmailUsedErr(false);
            try {
                const response = await fetch('http://localhost:443/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email, password: password }),
                });

                if (!response.ok) {
                    if (response.status===400) {
                        setEmailUsedErr(true);
                        console.error('Email in use.');
                    } else {
                        setGenericErr(true);
                        console.error('Error occured');
                    }
                    throw new Error('Register failed');
                }

                const data = await response.json();
                localStorage.clear();
                localStorage.setItem('token', data.token); 

                navigate('/'); 

            } catch (error) {
                console.error('Register error:', error);
            }

            setEmail('');
            setPassword('');
        }
    };

    const handleNavigateLogin = async (e) => {
        e.preventDefault();
        navigate('/login');
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <main id = 'registerMain'>
            <h1> Register </h1>
            <span className='navLogReg'> Already have an account? <button onClick={handleNavigateLogin} id = 'loginNavigate'> Login</button></span>
            {genericErr && <div className='error'> Error Occured </div>}
            {emailUsedErr && <div className='error'> Email Already in Use. </div>}
            {emptyErr && <div className='error'> Please Fill in All Fields  </div>}
            <input type = 'text' value = {email} onChange={(e) => setEmail(e.target.value)} className="emailField" placeholder='Enter Email' onKeyDown={handleKeyDown} />
            <input type = 'password' value = {password} onChange={(e) => setPassword(e.target.value)} className="passwordField" placeholder='Enter Password' onKeyDown={handleKeyDown} />
            <button onClick={handleSubmit} className = 'submitButton' > Submit </button>
        </main>
    );
}
