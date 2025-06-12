// components/FloatingAssistant.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

/**
 * FloatingAssistant
 * Powerful AI-style assistant with backend integration.
 */
const FloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! 👋 Need help with anything today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Replace with your AI backend endpoint
      const res = await axios.post('http://localhost:5000/api/ai/assistant', {
        question: input,
        userId: localStorage.getItem('userInfo') || 'guest'
      });

      const reply = {
        from: 'ai',
        text: res.data.reply || '🤖 Sorry, I could not find an answer right now.'
      };
      setMessages([...newMessages, reply]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { from: 'ai', text: '❌ Failed to reach assistant service. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    if (history.length > 0) setMessages(history);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg animate-bounce"
        >
          💬 Help
        </button>
      )}

      {open && (
        <motion.div
          className="w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-orange-600 font-bold">Creme Customer Care Agent</h4>
            <button onClick={() => setOpen(false)} className="text-gray-500 text-sm">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 text-sm pr-1 scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded max-w-[90%] ${
                  msg.from === 'ai' ? 'bg-gray-100 text-left text-gray-700' : 'bg-orange-100 self-end text-right text-orange-700'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-500 italic">Thinking...</div>
            )}
          </div>

          <div className="mt-2 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 border px-3 py-2 rounded-l text-sm"
            />
            <button onClick={handleSend} className="bg-orange-500 text-white px-4 rounded-r text-sm">
              ➤
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FloatingAssistant;
