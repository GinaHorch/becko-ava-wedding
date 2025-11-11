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
            <span className="footer-designer">Bianca</span>
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

