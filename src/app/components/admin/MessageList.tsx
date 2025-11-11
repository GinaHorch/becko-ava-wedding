'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Image from 'next/image';
import JSZip from 'jszip';

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

  // Download all media files as ZIP
  const downloadAllMedia = async () => {
    const messagesToDownload = selectedMessages.size > 0 
      ? messages.filter(msg => selectedMessages.has(msg.id))
      : messages;

    const messagesWithMedia = messagesToDownload.filter(msg => msg.media_url);

    if (messagesWithMedia.length === 0) {
      alert('No media files to download');
      return;
    }

    setDownloadingBulk(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder('guestbook-media');

      // Download all media files and add to zip
      for (let i = 0; i < messagesWithMedia.length; i++) {
        const msg = messagesWithMedia[i];
        if (msg.media_url) {
          try {
            const response = await fetch(msg.media_url);
            const blob = await response.blob();
            const extension = msg.media_url.split('.').pop()?.split('?')[0] || 'file';
            const sanitizedName = msg.guest_name.replace(/[^a-z0-9]/gi, '_');
            const filename = `${i + 1}_${sanitizedName}.${extension}`;
            folder?.file(filename, blob);
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

      alert(`Downloaded ${messagesWithMedia.length} media files!`);
    } catch (error) {
      console.error('Error creating ZIP:', error);
      alert('Error downloading media files');
    } finally {
      setDownloadingBulk(false);
    }
  };

  // Helper function to convert image to data URL
  const getImageDataUrl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const exportToPDF = async () => {
    const messagesToExport = selectedMessages.size > 0 
      ? messages.filter(msg => selectedMessages.has(msg.id))
      : messages;

    if (messagesToExport.length === 0) {
      alert('No messages to export');
      return;
    }

    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Helper function to add a new page with header
      const addNewPage = () => {
        doc.addPage();
        yPosition = margin;
        // Add decorative header on new pages
        doc.setDrawColor(240, 195, 206); // Pink
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      };

      // Title Page Header - Beautiful design
      doc.setFillColor(240, 195, 206); // Pink background
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      doc.setTextColor(239, 71, 31); // Coral text
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Becko & Ava', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Wedding Guestbook', pageWidth / 2, 30, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`${messagesToExport.length} Messages`, pageWidth / 2, 40, { align: 'center' });
      
      yPosition = 60;

      // Export date
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'italic');
      doc.text(`Exported on ${new Date().toLocaleDateString('en-AU')}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Messages
      for (let index = 0; index < messagesToExport.length; index++) {
        const msg = messagesToExport[index];
        const messageBoxHeight = msg.media_url ? 80 : 40; // Estimate height

        // Check if we need a new page
        if (yPosition + messageBoxHeight > pageHeight - margin) {
          addNewPage();
        }

        // Draw message box with pink border
        const boxStartY = yPosition;
        doc.setDrawColor(240, 195, 206);
        doc.setLineWidth(0.8);
        
        // Guest name and number
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(239, 71, 31); // Coral
        doc.text(`${index + 1}. ${msg.guest_name}`, margin + 3, yPosition + 6);
        
        // Date
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(120, 120, 120);
        const dateStr = new Date(msg.created_at).toLocaleDateString('en-AU', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        doc.text(dateStr, pageWidth - margin - 3, yPosition + 6, { align: 'right' });
        
        yPosition += 12;

        // Message content
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        const messageLines = doc.splitTextToSize(msg.message, contentWidth - 10);
        doc.text(messageLines, margin + 3, yPosition);
        yPosition += messageLines.length * 5 + 5;

        // Media thumbnail
        if (msg.media_url) {
          try {
            // Check if it's an image (not video)
            if (!msg.media_url.match(/\.(mp4|mov|webm)$/)) {
              const imgData = await getImageDataUrl(msg.media_url);
              const imgWidth = 40;
              const imgHeight = 30;
              
              // Add thumbnail with border
              doc.setDrawColor(200, 200, 200);
              doc.setLineWidth(0.2);
              doc.addImage(imgData, 'JPEG', margin + 3, yPosition, imgWidth, imgHeight);
              doc.rect(margin + 3, yPosition, imgWidth, imgHeight);
              
              yPosition += imgHeight + 3;
            } else {
              // Video indicator
              doc.setFontSize(9);
              doc.setFont('helvetica', 'italic');
              doc.setTextColor(100, 100, 100);
              doc.text('📹 Video attached', margin + 3, yPosition);
              yPosition += 7;
            }
          } catch (error) {
            console.error('Error loading image for PDF:', error);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100, 100, 100);
            doc.text('📷 Media attached', margin + 3, yPosition);
            yPosition += 7;
          }
        }

        // Hidden badge
        if (msg.hidden) {
          doc.setFillColor(255, 230, 230);
          doc.setDrawColor(255, 100, 100);
          doc.roundedRect(margin + 3, yPosition, 30, 6, 2, 2, 'FD');
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(200, 0, 0);
          doc.text('HIDDEN', margin + 18, yPosition + 4, { align: 'center' });
          yPosition += 8;
        }

        // Draw box around entire message
        const boxHeight = yPosition - boxStartY + 2;
        doc.setDrawColor(240, 195, 206);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, boxStartY, contentWidth, boxHeight, 2, 2);

        yPosition += 8; // Space between messages
      }

      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'italic');
      doc.text('💕⚽ With love from all your guests', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save the PDF
      doc.save(`Becko-Ava-Guestbook-${new Date().toISOString().split('T')[0]}.pdf`);
      
      alert('PDF exported successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
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
            {downloadingBulk ? 'Downloading...' : '📥 Download All Media'}
          </button>
          <button onClick={exportToPDF} className="admin-export-button">
            📄 Export to PDF
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
                  <button
                    onClick={() => downloadMediaFile(msg.media_url!, msg.guest_name)}
                    className="admin-download-media-button"
                    title="Download this media file"
                  >
                    📥 Download
                  </button>
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

