'use client';

import { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import MessageList from '../../components/admin/MessageList';
import Analytics from '../../components/admin/Analytics';
import { signOut } from '../../utils/auth';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'messages' | 'analytics'>('messages');
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="admin-header-content">
            <h1>Guestbook Admin</h1>
            <p>Becko & Ava&apos;s Wedding</p>
          </div>
          <button onClick={handleSignOut} className="admin-logout-button">
            Logout
          </button>
        </header>

        <nav className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button
            className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </nav>

        <main className="admin-content">
          {activeTab === 'messages' && <MessageList />}
          {activeTab === 'analytics' && <Analytics />}
        </main>
      </div>
    </ProtectedRoute>
  );
}

