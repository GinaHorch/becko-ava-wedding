"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function GallerySwiper() {
  return (
    <Swiper spaceBetween={10} slidesPerView={1}>
      <SwiperSlide><div>Image 1 Placeholder</div></SwiperSlide>
      <SwiperSlide><div>Image 2 Placeholder</div></SwiperSlide>
    </Swiper>
  );
}
