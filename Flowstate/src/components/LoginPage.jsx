import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emptyErr, setEmptyErr] = useState(false);
    const [notFoundErr, setNotFoundErr] = useState(false);
    const [wrongPassErr, setWrongPassErr] = useState(false);
    const [genericErr, setGenericErr] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setEmptyErr(true);
        } else {
            setEmptyErr(false);
            setWrongPassErr(false);
            setGenericErr(false);
            setNotFoundErr(false);
            try {
                const response = await fetch('http://localhost:443/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email: email, password: password  }),
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFoundErr(true);
                        console.error('user not found.');
                    } else if (response.status === 401) {
                        setWrongPassErr(true);
                        console.error('password incorrect.');
                    } else {
                        setGenericErr(true);
                        console.error('error occured.');
                    }
                    throw new Error('Login failed');
                }

                const data = await response.json();
                
                localStorage.clear();
                localStorage.setItem('token', data.token); 
                navigate('/'); 
            } catch (error) {
                console.error('Login error:', error);
            }
            setEmail('');
            setPassword('');
        }
    };
    const handleNavigateRegister = async (e) => {
        e.preventDefault();
        navigate('/register');
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };


    return (
        <main id = 'loginMain'>
            <h1> Login </h1>
            <span className = 'navLogReg'> Dont have an account? <button onClick={handleNavigateRegister} id = 'registerNavigate'> Register</button> </span>
            {notFoundErr && <div className='error'> User Not Found. Please Try Again. </div>}
            {wrongPassErr && <div className='error'> Incorrect Password. </div>}
            {genericErr && <div className='error'> Error Occured </div>}
            {emptyErr && <div className='error'> Please Fill in All Fields  </div>}
            <input type = 'text' value = {email} onChange={(e) => setEmail(e.target.value)} className="emailField" placeholder='Enter Email ' onKeyDown={handleKeyDown} />
            <input type = 'password' value = {password} onChange={(e) => setPassword(e.target.value)} className="passwordField" placeholder='Enter Password' onKeyDown={handleKeyDown} />
            <button onClick={handleSubmit} className = 'submitButton' > Submit </button>
            
        </main>
    );
}








