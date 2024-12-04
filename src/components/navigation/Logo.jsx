import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="text-2xl font-bold gold-gradient hover:scale-105 transition-transform"
    >
      iamfuk.
    </Link>
  );
};

export default Logo;