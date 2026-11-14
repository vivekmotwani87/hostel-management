import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import Toast from '../components/common/Toast';
import {
  CreditCard,
  Plus,
  Receipt,
  Download,
  CheckCircle,
  Building2,
  Calendar,
  DollarSign,
  Printer,
} from 'lucide-react';

export default function Payments() {
  const { user, isAdmin } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Make Payment Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: 6000,
    type: 'Rent',
    paymentMethod: 'UPI',
    billingMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
  });
  const [processing, setProcessing] = useState(false);

  // Receipt Modal
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/payments');
      if (res.data.success) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payment records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleMakePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await api.post('/payments', formData);
      if (res.data.success) {
        setToastMsg('Payment completed! Transaction recorded successfully.');
        setPaymentModalOpen(false);
        fetchPayments();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const openReceipt = (payment) => {
    setSelectedPayment(payment);
    setReceiptModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            Hostel Fee & Invoicing Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage rent payments, mess subscriptions, security deposit receipts, and transaction histories.
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={() => setPaymentModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Pay Fees Online
          </button>
        )}
      </div>

      {toastMsg && <Toast type="success" message={toastMsg} onClose={() => setToastMsg('')} />}
      {error && <Toast type="error" message={error} onClose={() => setError('')} />}

      {/* Payment History List */}
      {loading ? (
        <Loader text="Loading payment records..." />
      ) : payments.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No payments recorded yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Invoices and fee transactions will appear here once processed.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div
              key={p._id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">
                      ₹{p.amount.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {p.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Invoice: <span className="font-mono text-slate-700 dark:text-slate-200">{p.invoiceNumber}</span> • Tx: <span className="font-mono">{p.transactionId}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Student: <strong>{p.student?.name}</strong> • Billing Month: {p.billingMonth}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Via {p.paymentMethod}
                </span>
                <button
                  onClick={() => openReceipt(p)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5" /> View Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MAKE PAYMENT MODAL */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Pay Hostel Fees Online"
      >
        <form onSubmit={handleMakePayment} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Category
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Rent">Monthly Room Rent</option>
              <option value="Mess Fee">Mess / Meal Subscription</option>
              <option value="Security Deposit">Caution / Security Deposit</option>
              <option value="Maintenance Fee">Facility Maintenance Fee</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                min={1}
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Billing Month *
              </label>
              <input
                type="text"
                required
                value={formData.billingMonth}
                onChange={(e) => setFormData({ ...formData, billingMonth: e.target.value })}
                placeholder="November 2026"
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Payment Gateway / Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['UPI', 'Credit Card', 'Net Banking'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: method })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    formData.paymentMethod === method
                      ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-950 dark:border-primary-400 dark:text-primary-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {processing ? 'Processing Payment...' : `Authorize Payment ₹${formData.amount}`}
            </button>
          </div>
        </form>
      </Modal>

      {/* RECEIPT VIEWER MODAL */}
      <Modal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        title="Payment Receipt & Tax Invoice"
      >
        {selectedPayment && (
          <div className="space-y-4 text-xs" id="printable-receipt">
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-white dark:bg-slate-900 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-5 h-5 text-primary-600" /> HostelEase Administration
                  </h4>
                  <p className="text-[11px] text-slate-400">Official Student Accommodation Receipt</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    PAID / VERIFIED
                  </span>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    {selectedPayment.invoiceNumber}
                  </p>
                </div>
              </div>

              {/* Resident & Tx info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 font-semibold">Resident Name:</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{selectedPayment.student?.name}</p>
                  <p className="text-slate-400 mt-2 font-semibold">Student ID:</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{selectedPayment.student?.studentId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">Transaction ID:</p>
                  <p className="font-mono text-slate-800 dark:text-slate-100">{selectedPayment.transactionId}</p>
                  <p className="text-slate-400 mt-2 font-semibold">Date of Payment:</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100">
                    {new Date(selectedPayment.paidAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Line items table */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex justify-between font-semibold text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Fee Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between py-2 text-slate-800 dark:text-slate-100 font-medium">
                  <span>{selectedPayment.type} ({selectedPayment.billingMonth})</span>
                  <span>₹{selectedPayment.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 text-base font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                  <span>Total Settled</span>
                  <span>₹{selectedPayment.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
              <button
                onClick={() => setReceiptModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

