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
        alert('Error uploading your media. Please try again.');
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

    alert('Your message and media have been submitted successfully!');
    setGuestName('');
    setMessage('');
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <form onSubmit={handleSubmit} className="guest-message-form">
      <label htmlFor="guest-name">Your Name</label>
      <input 
        id="guest-name"
        type="text" 
        placeholder="Enter your Name" 
        required value={guestName} 
        onChange={(e) => setGuestName(e.target.value)} />

      <label htmlFor="guest-message">Your Message</label>  
      <textarea
        id="guest-message" 
        placeholder="Write your heartfelt message here..." 
        required value={message} 
        onChange={(e) => setMessage(e.target.value)} />

    <label htmlFor="media-upload">Upload Photo or Video (Optional)</label>
    <div {...getRootProps()} className="image-upload-container">
        <input {...getInputProps()} id="media-upload"/>
        {previewUrl ? (
          <div className="preview-container">
            {file?.type.startsWith('video/') ? (
              <video 
                src={previewUrl} 
                controls 
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
              />
            ) : (
            <Image
              src={previewUrl}
              alt="Preview"
              width={300}
              height={200}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
              unoptimized={true}
            />
            )}
            <p>Click to change file</p>
          </div>
        ) : (
          <div className="upload-placeholder">
            <p>📸 Drag & drop your photo/video here, or click to select</p>
            <small>Supported formats: JPG, PNG, MP4, MOV, WEBM</small>
          </div>
        )}
      </div>

      <button type="submit">Submit Message & Media</button>
    </form>
  );
}
