import type { KeyboardEvent } from 'react';
import Icon from './Icon';

interface FloatingCartBarProps {
  count: number;
  onClick: () => void;
}

export default function FloatingCartBar({ count, onClick }: FloatingCartBarProps) {
  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`floating-cart-bar${count > 0 ? ' active' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="View Cart"
      onClick={onClick}
      onKeyDown={handleKey}
    >
      <div className="floating-cart-content">
        <div className="floating-cart-info">
          <span className="floating-cart-title">
            {count} {count === 1 ? 'Item' : 'Items'} added
          </span>
        </div>
        <div className="floating-cart-action">
          <span>View Cart</span>
          <Icon name="chevron-right" />
        </div>
      </div>
    </div>
  );
}
