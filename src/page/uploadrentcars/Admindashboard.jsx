import React from 'react';
import { Link } from 'react-router-dom';
import Navadmindashboard from '../Nav/Navadmindashboard';

const Admindashboard = () => {
  return (
    <div 
      style={{ 
        height: '100vh', 
        width: '100vw',
        backgroundImage: 'url(https://cdn.www.nation.com/nation/wp-content/uploads/2018/03/10-Ways-to-Know-Its-Time-to-Trade-in-Your-Car.jpg)', 
        backgroundSize: 'cover', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navadmindashboard/>
      
          </div>
  );
};

export default Admindashboard;
