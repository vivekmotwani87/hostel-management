import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/common/StatCard';
import Loader from '../components/common/Loader';
import Toast from '../components/common/Toast';
import {
  BedDouble,
  Users,
  AlertCircle,
  CalendarCheck,
  CreditCard,
  BellRing,
  ArrowRight,
  CheckCircle,
  Clock,
  RefreshCw,
  PlusCircle,
  Send,
  Home as HomeIcon,
  Phone,
  Mail,
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleBookingAction = async (bookingId, status) => {
    try {
      const res = await api.put(`/api/bookings/${bookingId}/status`, { status });
      if (res.data.success) {
        setToastMsg(`Booking marked as ${status}`);
        fetchStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking');
    }
  };

  if (loading && !data) {
    return <Loader text="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? 'Warden Administration Dashboard — Monitor room occupancy, bookings & maintenance.'
              : 'Resident Student Portal — Manage your room, services, payments and complaints.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>
      </div>

      {toastMsg && <Toast type="success" message={toastMsg} onClose={() => setToastMsg('')} />}
      {error && <Toast type="error" message={error} onClose={() => setError('')} />}

      {/* ADMIN DASHBOARD VIEW */}
      {isAdmin && data?.stats && (
        <>
          {/* Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Rooms"
              value={data.stats.totalRooms}
              subtext={`${data.stats.occupiedBeds} occupied / ${data.stats.totalBeds} total beds`}
              icon={BedDouble}
              color="blue"
            />
            <StatCard
              title="Available Beds"
              value={data.stats.availableBeds}
              subtext={`${data.stats.occupancyRate}% hostel occupancy`}
              icon={Users}
              color="emerald"
            />
            <StatCard
              title="Pending Bookings"
              value={data.stats.pendingBookings}
              subtext="Awaiting review & allocation"
              icon={CalendarCheck}
              color="amber"
            />
            <StatCard
              title="Pending Tickets"
              value={data.stats.pendingComplaints}
              subtext={`${data.stats.resolvedComplaints} resolved tickets`}
              icon={AlertCircle}
              color="rose"
            />
          </div>

          {/* Occupancy Progress Bar */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Hostel Capacity & Occupancy Rate
              </span>
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                {data.stats.occupancyRate}% Full
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(data.stats.occupancyRate, 100)}%` }}
              />
            </div>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" /> Add / Manage Rooms
            </Link>
            <Link
              to="/notices"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all hover:scale-105"
            >
              <BellRing className="w-4 h-4" /> Broadcast Notice
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-sm transition-all"
            >
              <Send className="w-4 h-4" /> Open Resident Chat
            </Link>
          </div>

          {/* Two-column overview: Pending Bookings & Maintenance Complaints */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Booking Requests */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-primary-600" />
                  Recent Booking Applications
                </h3>
                <Link to="/bookings" className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  View All
                </Link>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700 mt-2">
                {data.recentBookings && data.recentBookings.length > 0 ? (
                  data.recentBookings.map((b) => (
                    <div key={b._id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {b.student?.name || 'Student'} ({b.student?.studentId || 'ID N/A'})
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Room {b.room?.roomNumber} • {b.room?.block}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : b.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {b.status}
                        </span>
                        {b.status === 'Pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleBookingAction(b._id, 'Approved')}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleBookingAction(b._id, 'Rejected')}
                              className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">No recent bookings recorded.</p>
                )}
              </div>
            </div>

            {/* Recent Complaints */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  Recent Maintenance Tickets
                </h3>
                <Link to="/complaints" className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  View All
                </Link>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700 mt-2">
                {data.recentComplaints && data.recentComplaints.length > 0 ? (
                  data.recentComplaints.map((c) => (
                    <div key={c._id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {c.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {c.category} • Room {c.room?.roomNumber || 'General'}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : c.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">No recent complaints filed.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* STUDENT DASHBOARD VIEW */}
      {!isAdmin && data?.stats && (
        <>
          {/* Assigned Room Card */}
          <div className="bg-gradient-to-br from-primary-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-primary-200">
                  <HomeIcon className="w-3.5 h-3.5" /> Allotted Accommodation
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-3">
                  {data.stats.assignedRoom ? `Room ${data.stats.assignedRoom.roomNumber} (${data.stats.assignedRoom.block})` : 'No Room Assigned Yet'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {data.stats.assignedRoom
                    ? `${data.stats.assignedRoom.type} Sharing • Floor ${data.stats.assignedRoom.floor} • ₹${data.stats.assignedRoom.rentPerMonth} / month`
                    : 'You have not been allocated a room yet. Browse available rooms to apply.'}
                </p>
              </div>

              <div>
                {data.stats.assignedRoom ? (
                  <Link
                    to="/payments"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all hover:scale-105"
                  >
                    <CreditCard className="w-4 h-4" /> Pay Rent Online
                  </Link>
                ) : (
                  <Link
                    to="/rooms"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                  >
                    <BedDouble className="w-4 h-4" /> Apply for Room Now
                  </Link>
                )}
              </div>
            </div>

            {/* Roommates section if assigned */}
            {data.stats.assignedRoom && data.stats.assignedRoom.occupants?.length > 1 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs font-semibold text-primary-200 mb-2">Roommates in your room:</p>
                <div className="flex flex-wrap gap-3">
                  {data.stats.assignedRoom.occupants
                    .filter((occ) => occ._id !== user._id)
                    .map((occ) => (
                      <div
                        key={occ._id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md text-xs"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center font-bold text-[10px]">
                          {occ.name?.charAt(0)}
                        </div>
                        <span>{occ.name}</span>
                        {occ.phone && <span className="text-[10px] text-slate-300">({occ.phone})</span>}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Student quick metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Active Bookings"
              value={data.stats.activeBookings}
              subtext="Approved hostel stay"
              icon={CalendarCheck}
              color="emerald"
            />
            <StatCard
              title="Open Complaints"
              value={data.stats.pendingComplaints}
              subtext={`${data.stats.resolvedComplaints} resolved tickets`}
              icon={AlertCircle}
              color="amber"
            />
            <StatCard
              title="Total Fees Paid"
              value={`₹${data.stats.totalPaid}`}
              subtext="Rent & Mess invoices"
              icon={CreditCard}
              color="purple"
            />
          </div>

          {/* Announcements & Recent Notices */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-indigo-500" />
                Latest Hostel Notices & Announcements
              </h3>
              <Link to="/notices" className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700 mt-2">
              {data.latestNotices && data.latestNotices.length > 0 ? (
                data.latestNotices.map((n) => (
                  <div key={n._id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {n.pinned && <span className="text-amber-500 text-xs">📌</span>}
                        {n.title}
                      </p>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                      {n.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No notices posted yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

