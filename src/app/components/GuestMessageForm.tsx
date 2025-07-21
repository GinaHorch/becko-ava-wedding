"use client";

export default function GuestMessageForm() {
  return (
    <form className="guest-form">
      <input type="text" placeholder="Your Name" required />
      <textarea placeholder="Your Message" required />
      <button type="submit">Submit Message</button>
    </form>
  );
}
