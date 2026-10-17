import { useEffect } from 'react';
import Icon from './Icon';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SuccessModal({ open, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fullscreen-success-screen" role="dialog" aria-modal="true" aria-label="Enquiry Received">
      {/* Decorative ambient background rings */}
      <div className="success-ambient-circle success-ambient-1" aria-hidden="true" />
      <div className="success-ambient-circle success-ambient-2" aria-hidden="true" />

      {/* Top close button to easily return */}
      <button
        className="success-screen-close-btn"
        aria-label="Close success screen"
        onClick={onClose}
      >
        <Icon name="x-lg" />
      </button>

      <div className="fullscreen-success-content">
        {/* Animated Checkmark Circle (Google Pay style) */}
        <div className="gpay-check-wrapper">
          <div className="gpay-circle-glow" />
          <div className="gpay-circle-outer">
            <svg
              className="gpay-checkmark-svg"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer stroke path */}
              <circle
                className="gpay-checkmark-circle"
                cx="40"
                cy="40"
                r="36"
                stroke="#079658"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Animated green tick mark */}
              <path
                className="gpay-checkmark-tick"
                d="M24 41.5 L34.5 52 L56 30"
                fill="none"
                stroke="#079658"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Success Message Header */}
        <h1 className="success-screen-title">
          Your Order Has Been Received!
        </h1>

        {/* Success Message Description */}
        <p className="success-screen-desc">
          Thank you for choosing Silvassa. Our team will contact you shortly to confirm your order and delivery details.
        </p>

        {/* Action Button */}
        <div className="success-screen-actions">
          <button
            type="button"
            className="success-screen-done-btn"
            onClick={onClose}
          >
            <span>Continue Browsing</span>
            <Icon name="arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
