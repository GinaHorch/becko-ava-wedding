'use client';

import Image from 'next/image';
import GallerySwiper from '../components/GallerySwiper';
import weddingIcon6 from '../images/wedding-icon-6.png';

export default function Gallery() {
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
        <p>Swipe to view all the wonderful images and messages shared by guests.</p>
      </div>

      {/* ✅ Rainbow Animation goes right here */}
      <div className="rainbow-wrapper">
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
