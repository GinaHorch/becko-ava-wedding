export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl">Becko & Ava’s Wedding Guestbook</h1>
      <a href="/guestbook" className="mt-4 text-blue-500 underline">Leave a message</a>
      <a href="/gallery" className="mt-2 text-blue-500 underline">View guestbook</a>
    </main>
  );
}
