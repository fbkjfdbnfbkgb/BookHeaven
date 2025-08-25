import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!username || username.length < 3) {
            newErrors.username = "Username must be at least 3 characters.";
        }
        if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = "Enter a valid email address.";
        }
        if (!password || password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }
        if (!address) {
            newErrors.address = "Address is required.";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/v1/signup', {
                username,
                email,
                password,
                address
            });
            alert("Signup successful");
            navigate("/login");
        } catch (error) {
            console.error("Signup failed", error);
            alert("Signup failed");
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', // zinc-900/800
            transition: 'background 0.5s'
        }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    backdropFilter: 'blur(16px) saturate(180%)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    padding: '2.5rem 2rem',
                    minWidth: '340px',
                    animation: 'fadeIn 1s',
                    color: '#fff',
                    position: 'relative'
                }}
            >
                <style>
                    {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(30px);}
                        to { opacity: 1; transform: translateY(0);}
                    }
                    .input-premium:focus {
                        border-color: #a770ef;
                        box-shadow: 0 0 0 2px #a770ef44;
                        outline: none;
                    }
                    .btn-premium {
                        background: linear-gradient(90deg, #a770ef 0%, #f6d365 100%);
                        color: #fff;
                        transition: transform 0.2s, box-shadow 0.2s;
                        box-shadow: 0 2px 8px rgba(167,112,239,0.15);
                    }
                    .btn-premium:hover {
                        transform: translateY(-2px) scale(1.03);
                        box-shadow: 0 4px 16px rgba(246,211,101,0.25);
                        background: linear-gradient(90deg, #f6d365 0%, #a770ef 100%);
                    }
                    .link-premium {
                        color: #f6d365;
                        text-decoration: none;
                        font-weight: bold;
                        transition: color 0.2s;
                    }
                    .link-premium:hover {
                        color: #a770ef;
                        text-decoration: underline;
                    }
                    `}
                </style>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    fontSize: '2rem',
                    background: 'linear-gradient(90deg, #a770ef 0%, #f6d365 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>Sign Up</h2>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '.5rem', fontWeight: 500 }}>Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="input-premium"
                        style={{
                            width: '100%',
                            padding: '.75rem',
                            borderRadius: '8px',
                            border: '1.5px solid #928dab',
                            background: 'rgba(255,255,255,0.25)',
                            color: '#333',
                            fontSize: '1rem',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                        }}
                    />
                    {errors.username && (
                        <div style={{ color: '#ff6b6b', marginTop: '.5rem', fontSize: '.95rem' }}>
                            {errors.username}
                        </div>
                    )}
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '.5rem', fontWeight: 500 }}>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="input-premium"
                        style={{
                            width: '100%',
                            padding: '.75rem',
                            borderRadius: '8px',
                            border: '1.5px solid #928dab',
                            background: 'rgba(255,255,255,0.25)',
                            color: '#333',
                            fontSize: '1rem',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                        }}
                    />
                    {errors.email && (
                        <div style={{ color: '#ff6b6b', marginTop: '.5rem', fontSize: '.95rem' }}>
                            {errors.email}
                        </div>
                    )}
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '.5rem', fontWeight: 500 }}>Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="input-premium"
                        style={{
                            width: '100%',
                            padding: '.75rem',
                            borderRadius: '8px',
                            border: '1.5px solid #928dab',
                            background: 'rgba(255,255,255,0.25)',
                            color: '#333',
                            fontSize: '1rem',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                        }}
                    />
                    {errors.password && (
                        <div style={{ color: '#ff6b6b', marginTop: '.5rem', fontSize: '.95rem' }}>
                            {errors.password}
                        </div>
                    )}
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="address" style={{ display: 'block', marginBottom: '.5rem', fontWeight: 500 }}>Address</label>
                    <input
                        type="address"
                        id="address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                        className="input-premium"
                        style={{
                            width: '100%',
                            padding: '.75rem',
                            borderRadius: '8px',
                            border: '1.5px solid #928dab',
                            background: 'rgba(255,255,255,0.25)',
                            color: '#333',
                            fontSize: '1rem',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                        }}
                    />
                    {errors.address && (
                        <div style={{ color: '#ff6b6b', marginTop: '.5rem', fontSize: '.95rem' }}>
                            {errors.address}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="btn-premium"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        marginBottom: '1rem'
                    }}
                >
                    Sign Up
                </button>
                <div style={{ textAlign: 'center', fontSize: '1rem' }}>
                    <span style={{ color: '#fff' }}>Already have an account? </span>
                    <Link to="/login" className="link-premium">Login</Link>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
