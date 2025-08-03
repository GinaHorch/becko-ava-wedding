"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Image from 'next/image'; 

interface GuestbookItem {
  id: string;
  media_url: string | null;
  message: string;
  guest_name: string;
  created_at?: string;
}

export default function GallerySwiper() {
  const [items, setItems] = useState<GuestbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false }); // Show newest first
        
        if (error) {
          console.error('Supabase error:', error);
          setError(`Error fetching messages: ${error.message}`);
        } else {
          console.log('Fetched data:', data); // Debug log
          setItems(data || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="bianca-gallery-loading">
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bianca-gallery-error">
        <p>{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bianca-gallery-empty">
        <p>No messages yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <Swiper 
        spaceBetween={10} 
        slidesPerView={1}
        className="swiper-container"
        centeredSlides={true}
        loop={false}
        watchOverflow={true}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="gallery-slide">
            <div className="gallery-slide-content">
              {item.media_url && (
                <div className="gallery-media-container">
                  {item.media_url.match(/\.(mp4|mov|webm)$/) ? (
                    <video
                      src={item.media_url}
                      controls
                      className="gallery-video"
                      preload="metadata"
                    />
                  ) : (
                  <Image
                    src={item.media_url}
                    alt={`Uploaded by ${item.guest_name}`}
                    width={500}
                    height={300}
                    className="gallery-image"
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                    unoptimized={true} // Use unoptimized for better performance with large images
                  />
                  )}
                </div>
              )}
              <div className="gallery-message-content">
                <p className="gallery-message-text">{item.message}</p>
                <span className="gallery-guest-name">— {item.guest_name}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
