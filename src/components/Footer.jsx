import React from 'react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner footer-inner--slim">
        <span className="footer-logo-slim">Automation &amp; Business Intelligence</span>
        <span className="footer-copy">
          &copy; {year} ABI Department &mdash; All systems operational
        </span>
      </div>
    </footer>
  );
};

export default Footer;
