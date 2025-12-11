"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/navigation';

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
  id: string;
}

export default function GuestMessageForm() {
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();  // ADD THIS LINE

   // Add sparkles effect
  useEffect(() => {
    const createSparkle = () => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.position = 'fixed';
      sparkle.style.left = Math.random() * window.innerWidth + 'px';
      sparkle.style.top = Math.random() * window.innerHeight + 'px';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '1000';
      
      document.body.appendChild(sparkle);
      
      setTimeout(() => {
        if (document.body.contains(sparkle)) {
          document.body.removeChild(sparkle);
        }
      }, 2500);
    };

    const sparkleInterval = setInterval(createSparkle, 800);
    return () => clearInterval(sparkleInterval);
  }, []);

  // Validate video duration
  const checkVideoDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        resolve(duration <= 60); // 60 seconds max
      };
      video.onerror = () => resolve(false);
      video.src = URL.createObjectURL(file);
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const currentImages = mediaFiles.filter(f => f.type === 'image').length;
    const currentVideo = mediaFiles.find(f => f.type === 'video');
    let imagesAddedThisSession = 0; // NEW: Track images being added

    for (const file of acceptedFiles) {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      // Validate file type
      if (!isImage && !isVideo) {
        alert('Only images and videos are allowed');
        continue;
      }

      // Video validation
      if (isVideo) {
        if (currentVideo) {
          alert('You can only upload one video per message');
          continue;
        }
        if (!file.type.includes('mp4') && !file.type.includes('quicktime')) {
          alert('Only MP4 and MOV videos are supported');
          continue;
        }

        // NEW: Check if file is suspiciously small (likely a thumbnail, not video)
        const minVideoSize = 100 * 1024; // 100KB minimum
        if (file.size < minVideoSize) {
          console.error('Video file too small:', file.size, 'bytes - likely a thumbnail');
          alert('⚠️ Video capture error: Please select your video from your Camera Roll/Gallery instead of using the camera directly.');
          continue;
        }

        if (file.size > 50 * 1024 * 1024) {
          alert('Video must be less than 50MB');
          continue;
        }
        const isValidDuration = await checkVideoDuration(file);
        if (!isValidDuration) {
          alert('Video must be 60 seconds or less');
          continue;
        }
      

      // NEW: Additional verification - try to read a chunk of the file
        try {
          const fileReader = new FileReader();
          const blob = file.slice(0, 1024); // Read first 1KB
          await new Promise((resolve, reject) => {
            fileReader.onload = resolve;
            fileReader.onerror = reject;
            fileReader.readAsArrayBuffer(blob);
          });
        } catch (error) {
          console.error('Cannot read video file:', error);
          alert('⚠️ Video file error: Please select your video from your Camera Roll/Gallery instead of using the camera directly.');
          continue;
        }
      }

      // Image validation - FIXED
      if (isImage) {
        if (currentImages + imagesAddedThisSession + 1 > 10) {  // Check current + new count
          alert('You can only upload up to 10 images per message');
          break; // Stop processing more files
        }
        imagesAddedThisSession++; // Increment counter
      }

      // Add file to state
      const mediaFile: MediaFile = {
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? 'video' : 'image',
        id: `${Date.now()}-${Math.random()}`,
      };

      setMediaFiles(prev => [...prev, mediaFile]);
    }
  };

  const removeFile = (id: string) => {
    setMediaFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      mediaFiles.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [mediaFiles]);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/webp': [],
      'video/mp4': [],
      'video/quicktime': [],
    },
    multiple: true,
  });

