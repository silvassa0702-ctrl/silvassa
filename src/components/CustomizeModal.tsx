import type { KeyboardEvent, MouseEvent } from 'react';
import Icon from './Icon';
import { SIZES } from '../data/menu';
import type { CustomizeState, MenuItem, SizeId } from '../types';
import { assetUrl } from '../utils/assets';
import { getSizeDesc, getUnitPrice } from '../utils/pricing';

interface CustomizeModalProps {
  open: boolean;
  item: MenuItem | null;
  state: CustomizeState | null;
  onClose: () => void;
  onSizeChange: (size: SizeId) => void;
  onQtyChange: (qty: number) => void;
  onSubmit: () => void;
}

export default function CustomizeModal({
  open,
  item,
  state,
  onClose,
  onSizeChange,
  onQtyChange,
  onSubmit,
}: CustomizeModalProps) {
  const size: SizeId = state?.size ?? 'half';
  const qty = state?.qty ?? 1;
  const editing = Boolean(state?.editingKey);
  const unitPrice = item ? getUnitPrice(item.price, size) : 0;
  const total = unitPrice * qty;

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSizeKey = (e: KeyboardEvent<HTMLDivElement>, id: SizeId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSizeChange(id);
    }
  };

  return (
    <div className={`modal-overlay${open ? ' active' : ''}`} aria-hidden={!open} onClick={handleOverlayClick}>
      <div className="modal-card">
        <button className="modal-close-btn" aria-label="Close modal" onClick={onClose}>
          <Icon name="x-lg" />
        </button>

        <div className="modal-header">
          {item && <img src={assetUrl(item.img)} alt={item.name} className="modal-item-img" />}
          <div className="modal-header-info">
            <span className="modal-category-badge">{item?.cat.toUpperCase()}</span>
            <h3>{item?.name}</h3>
            <p>{item?.desc}</p>
            <div className="modal-meta-row">
              <span className="modal-rating-badge">
                <Icon name="star-fill" /> {item ? item.rating.toFixed(1) : '5.0'} (47)
              </span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-section-head">
            <span className="section-label">
              <Icon name="pie-chart" /> Select Portion (Half or Full)
            </span>
            <span className="section-required">Choose 1</span>
          </div>
          <div className="size-options-container">
            {item &&
              SIZES.map((s) => {
                const selected = s.id === size;
                return (
                  <div
                    key={s.id}
                    className={`size-option-card${selected ? ' selected' : ''}`}
                    role="radio"
                    aria-checked={selected}
                    tabIndex={0}
                    onClick={() => onSizeChange(s.id)}
                    onKeyDown={(e) => handleSizeKey(e, s.id)}
                  >
                    <div className="size-option-left">
                      <div className="size-radio-circle"></div>
                      <div>
                        <div className="size-name">{s.name}</div>
                        <div className="size-portion">{getSizeDesc(item.cat, s.id)}</div>
                      </div>
                    </div>
                    <div className="size-price-tag">₹{getUnitPrice(item.price, s.id)}</div>
                  </div>
                );
              })}
          </div>

          <div className="modal-section-head" style={{ marginTop: 18 }}>
            <span className="section-label">Quantity</span>
            <span className="section-sublabel">Select quantity</span>
          </div>
          <div className="modal-qty-container">
            <div className="modal-qty-picker">
              <button
                type="button"
                className="modal-qty-btn"
                aria-label="Decrease"
                onClick={() => qty > 1 && onQtyChange(qty - 1)}
              >
                &minus;
              </button>
              <span className="modal-qty-display">{qty}</span>
              <button
                type="button"
                className="modal-qty-btn"
                aria-label="Increase"
                onClick={() => qty < 99 && onQtyChange(qty + 1)}
              >
                +
              </button>
            </div>
            <div className="modal-price-summary">
              <span className="summary-caption">Selected Price:</span>
              <span className="summary-total">
                <span className="unit-calc">
                  ₹{unitPrice} × {qty} qty ={' '}
                </span>
                <strong>₹{total}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-action-btn" onClick={onSubmit}>
            <span>
              {editing ? (
                <>
                  <Icon name="check2-circle" /> Update Item
                </>
              ) : (
                <>
                  <Icon name="bag-plus" /> Add Item |
                </>
              )}
            </span>
            <span className="modal-btn-price">₹{total}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
