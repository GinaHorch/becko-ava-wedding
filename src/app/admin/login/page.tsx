'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '../../utils/auth';
import Image from 'next/image';
import weddingIcon3 from '../../images/wedding-icon-3.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Add sparkles effect
  useEffect(() => {
    // Create sparkle container
    const sparkleContainer = document.createElement('div');
    sparkleContainer.id = 'sparkle-container';
    sparkleContainer.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 1000;';
    document.body.appendChild(sparkleContainer);

    const createSparkle = () => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.position = 'absolute';
      sparkle.style.left = Math.random() * window.innerWidth + 'px';
      sparkle.style.top = Math.random() * window.innerHeight + 'px';
      sparkle.style.pointerEvents = 'none';
      
      sparkleContainer.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkleContainer.contains(sparkle)) {
          sparkleContainer.removeChild(sparkle);
        }
      }, 2500);
    };

    const sparkleInterval = setInterval(createSparkle, 800);
    
    return () => {
      clearInterval(sparkleInterval);
      sparkleContainer.remove();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Invalid email or password');
      } else {
        setError('Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-icon">
          <Image src={weddingIcon3} alt="Wedding Icon" width={80} height={80} />
        </div>
        <h1 className="admin-login-title">
          <span className="sacramento">Becko & Ava</span>
        </h1>
        <p className="admin-login-subtitle">Admin Dashboard</p>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form" suppressHydrationWarning>
          <div className="form-group" suppressHydrationWarning>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" suppressHydrationWarning>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/">← Back to Guestbook</a>
        </div>
      </div>
    </div>
  );
}