// Upload with retry logic for rate limiting
  const uploadWithRetry = async (
    filePath: string, 
    file: File | Blob, 
    maxRetries = 3
  ): Promise<{ error: any }> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const { error } = await supabase.storage
        .from('guestbook')
        .upload(filePath, file);
      
      if (!error) {
        return { error: null };
      }
      
      // If rate limited, wait and retry
      if (error.message?.includes('rate') || error.message?.includes('429') || (error as any).statusCode === 429) {
        console.log(`Rate limited, retrying (${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        continue;
      }
      
      // Other errors, return immediately
      return { error };
    }
    
    return { error: { message: 'Max retries exceeded' } };
  };

// Confetti effect for button
  const handleButtonClick = () => {
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
    

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      console.log('Form submitted!');
      console.log('Guest Name:', guestName);
      console.log('Message:', message);
      console.log('Media Files:', mediaFiles);

      const uploadedUrls: string[] = [];
      const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Upload all media files
      for (const mediaFile of mediaFiles) {
        const { file, type, id } = mediaFile;

        try {
          let fileToUpload = file;

          // Compress images
          if (type === 'image') {
            console.log(`Compressing image: ${file.name}`);
            setUploadProgress(prev => ({ ...prev, [id]: 10 }));

            const options = {
              maxSizeMB: 1.2,
              maxWidthOrHeight: 2048,
              useWebWorker: true,
              fileType: file.type,
            };

            fileToUpload = await imageCompression(file, options);
            console.log(`Image compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
            setUploadProgress(prev => ({ ...prev, [id]: 30 }));
          }

          // Upload to Supabase
          // Get extension from filename, fallback to MIME type
          let fileExt = file.name.split('.').pop();

          // If no extension or suspicious, derive from MIME type
          if (!fileExt || fileExt === file.name || fileExt.length > 5) {
            if (type === 'video') {
              // Derive from MIME type
              if (file.type.includes('mp4')) {
                fileExt = 'mp4';
              } else if (file.type.includes('quicktime') || file.type.includes('mov')) {
                fileExt = 'mov';
              } else {
                fileExt = 'mp4'; // Default fallback
              }
              console.log(`No valid extension found, using MIME type: .${fileExt}`);
            }
          }

          const filePath = `guest_uploads/${messageId}/${type}-${Date.now()}.${fileExt}`;
          console.log(`Upload details - Name: ${file.name}, Type: ${file.type}, Size: ${file.size}, Extension: ${fileExt}`);

          console.log(`Uploading ${type}: ${filePath}`);
          setUploadProgress(prev => ({ ...prev, [id]: 50 }));

          const { error: uploadError } = await uploadWithRetry(filePath, fileToUpload);

          if (uploadError) {
            console.error('Upload error details:', {
              message: uploadError?.message,
              name: uploadError?.name,
              status: (uploadError as any).statusCode ?? (uploadError as any).status,
            });
            throw uploadError;
          }

          // Get public URL
          const { data } = supabase.storage
            .from('guestbook')
            .getPublicUrl(filePath);

          uploadedUrls.push(data.publicUrl);
          setUploadProgress(prev => ({ ...prev, [id]: 100 }));
          console.log(`Uploaded: ${data.publicUrl}`);
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          alert(`Error uploading ${file.name}. Please try again.`);
          setUploading(false);
          return;
        }
      }

      console.log('All files uploaded:', uploadedUrls);
      console.log('Inserting into database...');

      // Store message with media URLs
      const { error } = await supabase.from('messages').insert([
        {
          guest_name: guestName,
          message,
          media_url: uploadedUrls.length > 0 ? uploadedUrls[0] : null, // Keep first for backward compatibility
          media_files: uploadedUrls.length > 0 ? uploadedUrls : null, // New field for multiple files
        },
      ]);

      if (error) {
        console.error('Error submitting message:', error);
        alert('Error submitting your message. Please try again.');
        setUploading(false);
        return;
      }

      alert('Your message and media have been submitted successfully! 💕⚽');
      setGuestName('');
      setMessage('');
      setMediaFiles([]);
      setUploadProgress({});
      
      // Redirect to home page after short delay - MOVED INSIDE SUCCESS PATH
      setTimeout(() => {
        router.push('/');
      }, 1500);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
      // NO REDIRECT on error - user stays on form to retry
    } finally {
      setUploading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="guest-message-form">
      <label htmlFor="guest-name">Your Name:</label>
      <input 
        id="guest-name"
        type="text" 
        placeholder="Enter your Name" 
        required value={guestName} 
        onChange={(e) => setGuestName(e.target.value)} />

      <label htmlFor="guest-message">Your Message:</label>  
      <textarea
        id="guest-message" 
        placeholder="Write your heartfelt message here..." 
        required value={message} 
        onChange={(e) => setMessage(e.target.value)} />

      <label htmlFor="media-upload">Upload Photos & Video (Optional):</label>
      <div {...getRootProps()} className="image-upload-container">
        <input {...getInputProps()} id="media-upload"/>
        <div className="upload-placeholder">
          <p>📸 Drag & drop or click to select</p>
          <small>Up to 10 photos + 1 video (60 sec max, MP4/MOV only)
          💡 For videos: Please select from Camera Roll/Gallery</small>
        </div>
      </div>

      {/* Preview Grid */}
      {mediaFiles.length > 0 && (
        <div className="media-preview-grid">
          {mediaFiles.map((mediaFile) => (
            <div key={mediaFile.id} className="media-preview-item">
              {mediaFile.type === 'video' ? (
                <video 
                  src={mediaFile.preview} 
                  className="preview-thumbnail"
                />
              ) : (
                <Image
                  src={mediaFile.preview}
                  alt="Preview"
                  width={150}
                  height={150}
                  className="preview-thumbnail"
                  style={{ objectFit: 'cover' }}
                  unoptimized={true}
                />
              )}
              <button
                type="button"
                onClick={() => removeFile(mediaFile.id)}
                className="remove-file-button"
                aria-label="Remove file"
              >
                ×
              </button>
              {uploading && uploadProgress[mediaFile.id] !== undefined && (
                <div className="upload-progress-bar">
                  <div 
                    className="upload-progress-fill" 
                    style={{ width: `${uploadProgress[mediaFile.id]}%` }}
                  />
                </div>
              )}
              <span className="media-type-badge">
                {mediaFile.type === 'video' ? '🎥' : '📷'}
              </span>
            </div>
          ))}
        </div>
      )}

      <button 
        ref={buttonRef}
        type="submit"
        className="hoverme"
        onClick={handleButtonClick}
        disabled={uploading}
      >
        <span>{uploading ? 'Uploading...' : 'Submit Message & Media'}</span>
      </button>
    </form>
  );
}
