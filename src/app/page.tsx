'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import weddingIcon1 from './images/wedding-icon-1.png';
import weddingIcon2 from './images/wedding-icon-2.png';
import blackWhiteSoccerBall from './images/black-white-soccer-ball.png';
import weddingIcon3 from './images/wedding-icon-3.png';

const HeartIcon = ({ color = '#ef471f', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ verticalAlign: 'middle', marginRight: '0.3rem' }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
             2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
             4.5 2.09C13.09 3.81 14.76 3 16.5 3 
             19.58 3 22 5.42 22 8.5c0 3.78-3.4 
             6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function Home() {
  useEffect(() => {
    const numBalls = 2;
    const container = document.querySelector('.landing-container');

    for (let i = 0; i < numBalls; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'ball-wrapper';

      const ball = document.createElement('img');
      ball.src = blackWhiteSoccerBall.src;
      ball.className = 'petal black-white';

      const topPosition = 1.35 + Math.random() * 0.16;
      wrapper.style.setProperty('--random-top', topPosition.toString());

      wrapper.style.width = '50px';
      wrapper.style.height = '50px';
      wrapper.style.animationDuration = `${5 + Math.random() * 5}s`;
      wrapper.style.animationDelay = `${Math.random() * 5}s`;

      wrapper.appendChild(ball);

      if (container) {
        container.appendChild(wrapper);
      }
    }

    return () => {
      const wrappers = document.querySelectorAll('.ball-wrapper');
      wrappers.forEach((w) => w.remove());
    };
  }, [blackWhiteSoccerBall]);

  return (
    <main className="landing-container">
      {/* Top wedding icon */}
      <div className="icon-at-top">
        <Image
          src={weddingIcon3}
          alt="Wedding Icon at Top of Page"
          width={120}
          height={100}
        />
      </div>

      {/* Title */}
      <h1 className="landing-title">
        <span className="sacramento">
          <span className="confetti-text">Becko</span> & <span className="confetti-text">Ava’s</span>
        </span>
        <br />
        Wedding Guestbook <br />
      </h1>

      {/* ✅ Welcome message moved below title */}
      <div
        className="welcome-message"
        style={{
          marginTop: '0rem',
          fontSize: '1.1rem',
          color: '#000',
          textAlign: 'center',
          lineHeight: '1.6',
        }}
      >
        <p>
          Welcome! Join us in celebrating Becko & Ava by leaving your
          <br />
          heartfelt messages and beautiful photos and memorable videos.
        </p>
      </div>

      {/* Navigation */}
      <nav className="landing-navigation">
        <ul>
          <li>
            <a href="/upload">
              <HeartIcon /> Leave a Message
            </a>
          </li>
          <li>
            <a href="/gallery">
              <HeartIcon /> View Guestbook
            </a>
          </li>
        </ul>
      </nav>

      {/* Decorative wedding icon below nav */}
      <div style={{ paddingTop: '1.5rem', textAlign: 'center' }}>
        <Image
          src={weddingIcon2}
          alt="Wedding icon below navigation"
          height={100}
        />
      </div>

      {/* Larger image near the bottom */}
      <div className="landing-description">
        <Image
          src={weddingIcon1}
          alt="Wedding icon below paragraph"
          width={250}
          height={300}
          style={{ paddingTop: '2rem', paddingBottom: '2rem' }}
        />
      </div>
    </main>
  );
}
