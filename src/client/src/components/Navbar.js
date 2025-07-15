import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import blazeTradeLogo from '../assets/blazetrade-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary-dark shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={blazeTradeLogo} alt="BlazeTrade Logo" className="h-8 object-contain" />
          <span className="text-xl font-bold text-white">BlazeTrade</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Home" />
          <NavLink to="/about" label="About" />
          <NavLink to="/services" label="Services" />
          <NavLink to="/contact" label="Contact" />
          {token && (
            <button onClick={handleLogout} className="text-white hover:text-accent relative group">
              Logout
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden bg-primary-dark"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container-custom py-4 flex flex-col space-y-4">
            <MobileNavLink to="/" label="Home" onClick={toggleMenu} />
            <MobileNavLink to="/about" label="About" onClick={toggleMenu} />
            <MobileNavLink to="/services" label="Services" onClick={toggleMenu} />
            <MobileNavLink to="/contact" label="Contact" onClick={toggleMenu} />
            {token && (
              <button 
                onClick={() => { handleLogout(); toggleMenu(); }} 
                className="text-white hover:text-accent py-2 block text-left w-full"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`relative group hover:text-accent ${isActive ? 'nav-link-active' : 'text-white'}`}
    >
      {label}
      <span className={`absolute left-0 right-0 bottom-0 h-0.5 bg-accent transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
    </Link>
  );
};

const MobileNavLink = ({ to, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`py-2 block hover:text-accent ${isActive ? 'nav-link-active' : 'text-white'}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Navbar;