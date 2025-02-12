import React from 'react';
import { Link } from 'react-router-dom';

const Admindashboard = () => {
  return (
    <div 
      style={{ 
        height: '100vh', 
        width: '100vw',
        backgroundImage: 'url(https://di-uploads-pod14.dealerinspire.com/houseofcarscalgary/uploads/2019/11/people-shaking-hands-in-car-showroom-6NXFKM8.jpg)', 
        backgroundSize: 'cover', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div 
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
          padding: '40px', 
          borderRadius: '8px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
          textAlign: 'center', 
          maxWidth: '500px', 
          width: '100%',
        }}
      >
        <h2>Welcome to Our Car Marketplace</h2>
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            marginTop: '20px' 
          }}
        >
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              width: '100%', 
              maxWidth: '400px' 
            }}
          >
            <Link to="/uploadcar">
              <button 
                style={{ 
                  margin: '10px', 
                  padding: '10px 20px', 
                  fontSize: '16px', 
                  backgroundColor: '#4CAF50', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer',
                  transition: '0.3s',
                }}
              >
                ADD RENTAL CARS
              </button>
            </Link>
          </div>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              width: '100%', 
              maxWidth: '400px',
              marginTop: '10px'
            }}
          >
            <Link to="/adminlogin">
              <button 
                style={{ 
                  margin: '10px', 
                  padding: '10px 20px', 
                  fontSize: '16px', 
                  backgroundColor: '#2196F3', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer',
                  transition: '0.3s',
                }}
              >
                ADD USED CARS
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admindashboard;
