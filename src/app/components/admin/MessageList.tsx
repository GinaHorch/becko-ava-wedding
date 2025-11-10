'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Image from 'next/image';

interface Message {
  id: string;
  guest_name: string;
  message: string;
  media_url: string | null;
  created_at: string;
  hidden: boolean;
}

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, showHidden]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Error loading messages');
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    // Filter by hidden status
    if (!showHidden) {
      filtered = filtered.filter(msg => !msg.hidden);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(msg =>
        msg.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
  };

  const handleHideToggle = async (id: string, currentHiddenStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ hidden: !currentHiddenStatus })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, hidden: !currentHiddenStatus } : msg
      ));

      alert(currentHiddenStatus ? 'Message unhidden' : 'Message hidden');
    } catch (error) {
      console.error('Error toggling hidden status:', error);
      alert('Error updating message');
    }
  };

  const handleDelete = async (id: string, mediaUrl: string | null) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      // Delete media file if exists
      if (mediaUrl) {
        const filePath = mediaUrl.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('guestbook')
            .remove([`guest_uploads/${filePath}`]);
        }
      }

      // Delete message from database
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMessages(messages.filter(msg => msg.id !== id));
      setDeleteConfirm(null);
      alert('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Guest Name', 'Message', 'Media URL', 'Created At', 'Hidden'],
      ...messages.map(msg => [
        msg.guest_name,
        msg.message.replace(/"/g, '""'), // Escape quotes
        msg.media_url || '',
        new Date(msg.created_at).toLocaleString(),
        msg.hidden ? 'Yes' : 'No'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guestbook-messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="admin-loading">Loading messages...</div>;
  }

  return (
    <div className="admin-message-list">
      <div className="admin-controls">
        <div className="admin-search">
          <input
            type="text"
            placeholder="Search by name or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>
        
        <div className="admin-filters">
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={(e) => setShowHidden(e.target.checked)}
            />
            Show hidden messages
          </label>
        </div>

        <button onClick={exportToCSV} className="admin-export-button">
          Export to CSV
        </button>
      </div>

      <div className="admin-message-count">
        Showing {filteredMessages.length} of {messages.length} messages
      </div>

      <div className="admin-messages">
        {filteredMessages.length === 0 ? (
          <p className="admin-no-messages">No messages found</p>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`admin-message-card ${msg.hidden ? 'hidden-message' : ''}`}
            >
              <div className="admin-message-header">
                <div>
                  <strong>{msg.guest_name}</strong>
                  <span className="admin-message-date">
                    {new Date(msg.created_at).toLocaleDateString()} at{' '}
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
                {msg.hidden && <span className="hidden-badge">HIDDEN</span>}
              </div>

              <p className="admin-message-text">{msg.message}</p>

              {msg.media_url && (
                <div className="admin-message-media">
                  {msg.media_url.match(/\.(mp4|mov|webm)$/) ? (
                    <video src={msg.media_url} controls style={{ maxWidth: '200px' }} />
                  ) : (
                    <Image
                      src={msg.media_url}
                      alt="Guest upload"
                      width={200}
                      height={150}
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                      unoptimized={true}
                    />
                  )}
                </div>
              )}

              <div className="admin-message-actions">
                <button
                  onClick={() => handleHideToggle(msg.id, msg.hidden)}
                  className="admin-action-button hide-button"
                >
                  {msg.hidden ? 'Unhide' : 'Hide'}
                </button>
                <button
                  onClick={() => handleDelete(msg.id, msg.media_url)}
                  className={`admin-action-button delete-button ${
                    deleteConfirm === msg.id ? 'confirm' : ''
                  }`}
                >
                  {deleteConfirm === msg.id ? 'Click again to confirm' : 'Delete'}
                </button>
                {deleteConfirm === msg.id && (
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="admin-action-button cancel-button"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

