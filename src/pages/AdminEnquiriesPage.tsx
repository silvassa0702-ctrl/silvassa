import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Icon from '../components/Icon';
import {
  enquiryService,
  getEnquiriesSnapshot,
  subscribeEnquiries,
} from '../services/enquiryService';
import { feedbackService } from '../services/feedbackService';
import type { Enquiry, EnquiryConfirmationStatus, FeedbackItem } from '../types';

type FilterTab = 'all' | EnquiryConfirmationStatus;

const STATUS_CONFIG: Record<
  EnquiryConfirmationStatus,
  { label: string; step: number; next?: EnquiryConfirmationStatus; nextLabel?: string }
> = {
  pending: { label: 'Pending', step: 1, next: 'in_progress', nextLabel: 'Start Preparing' },
  confirmed: { label: 'Confirmed', step: 2, next: 'in_progress', nextLabel: 'Start Preparing' },
  in_progress: { label: 'Preparing', step: 2, next: 'dispatched', nextLabel: 'Mark Dispatched' },
  dispatched: { label: 'Dispatched', step: 3, next: 'completed', nextLabel: 'Mark Delivered' },
  completed: { label: 'Delivered', step: 4 },
  cancelled: { label: 'Cancelled', step: 0 },
};

const STEPS = [
  { step: 1, label: 'Received' },
  { step: 2, label: 'Preparing' },
  { step: 3, label: 'Dispatched' },
  { step: 4, label: 'Delivered' },
];

