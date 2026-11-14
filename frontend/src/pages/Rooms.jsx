import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import Toast from '../components/common/Toast';
import {
  BedDouble,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Wifi,
  Users,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function Rooms() {
  const { user, isAdmin } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [blockFilter, setBlockFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingStartDate, setBookingStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Admin Room Create/Edit Modal
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    block: 'Block A',
    floor: 1,
    type: 'Double',
    capacity: 2,
    rentPerMonth: 6000,
    amenities: 'Attached Washroom, High-Speed Wi-Fi, Study Desk, Cupboard',
    description: '',
    status: 'Available',
  });
  const [roomSubmitting, setRoomSubmitting] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (blockFilter) params.block = blockFilter;
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/rooms', { params });
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [debouncedSearch, blockFilter, typeFilter, statusFilter]);

  // Handle Apply/Book
  const openBookingModal = (room) => {
    setSelectedRoom(room);
    setBookingNotes('');
    setBookingModalOpen(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return;
    setBookingSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        roomId: selectedRoom._id,
        startDate: bookingStartDate,
        notes: bookingNotes,
      });
      if (res.data.success) {
        setToastMsg('Room booking application submitted successfully!');
        setBookingModalOpen(false);
        fetchRooms();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking application');
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Handle Admin Room Add/Edit
  const openAddRoomModal = () => {
    setEditingRoomId(null);
    setRoomFormData({
      roomNumber: '',
      block: 'Block A',
      floor: 1,
      type: 'Double',
      capacity: 2,
      rentPerMonth: 6000,
      amenities: 'Attached Washroom, High-Speed Wi-Fi, Study Desk, Cupboard',
      description: '',
      status: 'Available',
    });
    setRoomModalOpen(true);
  };

  const openEditRoomModal = (room) => {
    setEditingRoomId(room._id);
    setRoomFormData({
      roomNumber: room.roomNumber,
      block: room.block,
      floor: room.floor,
      type: room.type,
      capacity: room.capacity,
      rentPerMonth: room.rentPerMonth,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
      description: room.description || '',
      status: room.status,
    });
    setRoomModalOpen(true);
  };

  const submitRoomForm = async (e) => {
    e.preventDefault();
    setRoomSubmitting(true);
    try {
      const payload = {
        ...roomFormData,
        amenities: roomFormData.amenities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
      };

      if (editingRoomId) {
        await api.put(`/rooms/${editingRoomId}`, payload);
        setToastMsg('Room updated successfully');
      } else {
        await api.post('/rooms', payload);
        setToastMsg('Room created successfully');
      }
      setRoomModalOpen(false);
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save room');
    } finally {
      setRoomSubmitting(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await api.delete(`/rooms/${roomId}`);
      setToastMsg('Room deleted successfully');
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete room');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BedDouble className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            Hostel Rooms & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse rooms, check real-time bed availability, and manage allocations.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openAddRoomModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Add New Room
          </button>
        )}
      </div>

      {toastMsg && <Toast type="success" message={toastMsg} onClose={() => setToastMsg('')} />}
      {error && <Toast type="error" message={error} onClose={() => setError('')} />}

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search room, block or tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Block Filter */}
        <select
          value={blockFilter}
          onChange={(e) => setBlockFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Blocks</option>
          <option value="Block A">Block A</option>
          <option value="Block B">Block B</option>
          <option value="Block C">Block C</option>
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Room Types</option>
          <option value="Single">Single Room</option>
          <option value="Double">Double Sharing</option>
          <option value="Triple">Triple Sharing</option>
          <option value="Dormitory">Dormitory</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Availability</option>
          <option value="Available">Available Only</option>
          <option value="Full">Full</option>
          <option value="Maintenance">Under Maintenance</option>
        </select>
      </div>

      {/* Room Grid */}
      {loading ? (
        <Loader text="Fetching rooms..." />
      ) : rooms.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <BedDouble className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No rooms found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search criteria or clear the filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const isFull = room.status === 'Full' || room.occupied >= room.capacity;
            const isAvailable = room.status === 'Available' && !isFull;

            return (
              <div
                key={room._id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between p-6"
              >
                <div>
                  {/* Top Bar: Room Number & Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                        {room.block} • Floor {room.floor}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        Room {room.roomNumber}
                      </h3>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : room.status === 'Maintenance'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>

                  {/* Rent and Sharing Type */}
                  <div className="mt-4 flex items-baseline justify-between py-2 border-y border-slate-100 dark:border-slate-700/80">
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        ₹{room.rentPerMonth}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400"> / month</span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {room.type}
                    </span>
                  </div>

                  {/* Bed Occupancy Gauge */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Occupancy</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {room.occupied || 0} / {room.capacity} Beds
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull ? 'bg-rose-500' : 'bg-primary-500'
                        }`}
                        style={{
                          width: `${Math.min(((room.occupied || 0) / room.capacity) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  {room.description && (
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {room.description}
                    </p>
                  )}

                  {/* Amenities */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {room.amenities &&
                      room.amenities.map((am, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                        >
                          {am}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Actions bottom */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                  {isAdmin ? (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => openEditRoomModal(room)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="inline-flex items-center justify-center p-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openBookingModal(room)}
                      disabled={!isAvailable}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:hover:bg-primary-600 shadow-sm transition-all"
                    >
                      {isAvailable ? 'Book This Room' : 'Unavailable'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STUDENT BOOKING MODAL */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title={`Apply for Room ${selectedRoom?.roomNumber || ''}`}
      >
        {selectedRoom && (
          <form onSubmit={submitBooking} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
              <p className="font-bold text-slate-900 dark:text-white">
                {selectedRoom.block} • {selectedRoom.type} Sharing
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly Rent: ₹{selectedRoom.rentPerMonth} | Capacity: {selectedRoom.capacity} Beds
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Requested Move-In Date *
              </label>
              <input
                type="date"
                required
                value={bookingStartDate}
                onChange={(e) => setBookingStartDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Application Notes / Preferences
              </label>
              <textarea
                rows={3}
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="E.g., Preferred corner bed, quiet study schedule..."
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={bookingSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {bookingSubmitting ? 'Submitting...' : 'Confirm Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ADMIN ADD/EDIT ROOM MODAL */}
      <Modal
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        title={editingRoomId ? 'Edit Room Specifications' : 'Add New Hostel Room'}
      >
        <form onSubmit={submitRoomForm} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                required
                value={roomFormData.roomNumber}
                onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                placeholder="e.g. A-101"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hostel Block *
              </label>
              <select
                value={roomFormData.block}
                onChange={(e) => setRoomFormData({ ...roomFormData, block: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Block A">Block A</option>
                <option value="Block B">Block B</option>
                <option value="Block C">Block C</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Floor
              </label>
              <input
                type="number"
                min={0}
                value={roomFormData.floor}
                onChange={(e) => setRoomFormData({ ...roomFormData, floor: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room Type
              </label>
              <select
                value={roomFormData.type}
                onChange={(e) => setRoomFormData({ ...roomFormData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Dormitory">Dormitory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Capacity
              </label>
              <input
                type="number"
                min={1}
                value={roomFormData.capacity}
                onChange={(e) => setRoomFormData({ ...roomFormData, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rent / Month (₹) *
              </label>
              <input
                type="number"
                min={0}
                required
                value={roomFormData.rentPerMonth}
                onChange={(e) => setRoomFormData({ ...roomFormData, rentPerMonth: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room Status
              </label>
              <select
                value={roomFormData.status}
                onChange={(e) => setRoomFormData({ ...roomFormData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Available">Available</option>
                <option value="Full">Full</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amenities (comma-separated)
            </label>
            <input
              type="text"
              value={roomFormData.amenities}
              onChange={(e) => setRoomFormData({ ...roomFormData, amenities: e.target.value })}
              placeholder="Attached Washroom, Wi-Fi, Balcony, Study Desk"
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={roomFormData.description}
              onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
              placeholder="Quiet room facing the courtyard..."
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRoomModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={roomSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {roomSubmitting ? 'Saving...' : editingRoomId ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

