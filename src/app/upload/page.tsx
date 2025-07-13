import ImageUploader from './components/ImageUploader';
import GuestMessageForm from './components/GuestMessageForm';

export default function Guestbook() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl mb-6">Leave Your Message & Photo</h1>
      <GuestMessageForm />
      <ImageUploader />
    </div>
  );
}

