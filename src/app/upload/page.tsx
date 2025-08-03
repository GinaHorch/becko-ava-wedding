'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import ImageUploader from '../components/ImageUploader';
import weddingIcon4 from '../images/wedding-icon-4.png';
import weddingIcon5 from '../images/wedding-icon-5.png';

function GuestMessageForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, message });
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const button = buttonRef.current;
    if (!button) return;

    function random(max: number) {
      return Math.random() * max;
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 100; i++) {
      const confetto = document.createElement('i');

      // Generate random translation and rotation values for CSS variables
      const tx = `${random(500) - 250}px`;
      const ty = `${random(200) - 150}px`;
      const rotation = random(360);

      confetto.style.cssText = `
        position: absolute;
        display: block;
        left: 50%;
        top: 0;
        width: 3px;
        height: 8px;
        background: hsla(${random(360)}, 100%, 50%, 1);
        transform: translate3d(0, 0, 0) rotate(${rotation}deg);
        animation: bang 700ms ease-out forwards;
        opacity: 0;
        pointer-events: none;
        --tx: ${tx};
        --ty: ${ty};
        --rotation: ${rotation}deg;
      `;

      fragment.appendChild(confetto);

      // Clean up each confetto after animation
      setTimeout(() => {
        confetto.remove();
      }, 800);
    }

    button.appendChild(fragment);
  };

  return (
    <form className="guest-message-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Your Name:</label><br />
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="message">Your Message:</label><br />
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      <button ref={buttonRef} type="submit" className="hoverme">
        <span>Submit Message</span>
      </button>
    </form>
  );
}

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
        <ImageUploader />
      </section>
    </div>
  );
}
