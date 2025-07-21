import GallerySwiper from '../components/GallerySwiper';

export default function Gallery() {
  return (
    <div className="gallery-container">
      <h1 className="gallery-title">Guestbook Gallery</h1>

      <div className="swiper-container">
        <GallerySwiper />
      </div>

      <div className="gallery-description">
        <p>Swipe to view all the wonderful images and messages shared by guests.</p>
      </div>
    </div>
  );
}
// This is a skeleton code for the gallery page. You can modify the structure, content and styles as needed.
