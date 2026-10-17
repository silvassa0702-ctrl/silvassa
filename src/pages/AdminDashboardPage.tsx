import { useEffect, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import {
  enquiryService,
  getEnquiriesSnapshot,
  subscribeEnquiries,
} from '../services/enquiryService';
import { productService } from '../services/productService';

export default function AdminDashboardPage() {
  const enquiries = useSyncExternalStore(subscribeEnquiries, getEnquiriesSnapshot);
  const stats = enquiryService.getStats();
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    void productService.count().then(setProductCount);
    void enquiryService.fetchFromBackend();
  }, []);

  const recentOrders = [...enquiries]
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .slice(0, 5);

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">Live snapshot of menu catalog and customer orders progress.</p>

      {/* Main Stats Cards */}
      <div className="admin-cards">
        <article className="admin-stat-card">
          <p className="admin-stat-label">Total products</p>
          <p className="admin-stat-value">{productCount}</p>
          <Link to="/admin/products">Manage products &rarr;</Link>
        </article>
        <article className="admin-stat-card">
          <p className="admin-stat-label">Total customer orders</p>
          <p className="admin-stat-value">{stats.total}</p>
          <Link to="/admin/enquiries">View all orders &rarr;</Link>
        </article>
        <article className="admin-stat-card">
          <p className="admin-stat-label">Pending / New orders</p>
          <p className="admin-stat-value" style={{ color: '#b45309' }}>{stats.pending}</p>
          <Link to="/admin/enquiries" style={{ color: '#b45309' }}>Review pending &rarr;</Link>
        </article>
        <article className="admin-stat-card">
          <p className="admin-stat-label">In progress / Preparing</p>
          <p className="admin-stat-value" style={{ color: '#0369a1' }}>{stats.inProgress}</p>
          <Link to="/admin/enquiries" style={{ color: '#0369a1' }}>Track kitchen &rarr;</Link>
        </article>
      </div>

      {/* Recent Orders Overview */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, color: '#163020', margin: 0 }}>Recent Customer Orders</h2>
          <Link to="/admin/enquiries" style={{ fontSize: 13, fontWeight: 700, color: '#4E9525' }}>
            View all orders ({enquiries.length}) &rarr;
          </Link>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Delivery Location</th>
                <th>Items</th>
                <th>Total</th>
                <th>Progress Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.id}</strong></td>
                  <td>{row.customerName}</td>
                  <td>{row.customerPhone}</td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.location}
                  </td>
                  <td>
                    {row.items.map((i) => `${i.productName} (${i.sizeName}) × ${i.qty}`).join(', ')}
                  </td>
                  <td><strong>₹{row.total}</strong></td>
                  <td>
                    <span className={`status-pill ${row.confirmationStatus}`}>
                      {row.confirmationStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <Link to="/admin/enquiries" className="admin-link-btn">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="admin-empty" style={{ padding: '24px 12px' }}>
                    <Icon name="emoji-frown" />
                    <p style={{ marginTop: 6 }}>No customer orders placed yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

