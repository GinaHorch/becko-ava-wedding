import ImageUploader from '../components/ImageUploader';
import GuestMessageForm from '../components/GuestMessageForm';

export default function Guestbook() {
  return (
    <div className="guestbook-container">
      <h1 className="guestbook-title">Leave Your Message & Photo</h1>

      <section className="message-form-section">
        <h2>Write Your Message</h2>
        <GuestMessageForm />
      </section>

      <section className="image-uploader-section">
        <h2>Upload Your Photo</h2>
        <ImageUploader />
      </section>

      <div className="instructions">
        <p>Please leave your heartfelt message and a memorable photo for the couple.</p>
      </div>
    </div>
  );
}
// This is a skeleton code for the guestbook page. You can modify the structure, content and styles as needed.
