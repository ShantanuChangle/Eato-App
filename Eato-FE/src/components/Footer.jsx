import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div style={{ height: '50vh', width: '100%', borderTop: '0.1vh solid white' }}>
      <div style={{ height: '20%', width: '100%', position: 'relative' }}>
        <span style={{ position: 'absolute', top: '40%', left: '12%', fontSize: '6vh', fontWeight: '800' }}>
          Eato
        </span>
      </div>

      <div style={{ display: 'flex', height: '80%', width: '100%' }}>
        <div
          style={{
            height: '90%',
            width: '90%',
            display: 'flex',
            marginLeft: '4.5rem',
            marginTop: '1rem',
            justifyContent: 'space-around',
            paddingTop: '0.4rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p>ABOUT EATO</p>
            <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>Who We Are</Link>
            <Link to="/blog" style={{ color: 'white', textDecoration: 'none' }}>Blog</Link>
            <Link to="/careers" style={{ color: 'white', textDecoration: 'none' }}>Work With Us</Link>
            <Link to="/investors" style={{ color: 'white', textDecoration: 'none' }}>Investor Relations</Link>
            <Link to="/report-fraud" style={{ color: 'white', textDecoration: 'none' }}>Report Fraud</Link>
            <Link to="/press" style={{ color: 'white', textDecoration: 'none' }}>Press Kit</Link>
            <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact Us</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p>EATOVERSE</p>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Eato</Link>
            <Link to="/blinkit" style={{ color: 'white', textDecoration: 'none' }}>Blinkit</Link>
            <Link to="/district" style={{ color: 'white', textDecoration: 'none' }}>District</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p>FOR RESTAURANTS</p>
            <Link to="/partner" style={{ color: 'white', textDecoration: 'none' }}>Partner With Us</Link>
            <Link to="/apps" style={{ color: 'white', textDecoration: 'none' }}>Apps for you</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p>LEARN MORE</p>
            <Link to="/privacy" style={{ color: 'white', textDecoration: 'none' }}>Privacy</Link>
            <Link to="/security" style={{ color: 'white', textDecoration: 'none' }}>Security</Link>
            <Link to="/terms" style={{ color: 'white', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;