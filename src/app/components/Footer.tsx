'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>© {new Date().getFullYear()} Becko & Ava</p>
        </div>
        
        <div className="footer-center">
          <p>
            Designed with <span className="footer-heart">♥</span> by{' '}
            <a 
              href="https://www.linkedin.com/in/bianca-di-biase-aa2509321" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-designer-link"
            >
              <span className="footer-designer">Bianca Di Biase</span>, Web Designer
            </a>
          </p>
        </div>
        
        <div className="footer-right">
          <a href="/admin/login" className="admin-link">
            <span className="lock-icon">🔒</span> Admin
          </a>
        </div>
      </div>
    </footer>
  );
}

