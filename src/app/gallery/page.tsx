'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GallerySwiper from '../components/GallerySwiper';
import weddingIcon6 from '../images/wedding-icon-6.png';
import Footer from '../components/Footer';
import InstallPrompt from '../components/InstallPrompt';

// Heart icon component for navigation
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

export default function Gallery() {
  useEffect(() => {
    const rainbowWrapper = document.querySelector('.rainbow-wrapper');
    if (!rainbowWrapper) return;

    // ✨ Add sparkles over the rainbow area
    const sparkleTimeout = setTimeout(() => {
      for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${30 + Math.random() * 40}%`;
        sparkle.style.top = `${20 + Math.random() * 40}%`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        sparkle.style.position = 'absolute'; // Make sure it's positioned within rainbow-wrapper
        rainbowWrapper.appendChild(sparkle);
      }
    }, 5200);

    return () => {
      document.querySelectorAll('.sparkle').forEach((s) => s.remove());
      clearTimeout(sparkleTimeout);
    };
  }, []);

  return (
    <div className="gallery-container">
      {/* Navigation */}
      <nav className="page-navigation">
        <ul>
          <li>
            <Link href="/">
              <HeartIcon /> Home
            </Link>
          </li>
          <li className="active">
            <Link href="/gallery">
              <HeartIcon /> View Guestbook
            </Link>
          </li>
          <li>
            <Link href="/upload">
              <HeartIcon /> Leave a Message
            </Link>
          </li>
        </ul>
      </nav>

      <div className="gallery-icon-wrapper">
        <Image
          src={weddingIcon6}
          alt="Wedding Icon"
          className="gallery-icon"
          width={100}
          height={100}
        />
      </div>

      <h1 className="gallery-title">Guestbook Gallery</h1>

      <div className="gallery-description">
        <p>
          Swipe to view all the wonderful images <br />
          and messages shared by guests.
        </p>
      </div>

      {/* ✅ Rainbow Animation with sparkles */}
      <div className="rainbow-wrapper" style={{ position: 'relative' }}>
        <div className="rainbow">
          <div className="ray-1"></div>
          <div className="ray-2"></div>
          <div className="ray-3"></div>
          <div className="ray-4"></div>
          <div className="ray-5"></div>
          <div className="ray-6"></div>
          <div className="ray-7"></div>
        </div>
      </div>

        <GallerySwiper />

      <Footer />
      <InstallPrompt />
    </div>
  );
}

