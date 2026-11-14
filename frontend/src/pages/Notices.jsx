import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import Toast from '../components/common/Toast';
import {
  BellRing,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  Pin,
  Filter,
} from 'lucide-react';

export default function Notices() {
  const { user, isAdmin } = useAuth();
  const { socket } = useSocket();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Normal',
    pinned: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      const res = await api.get('/notices', { params });
      if (res.data.success) {
        setNotices(res.data.notices);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [categoryFilter]);

  // Listen for socket broadcast of new notices
  useEffect(() => {
    if (!socket) return;

    const handleNewNotice = (notice) => {
      setNotices((prev) => [notice, ...prev]);
      setToastMsg(`New Notice Broadcasted: "${notice.title}"`);
    };

    socket.on('new_notice_broadcast', handleNewNotice);
    return () => {
      socket.off('new_notice_broadcast', handleNewNotice);
    };
  }, [socket]);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/notices', formData);
      if (res.data.success) {
        setToastMsg('Notice published and broadcasted!');
        if (socket) {
          socket.emit('broadcast_notice', res.data.notice);
        }
        setModalOpen(false);
        setFormData({
          title: '',
          content: '',
          category: 'General',
          priority: 'Normal',
          pinned: false,
        });
        fetchNotices();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await api.delete(`/notices/${id}`);
      setToastMsg('Notice deleted');
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notice');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BellRing className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            Hostel Notice Board & Bulletins
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official hostel circulars, event announcements, and maintenance alerts.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Broadcast Announcement
          </button>
        )}
      </div>

      {toastMsg && <Toast type="success" message={toastMsg} onClose={() => setToastMsg('')} />}
      {error && <Toast type="error" message={error} onClose={() => setError('')} />}

      {/* Filter */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm w-fit">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs bg-transparent text-slate-900 dark:text-white outline-none font-semibold cursor-pointer"
        >
          <option value="">All Notice Categories</option>
          <option value="General">General</option>
          <option value="Rules">Rules & Discipline</option>
          <option value="Maintenance">Maintenance Alert</option>
          <option value="Event">Events & Sports</option>
          <option value="Mess">Mess / Dining</option>
        </select>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <Loader text="Loading notice board..." />
      ) : notices.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <BellRing className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No notices posted
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Check back later for hostel news and announcements.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div
              key={n._id}
              className={`p-6 rounded-3xl border transition-all ${
                n.pinned
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  {n.pinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                      <Pin className="w-3 h-3 fill-amber-700 dark:fill-amber-300" /> Pinned
                    </span>
                  )}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded-md">
                    {n.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      n.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : n.priority === 'Important'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {n.priority}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(n.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteNotice(n._id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
                {n.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {n.content}
              </p>

              <div className="mt-4 pt-3 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span>Published by: <strong>{n.createdBy?.name || 'Chief Warden'}</strong></span>
                <span>Target: <strong>All Residents</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE NOTICE MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast Announcement"
      >
        <form onSubmit={handleCreateNotice} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notice Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Water Tank Sanitization Notice"
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="General">General</option>
                <option value="Rules">Rules & Curfew</option>
                <option value="Maintenance">Maintenance Alert</option>
                <option value="Event">Events</option>
                <option value="Mess">Mess / Dining</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notice Content *
            </label>
            <textarea
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write the full text of announcement for residents..."
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinned"
              checked={formData.pinned}
              onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="pinned" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Pin to top of bulletin board
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Broadcast Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

