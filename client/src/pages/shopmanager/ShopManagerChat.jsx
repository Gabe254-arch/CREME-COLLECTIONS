import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const ShopManagerChat = () => {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('http://localhost:5000/api/chatlogs/mine', config);
        setMessages(data || []);
      } catch (err) {
        console.error('Failed to fetch chat messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userInfo.token]);

  const filteredMessages = messages.filter(msg =>
    msg.question.toLowerCase().includes(search.toLowerCase()) ||
    msg.product?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleReply = async (id, reply) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.put(`http://localhost:5000/api/chatlogs/${id}/reply`, { reply }, config);
      const updated = messages.map(m =>
        m._id === id ? { ...m, reply, isAnswered: true } : m
      );
      setMessages(updated);
      setSelected(null);
    } catch (err) {
      alert('Failed to send reply.');
    }
  };

  // ✅ Analytics Computation
  const total = messages.length;
  const answered = messages.filter(m => m.isAnswered).length;
  const topics = Array.from(
    new Set(messages.map(m => m.product?.name).filter(Boolean))
  ).slice(0, 3);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">💬 Chat Inbox (AI / Customer)</h2>

        {/* 📊 Summary Analytics */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-4 p-4 border bg-gray-50 rounded shadow text-sm text-gray-800 mb-6">
            <div>
              <p className="font-semibold">📨 Total Messages</p>
              <p>{total}</p>
            </div>
            <div>
              <p className="font-semibold">✅ Answered</p>
              <p>{answered} of {total} ({Math.round((answered / total) * 100) || 0}%)</p>
            </div>
            <div>
              <p className="font-semibold">🏷 Top Topics</p>
              <p>{topics.join(', ') || '—'}</p>
            </div>
          </div>
        )}

        {/* 🔍 Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by product, question or keyword"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        {/* 💬 Message List */}
        {loading ? (
          <p>Loading messages...</p>
        ) : filteredMessages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map(msg => (
              <div
                key={msg._id}
                className={`bg-white p-4 rounded shadow border ${
                  !msg.isAnswered ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-gray-800">
                      ❓ {msg.question}
                    </p>
                    {msg.product && (
                      <p className="text-xs mt-1 text-blue-600">
                        📦 Product: {msg.product.name}
                      </p>
                    )}
                  </div>

                  {!msg.isAnswered ? (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      Unanswered
                    </span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Answered
                    </span>
                  )}
                </div>

                {/* ✅ Existing Reply */}
                {msg.isAnswered && (
                  <p className="mt-2 text-sm text-gray-700 border-t pt-2">
                    💬 <span className="font-medium text-green-700">Reply:</span> {msg.reply}
                  </p>
                )}

                {/* 📝 Reply Form */}
                {!msg.isAnswered && (
                  <div className="mt-3">
                    <textarea
                      rows={3}
                      value={selected?._id === msg._id ? selected.reply : ''}
                      onChange={e =>
                        setSelected({ _id: msg._id, reply: e.target.value })
                      }
                      placeholder="Type your response..."
                      className="w-full border p-2 rounded text-sm"
                    />
                    <button
                      onClick={() => handleReply(msg._id, selected.reply)}
                      className="mt-2 bg-green-600 text-white text-sm px-4 py-1 rounded hover:bg-green-700"
                    >
                      Send Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ShopManagerChat;
