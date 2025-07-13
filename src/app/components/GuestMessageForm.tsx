"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';


export default function GuestMessageForm() {
  return (
    <form className="space-y-4">
      <Input placeholder="Your Name" required />
      <Textarea placeholder="Your Message" required />
      <Button type="submit">Submit Message</Button>
    </form>
  );
}
