'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Image from 'next/image';
import JSZip from 'jszip';
import soccerHeart from '../../images/soccer-heart.png';

interface Message {
  id: string;
  guest_name: string;
  message: string;
  media_url: string | null;
  media_files: string[] | null;
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
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [downloadingBulk, setDownloadingBulk] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDelete = async (id: string, mediaUrl: string | null, mediaFiles: string[] | null = null) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      // Get all media URLs (both old and new format)
      const allMediaUrls: string[] = [];
      
      // Add from media_files array (new multi-file system)
      if (mediaFiles && mediaFiles.length > 0) {
        allMediaUrls.push(...mediaFiles);
      }
      
      // Add from media_url (old single-file system, for backward compatibility)
      if (mediaUrl && !allMediaUrls.includes(mediaUrl)) {
        allMediaUrls.push(mediaUrl);
      }

      // Delete all media files from storage
      if (allMediaUrls.length > 0) {
        const filePaths: string[] = [];
        
        for (const url of allMediaUrls) {
          // Extract the full path after the bucket URL
          // URL format: https://xxx.supabase.co/storage/v1/object/public/guestbook/guest_uploads/...
          const urlParts = url.split('/guestbook/');
          if (urlParts.length > 1) {
            filePaths.push(urlParts[1]); // e.g., "guest_uploads/messageId/image-123.jpg"
          }
        }
        
        if (filePaths.length > 0) {
          console.log('Deleting files from storage:', filePaths);
          const { error: storageError } = await supabase.storage
            .from('guestbook')
            .remove(filePaths);
          
          if (storageError) {
            console.error('Storage deletion error:', storageError);
            // Continue with database deletion even if storage fails
          }
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

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedMessages(new Set());
      setSelectAll(false);
    } else {
      setSelectedMessages(new Set(filteredMessages.map(msg => msg.id)));
      setSelectAll(true);
    }
  };

  const toggleMessageSelection = (id: string) => {
    const newSelection = new Set(selectedMessages);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedMessages(newSelection);
    setSelectAll(newSelection.size === filteredMessages.length);
  };

