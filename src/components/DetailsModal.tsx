import type { MouseEvent } from 'react';
import Icon from './Icon';
import type { MenuItem } from '../types';
import { assetUrl } from '../utils/assets';

interface DetailsModalProps {
  open: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onSelectSize: (id: number) => void;
}

const DEFAULT_INGREDIENTS =
  'Premium flour, organic eggs, rich butter, artisan cocoa/vanilla extract, sugar, and our secret touch of love.';

export default function DetailsModal({ open, item, onClose, onSelectSize }: DetailsModalProps) {
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={`modal-overlay${open ? ' active' : ''}`} aria-hidden={!open} onClick={handleOverlayClick}>
      <div className="modal-card details-modal-card">
        <button className="modal-close-btn" aria-label="Close modal" onClick={onClose}>
          <Icon name="x-lg" />
        </button>
        <div className="details-modal-image-wrap">
          {item && <img src={assetUrl(item.img)} alt={item.name} />}
        </div>
        <div className="details-modal-body">
          <h2>{item?.name}</h2>
          <div className="details-meta-row">
            <span className="modal-rating-badge">
              <Icon name="star-fill" /> {item ? item.rating.toFixed(1) : '5.0'} (47)
            </span>
          </div>

          <h4 className="details-section-title">Description</h4>
          <p className="details-text">{item?.desc}</p>

          <h4 className="details-section-title">Ingredients</h4>
          <p className="details-text">{item?.ingredients ?? DEFAULT_INGREDIENTS}</p>

          <div className="details-modal-footer">
            <button className="details-add-btn" onClick={() => item && onSelectSize(item.id)}>
              Select Size &amp; Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
