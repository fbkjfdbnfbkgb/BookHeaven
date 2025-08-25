import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authActions } from '../store/auth';
import { useDispatch } from 'react-redux';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
const dispatch =useDispatch();
    const handleSubmit = async (e) => {
       e.preventDefault();
       
       
        try {
            const response = await axios.post('http://localhost:3000/api/v1/signin', {
                
                username,
                password,
            
            });
            alert("Signin successful");
            navigate("/profile"); // navigate to home
            dispatch(authActions.login());
            dispatch(authActions.changeRole(response.data.role));
           localStorage.setItem("id",response.data.id);
           localStorage.setItem("role",response.data.role);
              localStorage.setItem("token",response.data.token);
        } catch (error) {
            console.error("Signup failed", error);
            alert("Signin failed");
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
                }}>Login</h2>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '.5rem', fontWeight: 500 }}>Username</label>
                    <input
                        type="username"
                        id="email"
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
                    Login
                </button>
                <div style={{ textAlign: 'center', fontSize: '1rem' }}>
                    <span style={{ color: '#fff' }}>Don't have an account? </span>
                    <Link to="/signup" className="link-premium">Sign Up</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
