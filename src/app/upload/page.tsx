'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ImageUploader from '../components/ImageUploader';
import weddingIcon4 from '../images/wedding-icon-4.png'; 
import weddingIcon5 from '../images/wedding-icon-5.png'; 

function GuestMessageForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, message });
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

      <button type="submit">Submit Message</button>
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

      {/* Optional second icon */}
      <div className="guestbook-icon-2">
        <Image
          src={weddingIcon5}
          alt="Wedding icon 5"
          className="wedding-icon-5"
        />   
      </div>

      {/* Guest Message Form */}
      <section className="message-form-section">
        <h2>Write Your Message</h2>
        <GuestMessageForm />
      </section>

      {/* Image Uploader */}
      <section className="image-uploader-section">
        <h2>Upload Your Photo</h2>
        <ImageUploader />
      </section>
    </div>
  );
}
