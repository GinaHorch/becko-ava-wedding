"use client";

import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function GuestMessageForm() {
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setPreviewUrl(URL.createObjectURL(uploadedFile)); // For preview
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: {
    'image/*': [],
    'video/*': [],
    },
   });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

let media_url = null;

    // Upload image to Supabase if exists
    if (file) {
      const filePath = `guest_uploads/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('guestbook')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Error uploading your photo. Please try again.');
        return;
      }

      // Get public URL after successful upload
      const { data } = supabase.storage
        .from('guestbook')
        .getPublicUrl(filePath);

      media_url = data.publicUrl;
    }

    // Now store message + guest_name + media_url (linked) in Supabase
    const { error } = await supabase.from('messages').insert([
      {
        guest_name: guestName,
        message,
        media_url,
      },
    ]);

    if (error) {
      console.error('Error submitting message:', error);
      alert('Error submitting your message. Please try again.');
      return;
    }

    alert('Your message and photo have been submitted successfully!');
    setGuestName('');
    setMessage('');
    setFile(null);
    setPreviewUrl(null);
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

    <div {...getRootProps()} className="bianca-image-upload-container">
        <input {...getInputProps()} />
        {previewUrl ? (
          <div className="bianca-preview-image">
            <Image
              src={previewUrl}
              alt="Preview"
              width={300}
              height={200}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
              unoptimized={true}
            />
          </div>
        ) : (
          <p>Drag & drop your photo/video here, or click to select a file</p>
        )}
      </div>

      <button type="submit">Submit Message & Photo</button>
    </form>
  );
}