export default function AdminEnquiriesPage() {
  useSyncExternalStore(subscribeEnquiries, getEnquiriesSnapshot);
  const rows = enquiryService.listAll();
  const stats = enquiryService.getStats();

  const [activeTab, setActiveTab] = useState<'orders' | 'feedbacks'>('orders');
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  useEffect(() => {
    void enquiryService.fetchFromBackend();
    void feedbackService.listAdmin().then(setFeedbacks);
  }, []);

  const filtered = useMemo(() => {
    let result = [...rows].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    if (filter !== 'all') {
      if (filter === 'in_progress') {
        result = result.filter(
          (r) => r.confirmationStatus === 'in_progress' || r.confirmationStatus === 'confirmed',
        );
      } else {
        result = result.filter((r) => r.confirmationStatus === filter);
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.customerPhone.includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.items.some((item) => item.productName.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [rows, filter, search]);

  const handleStatusChange = async (id: string, newStatus: EnquiryConfirmationStatus) => {
    const updated = await enquiryService.updateStatus(id, newStatus);
    if (selected && selected.id === id && updated) {
      setSelected(updated);
    }
  };

  const handleSaveNotes = async (id: string) => {
    const updated = await enquiryService.updateStatus(id, selected?.confirmationStatus ?? 'pending', editingNotes);
    if (updated) {
      setSelected(updated);
      alert('Notes saved successfully!');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Are you sure you want to delete order ${id}?`)) {
      enquiryService.deleteEnquiry(id);
      if (selected?.id === id) {
        setSelected(null);
      }
    }
  };

  const openDetails = (row: Enquiry) => {
    setSelected(row);
    setEditingNotes(row.notes ?? '');
  };

  const activeStep = selected ? STATUS_CONFIG[selected.confirmationStatus]?.step ?? 1 : 1;
  const isCancelled = selected?.confirmationStatus === 'cancelled';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="admin-page-title">Orders &amp; Customer Feedback</h1>
          <p className="admin-page-sub">
            Review confirmed cart orders with added products and honest customer feedback saved in the database.
          </p>
        </div>
      </div>

      {/* Tab Switcher: Orders vs Feedbacks */}
      <div style={{ display: 'flex', gap: 10, marginTop: 14, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            border: activeTab === 'orders' ? '2px solid #4E9525' : '1px solid #cbd5e0',
            background: activeTab === 'orders' ? '#f0fdf4' : '#fff',
            color: activeTab === 'orders' ? '#15803d' : '#4a5568',
          }}
        >
          Customer Orders &amp; Cart Enquiries ({rows.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('feedbacks')}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            border: activeTab === 'feedbacks' ? '2px solid #4E9525' : '1px solid #cbd5e0',
            background: activeTab === 'feedbacks' ? '#f0fdf4' : '#fff',
            color: activeTab === 'feedbacks' ? '#15803d' : '#4a5568',
          }}
        >
          Customer Reviews &amp; Feedback ({feedbacks.length})
        </button>
      </div>

      {activeTab === 'feedbacks' ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product Tried / Ordered</th>
                <th>Rating</th>
                <th>Feedback Note</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb) => (
                <tr key={fb.id}>
                  <td>
                    <strong>{fb.customerName}</strong>
                    {fb.customerEmail && <div style={{ fontSize: 12, color: '#718096' }}>{fb.customerEmail}</div>}
                  </td>
                  <td>
                    <span className="admin-item-tag">
                      <strong>{fb.productName || 'General Feedback'}</strong>
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#d97706', fontWeight: 800 }}>
                      {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)} ({fb.rating}/5)
                    </span>
                  </td>
                  <td style={{ maxWidth: 350, fontSize: 13, color: '#2d3748', lineHeight: 1.4 }}>
                    {fb.message}
                  </td>
                  <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {feedbacks.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-empty" style={{ padding: '36px 14px' }}>
                    <Icon name="chat-heart-fill" />
                    <p style={{ marginTop: 8 }}>No feedback submitted yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* Top statistics summary */}
          <div className="admin-stats-row">
            <div className="admin-stat-chip">
              <span className="admin-stat-chip-label">Total Orders</span>
              <span className="admin-stat-chip-num">{stats.total}</span>
            </div>
            <div className="admin-stat-chip">
              <span className="admin-stat-chip-label" style={{ color: '#b45309' }}>Pending</span>
              <span className="admin-stat-chip-num" style={{ color: '#b45309' }}>{stats.pending}</span>
            </div>
            <div className="admin-stat-chip">
              <span className="admin-stat-chip-label" style={{ color: '#0369a1' }}>Preparing</span>
              <span className="admin-stat-chip-num" style={{ color: '#0369a1' }}>{stats.inProgress}</span>
            </div>
            <div className="admin-stat-chip">
              <span className="admin-stat-chip-label" style={{ color: '#7e22ce' }}>Dispatched</span>
              <span className="admin-stat-chip-num" style={{ color: '#7e22ce' }}>{stats.dispatched}</span>
            </div>
            <div className="admin-stat-chip">
              <span className="admin-stat-chip-label" style={{ color: '#15803d' }}>Delivered</span>
              <span className="admin-stat-chip-num" style={{ color: '#15803d' }}>{stats.completed}</span>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="admin-filter-bar">
        <div className="admin-filter-pills">
          <button
            type="button"
            className={`admin-filter-btn${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({rows.length})
          </button>
          <button
            type="button"
            className={`admin-filter-btn${filter === 'pending' ? ' active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button
            type="button"
            className={`admin-filter-btn${filter === 'in_progress' ? ' active' : ''}`}
            onClick={() => setFilter('in_progress')}
          >
            Preparing ({stats.inProgress})
          </button>
          <button
            type="button"
            className={`admin-filter-btn${filter === 'dispatched' ? ' active' : ''}`}
            onClick={() => setFilter('dispatched')}
          >
            Dispatched ({stats.dispatched})
          </button>
          <button
            type="button"
            className={`admin-filter-btn${filter === 'completed' ? ' active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Delivered ({stats.completed})
          </button>
          <button
            type="button"
            className={`admin-filter-btn${filter === 'cancelled' ? ' active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({stats.cancelled})
          </button>
        </div>

        <div className="admin-search-wrap">
          <input
            type="search"
            placeholder="Search customer, phone, product..."
            className="admin-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Delivery Location</th>
              <th>Products Selected</th>
              <th>Total</th>
              <th>Submitted</th>
              <th>Progress Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const cleanPhone = row.customerPhone.replace(/\D/g, '');
              const waUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
                `Hello ${row.customerName}! We received your Silvassa order ${row.id}. We are updating your delivery progress.`,
              )}`;

              return (
                <tr key={row.id}>
                  <td>
                    <strong>{row.id}</strong>
                  </td>
                  <td>
                    <div className="admin-customer-info">
                      <span className="admin-customer-name">{row.customerName}</span>
                      <div className="admin-customer-actions">
                        <a href={`tel:${row.customerPhone}`} className="admin-customer-phone" title="Call Customer">
                          {row.customerPhone}
                        </a>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-contact-icon-btn whatsapp"
                          title="Message on WhatsApp"
                        >
                          <Icon name="whatsapp" />
                        </a>
                        <a
                          href={`tel:${row.customerPhone}`}
                          className="admin-contact-icon-btn call"
                          title="Call Customer"
                        >
                          <Icon name="telephone-fill" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td style={{ maxWidth: 200, wordBreak: 'break-word', fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                      <Icon name="geo-alt-fill" />
                      <span>{row.location}</span>
                    </div>
                  </td>
                  <td style={{ maxWidth: 260 }}>
                    {row.items.map((item) => (
                      <span key={`${row.id}-${item.productId}-${item.size}`} className="admin-item-tag">
                        <span>{item.productName}</span>
                        <span className="admin-item-tag-qty">
                          ({item.sizeName} × {item.qty})
                        </span>
                      </span>
                    ))}
                  </td>
                  <td>
                    <strong style={{ fontSize: 15, color: '#163020' }}>₹{row.total}</strong>
                  </td>
                  <td style={{ fontSize: 12, color: '#5d7063' }}>
                    {new Date(row.submittedAt).toLocaleDateString()}{' '}
                    <span style={{ display: 'block', fontSize: 11, color: '#8aa08f' }}>
                      {new Date(row.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td>
                    <select
                      className={`admin-status-select ${row.confirmationStatus}`}
                      value={row.confirmationStatus}
                      onChange={(e) => handleStatusChange(row.id, e.target.value as EnquiryConfirmationStatus)}
                      aria-label="Change order progress status"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">Preparing</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="completed">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-link-btn"
                        onClick={() => openDetails(row)}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        className="admin-action-del-btn"
                        title="Delete Order"
                        onClick={() => handleDelete(row.id)}
                      >
                        <Icon name="trash3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="admin-empty" style={{ padding: '36px 14px' }}>
                  <Icon name="emoji-frown" />
                  <p style={{ marginTop: 8 }}>No enquiries or orders found matching your filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </>
      )}

      {/* Details & Progress Modal */}
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()} role="dialog">
            <div className="admin-modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ margin: 0 }}>{selected.id}</h2>
                <span className={`status-pill ${selected.confirmationStatus}`}>
                  {STATUS_CONFIG[selected.confirmationStatus]?.label ?? selected.confirmationStatus}
                </span>
              </div>
              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Visual Step-by-Step Order Progress Tracker */}
            {!isCancelled ? (
              <div className="order-stepper">
                {STEPS.map((s) => {
                  const isDone = activeStep > s.step;
                  const isCurrent = activeStep === s.step;
                  return (
                    <div
                      key={s.step}
                      className={`order-stepper-item${isDone ? ' completed' : ''}${isCurrent ? ' active' : ''}`}
                    >
                      <div className="order-stepper-circle">
                        {isDone ? <Icon name="check2" /> : s.step}
                      </div>
                      <span className="order-stepper-label">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 16,
                  textAlign: 'center',
                }}
              >
                This order has been marked as Cancelled.
              </div>
            )}

            {/* Quick Advance Button & Status Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 18,
                padding: '12px 14px',
                background: '#f1f7ee',
                borderRadius: 12,
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: '#5d7063', fontWeight: 600, display: 'block' }}>
                  Update Progress Status:
                </span>
                <select
                  className={`admin-status-select ${selected.confirmationStatus}`}
                  value={selected.confirmationStatus}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value as EnquiryConfirmationStatus)}
                  style={{ marginTop: 4 }}
                >
                  <option value="pending">Pending (Received)</option>
                  <option value="in_progress">Preparing (In Progress)</option>
                  <option value="dispatched">Dispatched (Out for Delivery)</option>
                  <option value="completed">Delivered (Completed)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {STATUS_CONFIG[selected.confirmationStatus]?.next && (
                <button
                  type="button"
                  className="admin-advance-btn"
                  onClick={() =>
                    handleStatusChange(
                      selected.id,
                      STATUS_CONFIG[selected.confirmationStatus]!.next as EnquiryConfirmationStatus,
                    )
                  }
                >
                  <Icon name="check2-circle" />
                  {STATUS_CONFIG[selected.confirmationStatus]!.nextLabel}
                </button>
              )}
            </div>

            {/* Customer Information Card */}
            <div className="admin-card-section">
              <div className="admin-card-section-title">Customer Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '8px 12px', fontSize: 13.5 }}>
                <span style={{ color: '#5d7063', fontWeight: 600 }}>Name:</span>
                <span style={{ fontWeight: 700, color: '#163020' }}>{selected.customerName}</span>

                <span style={{ color: '#5d7063', fontWeight: 600 }}>Phone:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <a href={`tel:${selected.customerPhone}`} style={{ color: '#163020', fontWeight: 600 }}>
                    {selected.customerPhone}
                  </a>
                  <a
                    href={`https://wa.me/91${selected.customerPhone.replace(/\D/g, '').slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-contact-icon-btn whatsapp"
                    title="WhatsApp"
                  >
                    <Icon name="whatsapp" />
                  </a>
                  <a
                    href={`tel:${selected.customerPhone}`}
                    className="admin-contact-icon-btn call"
                    title="Call"
                  >
                    <Icon name="telephone-fill" />
                  </a>
                </div>

                <span style={{ color: '#5d7063', fontWeight: 600 }}>Location:</span>
                <span style={{ color: '#163020' }}>{selected.location}</span>

                <span style={{ color: '#5d7063', fontWeight: 600 }}>Submitted:</span>
                <span style={{ color: '#163020' }}>
                  {new Date(selected.submittedAt).toLocaleString()}
                </span>

                {selected.updatedAt && (
                  <>
                    <span style={{ color: '#5d7063', fontWeight: 600 }}>Last Updated:</span>
                    <span style={{ color: '#163020' }}>
                      {new Date(selected.updatedAt).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Selected Products Breakdown */}
            <div className="admin-card-section">
              <div className="admin-card-section-title">Selected Products</div>
              <div className="admin-table-wrap" style={{ border: 'none' }}>
                <table className="admin-table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Portion</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items.map((item) => (
                      <tr key={`${selected.id}-${item.productId}-${item.size}`}>
                        <td>
                          <strong>{item.productName}</strong>
                        </td>
                        <td>{item.sizeName}</td>
                        <td>{item.qty} pcs</td>
                        <td>₹{item.unitPrice}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{item.lineTotal}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'right', fontWeight: 700, fontSize: 14 }}>
                        Grand Total:
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, fontSize: 16, color: '#163020' }}>
                        ₹{selected.total}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="admin-card-section">
              <div className="admin-card-section-title">Admin Notes &amp; Delivery Instructions</div>
              <textarea
                className="admin-notes-textarea"
                rows={3}
                placeholder="Add special instructions, kitchen notes, or customer preferences..."
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  type="button"
                  className="admin-secondary-btn"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                  onClick={() => handleSaveNotes(selected.id)}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

