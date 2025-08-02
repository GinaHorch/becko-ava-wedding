'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import GallerySwiper from '../components/GallerySwiper';
import weddingIcon6 from '../images/wedding-icon-6.png';

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

      <div className="swiper-container">
        <GallerySwiper />
      </div>
    </div>
  );
}

