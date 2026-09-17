import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

export function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteInputs, setNoteInputs] = useState({});

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/api/contact/admin/messages');
      setMessages(data.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
      setError('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/api/contact/admin/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error('Failed to delete message', err);
      alert('Failed to delete message');
    }
  };

  const handleNoteChange = (id, value) => {
    setNoteInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddNote = async (id) => {
    const noteText = noteInputs[id];
    if (!noteText?.trim()) return;

    try {
      const { data } = await api.post(`/api/contact/admin/messages/${id}/notes`, { note_text: noteText });
      
      // Update the message in state with the new note
      setMessages((prev) => 
        prev.map((msg) => {
          if (msg.id === id) {
            return {
              ...msg,
              notes: [data.data, ...msg.notes] // Stack latest on top
            };
          }
          return msg;
        })
      );
      
      // Clear the input
      setNoteInputs((prev) => ({ ...prev, [id]: '' }));
    } catch (err) {
      console.error('Failed to add note', err);
      alert('Failed to add note');
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const datePart = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${datePart} at ${timePart}`;
  };

  if (loading) return <div className="p-6">Loading messages...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-text">Contact Messages</h1>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center text-muted-text">
          No contact messages found.
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden flex flex-col md:flex-row"
            >
              {/* Message Details */}
              <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-border/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-sm text-accent hover:underline">{msg.email}</a>
                  </div>
                  <div className="text-xs text-muted-text bg-surface px-3 py-1 rounded-full">
                    {formatDate(msg.created_at)}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1">Subject</div>
                  <div className="font-medium text-text">{msg.subject}</div>
                </div>
                
                <div className="mb-6">
                  <div className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-1">Message</div>
                  <p className="text-text whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {msg.message}
                  </p>
                </div>

                <button 
                  onClick={() => handleDelete(msg.id)}
                  className="text-red-500 text-sm font-semibold hover:text-red-700 transition"
                >
                  Delete Message
                </button>
              </div>

              {/* Notes Section */}
              <div className="p-6 w-full md:w-1/3 bg-[#FAFAFA] flex flex-col">
                <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                  <span>📝</span> Admin Notes
                </h4>
                
                <div className="flex-1 overflow-y-auto max-h-64 mb-4 space-y-3">
                  {msg.notes && msg.notes.length > 0 ? (
                    msg.notes.map((note) => (
                      <div key={note.id} className="bg-white p-3 rounded-lg border border-border shadow-sm">
                        <p className="text-sm text-text whitespace-pre-wrap">{note.note_text}</p>
                        <div className="text-[10px] text-muted-text text-right mt-2">
                          {formatDate(note.created_at)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-text italic text-center py-4">
                      No notes added yet.
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <textarea
                    rows={2}
                    placeholder="Add a note about this user/message..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none mb-2"
                    value={noteInputs[msg.id] || ''}
                    onChange={(e) => handleNoteChange(msg.id, e.target.value)}
                  />
                  <button
                    onClick={() => handleAddNote(msg.id)}
                    disabled={!noteInputs[msg.id]?.trim()}
                    className="w-full py-2 bg-[#E8F8EE] text-[#299554] font-semibold text-sm rounded-lg hover:bg-[#d1f1de] disabled:opacity-50 transition"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
