'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import weddingIcon1 from './images/wedding-icon-1.png';
import weddingIcon2 from './images/wedding-icon-2.png';
import soccerBallImage from './images/rainbow-soccer-ball.png';
import blackWhiteSoccerBall from './images/black-white-soccer-ball.png';

const HeartIcon = ({ color = '#ef471f', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ verticalAlign: 'middle', marginRight: '0.25rem' }}
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
    const numBalls = 7;
    const container = document.body;

    for (let i = 0; i < numBalls; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'ball-wrapper';

      const ball = document.createElement('img');
      const isRainbow = Math.random() < 0.5;

      ball.src = isRainbow ? soccerBallImage.src : blackWhiteSoccerBall.src;
      ball.className = 'petal';

      const topPosition = Math.random() * 0.9;
      wrapper.style.setProperty('--random-top', topPosition.toString());

      if (isRainbow) {
        wrapper.style.width = '107px'; // Rainbow balls slightly larger
        wrapper.style.height = '107px';
        ball.classList.add('rainbow');
      } else {
        wrapper.style.width = '65px';  // Black and white balls slightly smaller
        wrapper.style.height = '65px';
        ball.classList.add('black-white');
      }

      wrapper.style.animationDuration = `${5 + Math.random() * 5}s`;
      wrapper.style.animationDelay = `${Math.random() * 5}s`;

      wrapper.appendChild(ball);
      container.appendChild(wrapper);
    }

    return () => {
      const wrappers = document.querySelectorAll('.ball-wrapper');
      wrappers.forEach(w => w.remove());
    };
  }, []);

  return (
    <main className="landing-container">
      <h1 className="landing-title">
        <span className="sacramento">Becko & Ava’s</span><br />
        Wedding Guestbook
      </h1>

      <nav className="landing-navigation">
        <ul>
          <li>
            <a href="/upload">
              <HeartIcon /> Leave a message
            </a>
          </li>
          <li>
            <a href="/gallery">
              <HeartIcon /> View guestbook
            </a>
          </li>
        </ul>
      </nav>

      <div style={{ paddingTop: '1.5rem', textAlign: 'center' }}>
        <Image
          src={weddingIcon2}
          alt="Wedding icon below navigation"
          height={100} // Only height set, width adjusts automatically
        />
      </div>

      <div className="landing-description">
        <p>
          ⚽ Welcome! Join us in celebrating Becko & Ava by leaving your heartfelt messages and beautiful photos ⚽
        </p>

        <Image
          src={weddingIcon1}
          alt="Wedding icon below paragraph"
          width={250}
          height={300}
          style={{ paddingTop: '2rem' }}
        />
      </div>
    </main>
  );
}
