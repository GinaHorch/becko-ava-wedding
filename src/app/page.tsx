export default function Home() {
  return (
    <main className="landing-container">
      <h1 className="landing-title">Becko & Ava’s Wedding Guestbook</h1>

      <nav className="landing-navigation">
        <ul>
          <li><a href="/upload">Leave a message</a></li>
          <li><a href="/gallery">View guestbook</a></li>
        </ul>
      </nav>

      <div className="landing-description">
        <p>Welcome! Join us in celebrating Becko & Ava by leaving your heartfelt messages and beautiful photos.</p>
      </div>
    </main>
  );
}
// This is a skeleton code for the landing page. You can modify the structure, content and styles as needed.
