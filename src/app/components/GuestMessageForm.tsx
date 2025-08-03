"use client";

import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function GuestMessageForm() {
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('messages').insert([
      {
        guest_name: guestName,
        message,
      },
    ]);

    if (error) {
      console.error('Error submitting message:', error);
      return;
    }

    alert('Message submitted successfully!');
    setGuestName('');
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="guest-form">
      <input 
        type="text" 
        placeholder="Your Name" 
        required value={guestName} 
        onChange={(e) => setGuestName(e.target.value)} />
      <textarea 
        placeholder="Your Message" 
        required value={message} 
        onChange={(e) => setMessage(e.target.value)} />
      <button type="submit">Submit Message</button>
    </form>
  );
}
