'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

interface Message {
  id: string;
  guest_name: string;
  message: string;
  media_url: string | null;
  created_at: string;
  hidden: boolean;
}

export default function Analytics() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading analytics...</div>;
  }

  const totalMessages = messages.length;
  const visibleMessages = messages.filter(m => !m.hidden).length;
  const hiddenMessages = messages.filter(m => m.hidden).length;
  const messagesWithMedia = messages.filter(m => m.media_url).length;
  const messagesWithoutMedia = totalMessages - messagesWithMedia;

  // Group messages by date
  const messagesByDate: { [key: string]: number } = {};
  messages.forEach(msg => {
    const date = new Date(msg.created_at).toLocaleDateString();
    messagesByDate[date] = (messagesByDate[date] || 0) + 1;
  });

  // Find most active time
  const mostActiveDate = Object.entries(messagesByDate).sort((a, b) => b[1] - a[1])[0];

  // Group messages by hour
  const messagesByHour: { [key: number]: number } = {};
  messages.forEach(msg => {
    const hour = new Date(msg.created_at).getHours();
    messagesByHour[hour] = (messagesByHour[hour] || 0) + 1;
  });

  const mostActiveHour = Object.entries(messagesByHour).sort((a, b) => b[1] - a[1])[0];

  // Average message length
  const avgMessageLength = messages.length > 0
    ? Math.round(messages.reduce((sum, msg) => sum + msg.message.length, 0) / messages.length)
    : 0;

  // Top contributors (guests with most messages)
  const guestCounts: { [key: string]: number } = {};
  messages.forEach(msg => {
    guestCounts[msg.guest_name] = (guestCounts[msg.guest_name] || 0) + 1;
  });

  const topContributors = Object.entries(guestCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="admin-analytics">
      <h2>Guestbook Statistics</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-number">{totalMessages}</div>
          <div className="analytics-label">Total Messages</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-number">{visibleMessages}</div>
          <div className="analytics-label">Visible Messages</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-number">{hiddenMessages}</div>
          <div className="analytics-label">Hidden Messages</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-number">{messagesWithMedia}</div>
          <div className="analytics-label">With Photos/Videos</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-number">{messagesWithoutMedia}</div>
          <div className="analytics-label">Text Only</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-number">{avgMessageLength}</div>
          <div className="analytics-label">Avg. Message Length</div>
        </div>
      </div>

      <div className="analytics-section">
        <h3>Most Active Day</h3>
        {mostActiveDate ? (
          <p>
            <strong>{mostActiveDate[0]}</strong> with {mostActiveDate[1]} message{mostActiveDate[1] !== 1 ? 's' : ''}
          </p>
        ) : (
          <p>No data yet</p>
        )}
      </div>

      <div className="analytics-section">
        <h3>Most Active Hour</h3>
        {mostActiveHour ? (
          <p>
            <strong>{mostActiveHour[0]}:00 - {parseInt(mostActiveHour[0]) + 1}:00</strong> with {mostActiveHour[1]} message{mostActiveHour[1] !== 1 ? 's' : ''}
          </p>
        ) : (
          <p>No data yet</p>
        )}
      </div>

      <div className="analytics-section">
        <h3>Top Contributors</h3>
        {topContributors.length > 0 ? (
          <ol className="top-contributors-list">
            {topContributors.map(([name, count]) => (
              <li key={name}>
                <strong>{name}</strong> - {count} message{count !== 1 ? 's' : ''}
              </li>
            ))}
          </ol>
        ) : (
          <p>No data yet</p>
        )}
      </div>

      <div className="analytics-section">
        <h3>Messages by Date</h3>
        {Object.keys(messagesByDate).length > 0 ? (
          <div className="date-breakdown">
            {Object.entries(messagesByDate)
              .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
              .map(([date, count]) => (
                <div key={date} className="date-row">
                  <span>{date}</span>
                  <span>{count} message{count !== 1 ? 's' : ''}</span>
                </div>
              ))}
          </div>
        ) : (
          <p>No data yet</p>
        )}
      </div>
    </div>
  );
}

