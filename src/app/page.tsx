'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import weddingIcon1 from './images/wedding-icon-1.png';
import weddingIcon2 from './images/wedding-icon-2.png';
import weddingIcon3 from './images/wedding-icon-3.png';
import weddingIcon7 from './images/wedding-icon-7.png';
import weddingIcon8 from './images/wedding-icon-8.png';
import blackWhiteSoccerBall from './images/black-white-soccer-ball.png';
import Footer from './components/Footer';
import InstallPrompt from './components/InstallPrompt';

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

interface BallWrapperElement extends HTMLElement {
  _trailInterval?: NodeJS.Timeout;
}

export default function Home() {
  useEffect(() => {
    const numBalls = 2;
    const container = document.querySelector('.landing-container') as HTMLElement;
    if (!container) return;

    const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
    const ballWrappers: BallWrapperElement[] = [];

    // Get 2nd polaroid position to dynamically calculate max drop
    const secondPolaroid = document.querySelector('.icon-below-wedding1') as HTMLElement;
    const maxDropY = secondPolaroid
      ? secondPolaroid.getBoundingClientRect().bottom + 20 // 20px below the polaroid
      : window.innerHeight - 50; // fallback

    for (let i = 0; i < numBalls; i++) {
      const wrapper = document.createElement('div') as BallWrapperElement;
      wrapper.className = 'ball-wrapper';

      const ball = document.createElement('img');
      ball.src = blackWhiteSoccerBall.src;
      ball.className = 'petal black-white';
      ball.alt = 'Soccer ball decoration';

      // Random starting position (percentage of viewport height)
      let topPosition = i === 0 ? 0.85 + Math.random() * 0.05 : 0.95 + Math.random() * 0.05;

      // Downward progression logic
      const baseTop = topPosition;
      const dropAmount = 40;

      // Apply starting top position
      wrapper.style.top = baseTop * window.innerHeight + 'px';

      // Move ball down each animation iteration
      wrapper.addEventListener('animationiteration', () => {
        const currentY = parseFloat(wrapper.style.top);
        let newY = currentY + dropAmount;

        if (newY >= maxDropY) {
          newY = baseTop * window.innerHeight;
        }

        wrapper.style.top = newY + 'px';
      });

      wrapper.style.width = '50px';
      wrapper.style.height = '50px';
      wrapper.style.animationDuration = `${5 + Math.random() * 5}s`;
      wrapper.style.animationDelay = `${Math.random() * 5}s`;
      wrapper.style.zIndex = '10000';

      wrapper.appendChild(ball);
      container.appendChild(wrapper);
      ballWrappers.push(wrapper);

      // Color trail logic
      const trailInterval = setInterval(() => {
        const rect = wrapper.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const trailLeft = rect.left - containerRect.left + rect.width / 2 - 6;
        const trailTops = [
          rect.top - containerRect.top + rect.height / 2 + 4,
          rect.top - containerRect.top + rect.height / 2 + 12
        ];

        trailTops.forEach((trailTop) => {
          const trail = document.createElement('div');
          trail.className = 'color-trail';
          trail.style.position = 'absolute';
          trail.style.left = `${trailLeft}px`;
          trail.style.top = `${trailTop}px`;
          trail.style.fontSize = '16px';
          trail.style.opacity = '0.8';
          trail.style.pointerEvents = 'none';
          trail.style.userSelect = 'none';
          trail.style.zIndex = '999';

          const randomColor = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
          trail.style.color = randomColor;
          trail.style.textShadow = `
            0 0 4px ${randomColor},
            0 0 8px ${randomColor},
            0 0 12px ${randomColor}
          `;
          trail.textContent = '✨';

          container.appendChild(trail);

          trail.animate(
            [
              { opacity: 0.8, transform: 'translateY(0)' },
              { opacity: 0, transform: 'translateY(-10px)' }
            ],
            { duration: 1000, easing: 'ease-out', fill: 'forwards' }
          );

          setTimeout(() => trail.remove(), 1000);
        });
      }, 80);

      wrapper._trailInterval = trailInterval;
    }

    return () => {
      ballWrappers.forEach((wrapper) => {
        if (wrapper._trailInterval) clearInterval(wrapper._trailInterval);
        wrapper.remove();
      });
      document.querySelectorAll('.color-trail').forEach((t) => t.remove());
    };
  }, []);

  return (
    <main className="landing-container">
      <div className="icon-at-top">
        <Image src={weddingIcon3} alt="Wedding Icon at Top of Page" />
      </div>

      <h1 className="landing-title">
        <span className="sacramento">
          <span className="confetti-text">Becko</span> & <span className="confetti-text">Ava’s</span>
        </span>
        <br />
        Wedding Guestbook <br />
      </h1>

      <div className="welcome-message">
        <p>
          Welcome! Join us in celebrating <strong>Becko & Ava</strong> by leaving your
          <br />
          heartfelt messages, beautiful photos and memorable videos.
        </p>
      </div>

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

      <div className="polaroid icon-below-nav">
        <Image src={weddingIcon2} alt="Wedding icon below navigation" height={350} />
      </div>

      <div className="landing-description">
        <Image
          src={weddingIcon1}
          alt="Wedding icon below paragraph"
          width={250}
          height={300}
        />
      </div>

      <div className="polaroid icon-below-wedding1">
        <Image
          src={weddingIcon7}
          alt="Wedding Icon 7"
          height={350}
        />
      </div>

      <div className="icon-at-bottom">
      <Image
        src={weddingIcon8}
        alt="Wedding Icon 8"
        height={40}
      />
      </div>

      <Footer />
      <InstallPrompt />
    </main>
  );
}