  // Download individual media file
  const downloadMediaFile = async (mediaUrl: string, guestName: string) => {
    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract file extension
      const extension = mediaUrl.split('.').pop()?.split('?')[0] || 'file';
      const sanitizedName = guestName.replace(/[^a-z0-9]/gi, '_');
      a.download = `${sanitizedName}_media.${extension}`;
      
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file');
    }
  };

  // Download all media files as ZIP (UPDATED for multiple files per message)
  const downloadAllMedia = async () => {
    const messagesToDownload = selectedMessages.size > 0 
      ? messages.filter(msg => selectedMessages.has(msg.id))
      : messages;

    const messagesWithMedia = messagesToDownload.filter(msg => 
      (msg.media_files && msg.media_files.length > 0) || msg.media_url
    );

    if (messagesWithMedia.length === 0) {
      alert('No media files to download');
      return;
    }

    setDownloadingBulk(true);
    let totalFiles = 0;

    try {
      const zip = new JSZip();

      // Download all media files and add to zip
      for (let i = 0; i < messagesWithMedia.length; i++) {
        const msg = messagesWithMedia[i];
        
        // Get all media URLs (from media_files array or fallback to single media_url)
        const mediaUrls = msg.media_files && msg.media_files.length > 0 
          ? msg.media_files 
          : (msg.media_url ? [msg.media_url] : []);

        // Create folder for each guest if they have multiple files
        const sanitizedName = msg.guest_name.replace(/[^a-z0-9]/gi, '_');
        const guestFolder = mediaUrls.length > 1 
          ? zip.folder(`${i + 1}_${sanitizedName}`)
          : zip.folder('guestbook-media');

        for (let j = 0; j < mediaUrls.length; j++) {
          const url = mediaUrls[j];
          try {
            const response = await fetch(url);
            const blob = await response.blob();
            const extension = url.split('.').pop()?.split('?')[0] || 'file';
            
            // Filename: if single file, include guest name; if multiple, just number
            const filename = mediaUrls.length > 1 
              ? `${j + 1}.${extension}`
              : `${i + 1}_${sanitizedName}.${extension}`;
            
            guestFolder?.file(filename, blob);
            totalFiles++;
          } catch (error) {
            console.error(`Error downloading ${msg.guest_name}'s media:`, error);
          }
        }
      }

      // Generate ZIP and download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guestbook-media-${new Date().toISOString().split('T')[0]}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert(`Downloaded ${totalFiles} files from ${messagesWithMedia.length} messages!`);
    } catch (error) {
      console.error('Error creating ZIP:', error);
      alert('Error downloading media files');
    } finally {
      setDownloadingBulk(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading messages...</div>;
  }

  return (
    <div className="admin-message-list">
      <div className="admin-controls">
        <div className="admin-search-wrapper">
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

        <div className="admin-export-buttons">
          <button 
            onClick={downloadAllMedia} 
            className="admin-export-button admin-download-button"
            disabled={downloadingBulk}
          >
            {downloadingBulk ? (
              'Downloading...'
            ) : (
              <>
                <Image 
                  src={soccerHeart} 
                  alt="Download" 
                  width={20} 
                  height={20} 
                  style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} 
                />
                Download All Media
              </>
            )}
          </button>
        </div>
      </div>

      <div className="admin-selection-controls">
        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={toggleSelectAll}
          />
          Select All ({selectedMessages.size} selected)
        </label>
        {selectedMessages.size > 0 && (
          <span className="admin-selection-info">
            Exporting {selectedMessages.size} message{selectedMessages.size !== 1 ? 's' : ''}
          </span>
        )}
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
              className={`admin-message-card ${msg.hidden ? 'hidden-message' : ''} ${selectedMessages.has(msg.id) ? 'selected' : ''}`}
            >
              <div className="admin-message-header">
                <div className="admin-message-header-left">
                  <label className="admin-message-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedMessages.has(msg.id)}
                      onChange={() => toggleMessageSelection(msg.id)}
                    />
                  </label>
                  <div>
                    <strong>{msg.guest_name}</strong>
                    <span className="admin-message-date">
                      {new Date(msg.created_at).toLocaleDateString()} at{' '}
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                {msg.hidden && <span className="hidden-badge">HIDDEN</span>}
              </div>

              <p className="admin-message-text">{msg.message}</p>

              {/* Multiple Media Display */}
              {(() => {
                const mediaUrls = msg.media_files && msg.media_files.length > 0 
                  ? msg.media_files 
                  : (msg.media_url ? [msg.media_url] : []);

                  // Dynamic sizing based on count
                const isSingleMedia = mediaUrls.length === 1;
                const mediaWidth = isSingleMedia ? 400 : 200;
                const mediaHeight = isSingleMedia ? 300 : 150;

                return mediaUrls.length > 0 && (
                  <div className={`admin-message-media ${isSingleMedia ? 'single-media' : 'multi-media'}`}>
                    {mediaUrls.map((url, index) => {
                      const isVideo = url.match(/\.(mp4|mov|webm)$/);
                      return (
                        <div key={index} className="admin-media-item">
                          {isVideo ? (
                            <video src={url} controls style={{ maxWidth: `${mediaWidth}px`, borderRadius: '4px' }} />
                          ) : (
                            <Image
                              src={url}
                              alt={`Upload ${index + 1}`}
                              width={mediaWidth}
                              height={mediaHeight}
                              style={{ objectFit: 'cover', borderRadius: '4px' }}
                              unoptimized={true}
                            />
                          )}
                          <button
                            onClick={() => downloadMediaFile(url, msg.guest_name)}
                            className="admin-download-media-button"
                            title="Download this file"
                          >
                            <Image 
                              src={soccerHeart} 
                              alt="Download" 
                              width={14} 
                              height={14} 
                              style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.3rem' }} 
                            />
                            Download
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="admin-message-actions">
                <button
                  onClick={() => handleHideToggle(msg.id, msg.hidden)}
                  className="admin-action-button hide-button"
                >
                  {msg.hidden ? 'Unhide' : 'Hide'}
                </button>
                <button
                  onClick={() => handleDelete(msg.id, msg.media_url, msg.media_files)}
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

