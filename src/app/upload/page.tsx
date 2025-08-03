'use client';

import React from 'react';
import Image from 'next/image';
import GuestMessageForm from '../components/GuestMessageForm';
import weddingIcon4 from '../images/wedding-icon-4.png';
import weddingIcon5 from '../images/wedding-icon-5.png';

export default function Guestbook() {
  return (
    <div className="guestbook-container">
      {/* Top Icon */}
      <div className="guestbook-icon">
        <Image
          src={weddingIcon4}
          alt="Wedding icon 4"
          className="wedding-icon-4"
        />
      </div>

      {/* Title */}
      <h1 className="guestbook-title">
        Leave Your <br />
        Message and Photo
      </h1>

      {/* Instructions */}
      <div className="instructions">
        <p>
          Please leave your heartfelt message <br />
          and a memorable photo for the couple.
        </p>
      </div>

      {/* Rainbow Border Icon */}
      <div className="guestbook-icon-2 rainbow-overlay">
        <Image
          src={weddingIcon5}
          alt="Wedding icon 5"
          className="wedding-icon-5"
        />
      </div>

      {/* Message Form */}
      <section className="message-form-section">
        <h2>
          <span className="emoji-colored">✨</span> Write Your Message <span className="emoji-colored">✨</span>
        </h2>
        <GuestMessageForm />
      </section>

      {/* Image Uploader */}
      <section className="image-uploader-section">
        <h2>
          <span className="emoji-colored">✨</span> Upload Your Photo <span className="emoji-colored">✨</span>
        </h2>
        <GuestMessageForm />
      </section>
    </div>
  );
}
