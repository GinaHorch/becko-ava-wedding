'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import MessageList from '../../components/admin/MessageList';
import Analytics from '../../components/admin/Analytics';
import { signOut } from '../../utils/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import blackWhiteSoccerBall from '../../images/black-white-soccer-ball.png';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'messages' | 'analytics'>('messages');
  const router = useRouter();

  // Add soccer ball animation - multiple balls like the main page
  useEffect(() => {
    const numBalls = 3; // More soccer balls for the header
    const container = document.querySelector('.admin-dashboard') as HTMLElement;
    if (!container) return;

    const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
    
    interface BallWrapperElement extends HTMLElement {
      _trailInterval?: NodeJS.Timeout;
    }
    
    const ballWrappers: BallWrapperElement[] = [];

    for (let i = 0; i < numBalls; i++) {
      const wrapper = document.createElement('div') as BallWrapperElement;
      wrapper.className = 'admin-ball-wrapper';
      
      // Vary the vertical position and animation
      const topPosition = 10 + (i * 30) + Math.random() * 10; // Spread them out vertically
      const duration = 8 + Math.random() * 4;
      const delay = i * 3; // Stagger the start times
      
      wrapper.style.cssText = `
        position: fixed;
        left: -80px;
        top: ${topPosition}%;
        width: 50px;
        height: 50px;
        animation: adminBounceRight ${duration}s linear infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
        z-index: 100;
      `;

      const ball = document.createElement('img');
      ball.src = blackWhiteSoccerBall.src;
      ball.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      `;
      ball.alt = 'Soccer ball decoration';

      wrapper.appendChild(ball);
      container.appendChild(wrapper);
      ballWrappers.push(wrapper);

      // Create sparkle trail for each ball
      const trailInterval = setInterval(() => {
        const rect = wrapper.getBoundingClientRect();
        
        // Create multiple sparkles around the ball
        for (let j = 0; j < 2; j++) {
          const trail = document.createElement('div');
          trail.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2 + (Math.random() - 0.5) * 20}px;
            top: ${rect.top + rect.height / 2 + (Math.random() - 0.5) * 20}px;
            font-size: 18px;
            opacity: 0.8;
            pointer-events: none;
            z-index: 99;
          `;
          
          const randomColor = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
          trail.style.color = randomColor;
          trail.style.textShadow = `
            0 0 4px ${randomColor},
            0 0 8px ${randomColor},
            0 0 12px ${randomColor}
          `;
          trail.textContent = '✨';

          document.body.appendChild(trail);

          trail.animate([
            { opacity: 0.8, transform: 'translateY(0) scale(1)' },
            { opacity: 0, transform: 'translateY(-15px) scale(0.5)' }
          ], {
            duration: 1000,
            easing: 'ease-out'
          });

          setTimeout(() => trail.remove(), 1000);
        }
      }, 80);

      wrapper._trailInterval = trailInterval;
    }

    return () => {
      ballWrappers.forEach((wrapper) => {
        if (wrapper._trailInterval) {
          clearInterval(wrapper._trailInterval);
        }
        wrapper.remove();
      });
      const oldTrails = document.querySelectorAll('.color-trail');
      oldTrails.forEach((t) => t.remove());
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="admin-header-content">
            <h1>
              <span className="sacramento">Becko & Ava</span>
            </h1>
            <p>Guestbook Dashboard ✨</p>
          </div>
          <button onClick={handleSignOut} className="admin-logout-button">
            Logout
          </button>
        </header>

        <nav className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button
            className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </nav>

        <main className="admin-content">
          {activeTab === 'messages' && <MessageList />}
          {activeTab === 'analytics' && <Analytics />}
        </main>
      </div>
    </ProtectedRoute>
  );
}

