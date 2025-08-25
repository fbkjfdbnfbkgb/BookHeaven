import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'transparent'
        }}>
            <div className="bar" style={{
                width: '60px',
                height: '8px',
                background: 'linear-gradient(90deg, #a770ef 0%, #f6d365 100%)',
                borderRadius: '4px',
                animation: 'barMove 1s infinite alternate'
            }}></div>
            <div className="ball" style={{
                width: '16px',
                height: '16px',
                background: '#f6d365',
                borderRadius: '50%',
                marginLeft: '12px',
                animation: 'ballBounce 1s infinite alternate'
            }}></div>
            <style>
                {`
                @keyframes barMove {
                    0% { transform: scaleX(1);}
                    100% { transform: scaleX(1.3);}
                }
                @keyframes ballBounce {
                    0% { transform: translateY(0);}
                    100% { transform: translateY(-24px);}
                }
                `}
            </style>
        </div>
    );
}

export default Loader;


