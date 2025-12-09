import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GuestMessageForm from '../components/GuestMessageForm';
import weddingIcon4 from '../images/wedding-icon-4.png';
import weddingIcon5 from '../images/wedding-icon-5.png';
import weddingIcon13 from '../images/wedding-icon-13.png';
import weddingIcon14 from '../images/wedding-icon-14.png';
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

export default function Guestbook() {
  return (
    <div className="guestbook-container">
      {/* Navigation */}
      <nav className="page-navigation">
        <ul>
          <li>
            <Link href="/">
              <HeartIcon /> Home
            </Link>
          </li>
          <li>
            <Link href="/gallery">
              <HeartIcon /> View Guestbook
            </Link>
          </li>
          <li className="active">
            <Link href="/upload">
              <HeartIcon /> Leave a Message
            </Link>
          </li>
        </ul>
      </nav>

      {/* Top Icon */}
      <div className="guestbook-icon">
        <Image
          src={weddingIcon4}
          alt="Wedding icon 4"
          className="wedding-icon-4"
        />
      </div>  

      {/* Title with flourishes only around "Message & Media" */}
<h1 className="guestbook-title">
  <span className="guestbook-title-flourish">
    <Image
      src={weddingIcon13}
      alt="Left Wedding Flourish"
      width={50}
      height={50}
    />
    <span className="flourish-text">Messages & Media</span>
    <Image
      src={weddingIcon14}
      alt="Right Wedding Flourish"
      width={50}
      height={50}
    />
  </span>
</h1>


      {/* Instructions */}
      <div className="instructions">
        <p>
          Please leave your heartfelt message <br />
          and a memorable photo/video for the couple.
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

      {/* Unified Message and Photo/Video Form */}
      <section className="message-form-section">
        <h2>
          Write Your Message
        </h2>
        <GuestMessageForm />
      </section>

      <Footer />
      <InstallPrompt />
    </div>
  );
}
