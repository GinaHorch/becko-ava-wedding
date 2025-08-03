"use client"
import { useDropzone } from 'react-dropzone';
import {useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function ImageUploader() {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]; // single file upload for simplicity
    const filePath = `guest_uploads/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from('guestbook')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      return;
    }

    alert('Upload successful!');
  }, []);

  const { getRootProps, getInputProps } = useDropzone( { onDrop } );

  return (
    <div {...getRootProps()} className="bianca-image-upload-container">
      <input {...getInputProps()} />
      <p>Drag & drop your photo here, or click to select a file</p>
    </div>
  );
}
