import React from 'react';
import { Link } from 'react-router-dom';
import { FaTelegram, FaPhone, FaMapMarkerAlt, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import blazeTradeLogo from '../assets/blazetrade-logo.png';
import qrCodeImage from '../assets/images/qr-code.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={blazeTradeLogo} alt="BlazeTrade Logo" className="w-6 h-6 rounded" />
              <span className="text-xl font-bold">BlazeTrade</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted partner for Bitcoin exchange and trading services. We provide secure, reliable, and professional cryptocurrency solutions.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<FaInstagram />} href="https://instagram.com/blaze__trade?igsh=M3Y4cmhoNXRO" />
              <SocialIcon icon={<FaWhatsapp />} href="https://wa.me/+2348163309355" />
              <SocialIcon icon={<FaTelegram />} href="https://t.me/blazetrad" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/services" label="Our Services" />
              <FooterLink to="/contact" label="Contact Us" />
              <FooterLink to="/privacy-policy" label="Privacy Policy" />
              <FooterLink to="/terms-of-service" label="Terms of Service" />
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <FooterLink to="/services#bitcoin-exchange" label="Bitcoin Exchange" />
              <FooterLink to="/services#crypto-trading" label="Crypto Trading" />
              <FooterLink to="/services#market-analysis" label="Market Analysis" />
              <FooterLink to="/services#security-solutions" label="Security Solutions" />
              <FooterLink to="/services#consulting" label="Consulting Services" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              
              <li className="flex items-start space-x-3">
                <FaPhone className="text-accent mt-1 flex-shrink-0" />
                <span>+234 8163309355</span>
              </li>
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-accent mt-1 flex-shrink-0" />
                <span>Victoria island, Lagos, Nigeria, 101241.</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Scan to Chat</h4>
              <img src={qrCodeImage} alt="QR Code for WhatsApp" className="w-24 h-24 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} BlazeTrade. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-white mr-4">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm text-gray-400 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-accent transition-colors duration-300"
    >
      {icon}
    </a>
  );
};

const FooterLink = ({ to, label }) => {
  return (
    <li>
      <Link 
        to={to} 
        className="text-gray-300 hover:text-white transition-colors duration-300"
      >
        {label}
      </Link>
    </li>
  );
};

export default Footer;