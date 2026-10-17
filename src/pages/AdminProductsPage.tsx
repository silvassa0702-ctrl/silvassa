import { useEffect, useState, type FormEvent } from 'react';
import type { Category, Product, ProductStatus } from '../types';
import {
  CATEGORY_LABELS,
  productService,
  validateProductUpload,
  type ProductUploadDraft,
} from '../services/productService';
import { assetUrl } from '../utils/assets';

const emptyDraft = (): ProductUploadDraft => ({
  name: '',
  category: 'brownie',
  description: '',
  imageName: '',
  price: 640,
  status: 'active',
});

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ProductUploadDraft>(emptyDraft);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ message: string; isError?: boolean } | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadProducts = () => {
    void productService.list().then(setProducts);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onFile = (file: File | undefined) => {
    setSelectedFile(file);
    setDraft((d) => ({ ...d, imageName: file?.name ?? '' }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateProductUpload(draft);
    setErrors(nextErrors);
    setNotice(null);
    if (Object.keys(nextErrors).length > 0) return;

    setUploading(true);
    try {
      await productService.createProductWithImage(draft, selectedFile);
      setNotice({
        message: 'Product created and photo successfully uploaded to AWS S3 & stored in database!',
        isError: false,
      });
      setDraft(emptyDraft());
      setSelectedFile(undefined);
      loadProducts();
      setTimeout(() => {
        setOpen(false);
        setNotice(null);
      }, 1500);
    } catch (err) {
      setNotice({
        message: err instanceof Error ? err.message : 'Upload failed. Please check network/S3 settings.',
        isError: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      await productService.setStatus(String(product.id), nextStatus);
      loadProducts();
    } catch {
      // optimistic update fallback
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p)),
      );
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-sub">
            Artisanal catalog stored in PostgreSQL with photos persisted in AWS S3.
          </p>
        </div>
        <button type="button" className="admin-primary-btn" onClick={() => setOpen(true)}>
          Upload Product
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-product-cell">
                    <img
                      src={assetUrl(product.imageUrl)}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/img/cheesecake-brownie.jpg';
                      }}
                    />
                    <div>
                      <strong>{product.name}</strong>
                      <span style={{ fontSize: 11, color: '#718096' }}>
                        ID: {String(product.id).slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </td>
                <td>{CATEGORY_LABELS[product.category] || product.category}</td>
                <td>
                  <span className={`status-pill ${product.status}`}>{product.status}</span>
                </td>
                <td>{new Date(product.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(product)}
                    style={{
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 6,
                      border: '1px solid #cbd5e0',
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    {product.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="admin-modal-overlay" onClick={() => setOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="upload-title">
            <div className="admin-modal-head">
              <h2 id="upload-title">Upload product to S3 &amp; Catalog</h2>
              <button type="button" className="admin-icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                &times;
              </button>
            </div>
            <form className="admin-form" onSubmit={onSubmit} noValidate>
              {notice && (
                <div
                  className="form-banner"
                  style={{
                    backgroundColor: notice.isError ? '#fee2e2' : '#ecfdf5',
                    color: notice.isError ? '#991b1b' : '#065f46',
                    border: `1px solid ${notice.isError ? '#f87171' : '#34d399'}`,
                    padding: '10px 14px',
                    borderRadius: 6,
                    marginBottom: 14,
                  }}
                >
                  {notice.message}
                </div>
              )}

              <label className="form-label" htmlFor="p-name">
                Product name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                id="p-name"
                className={`form-input${errors.name ? ' invalid' : ''}`}
                value={draft.name}
                placeholder="e.g. Belgian Truffle Brownie"
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}

              <label className="form-label" htmlFor="p-cat">
                Category
              </label>
              <select
                id="p-cat"
                className="form-input"
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as Category }))}
              >
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((key) => (
                  <option key={key} value={key}>
                    {CATEGORY_LABELS[key]}
                  </option>
                ))}
              </select>

              <label className="form-label" htmlFor="p-price">
                Base Price (₹)
              </label>
              <input
                id="p-price"
                type="number"
                className="form-input"
                value={draft.price}
                onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
              />

              <label className="form-label" htmlFor="p-desc">
                Description <span style={{ color: 'red' }}>*</span>
              </label>
              <textarea
                id="p-desc"
                className={`form-input${errors.description ? ' invalid' : ''}`}
                rows={3}
                placeholder="Baked fresh with 70% dark Belgian cocoa and salted butter..."
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              />
              {errors.description && <p className="field-error">{errors.description}</p>}

              <label className="form-label" htmlFor="p-image">
                Product Photo (Uploaded to S3) <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                id="p-image"
                className={`form-input${errors.image ? ' invalid' : ''}`}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              {draft.imageName && <p className="field-hint">Selected: {draft.imageName}</p>}
              {errors.image && <p className="field-error">{errors.image}</p>}

              <label className="form-label" htmlFor="p-status">
                Status
              </label>
              <select
                id="p-status"
                className="form-input"
                value={draft.status}
                onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as ProductStatus }))}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="admin-form-actions">
                <button type="button" className="admin-secondary-btn" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn" disabled={uploading}>
                  {uploading ? 'Uploading to S3...' : 'Upload & Save to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
