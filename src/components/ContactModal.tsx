import { useEffect } from 'react';
import Icon from './Icon';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="contact-modal-backdrop" onClick={onClose} aria-hidden={!open}>
      <div
        className="contact-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="contact-modal-close"
          onClick={onClose}
          aria-label="Close contact options"
        >
          <Icon name="x-lg" />
        </button>

        <div className="contact-modal-header">
          <div className="contact-modal-badge">
            <Icon name="chat-heart-fill" />
            <span>WE'D LOVE TO HEAR FROM YOU</span>
          </div>
          <h2 id="contact-modal-title" className="contact-modal-title">
            Connect with Silvassa
          </h2>
          <p className="contact-modal-subtitle">
            Have questions about an order or custom cake? Reach us anytime through your preferred channel.
          </p>
        </div>

        <div className="contact-options-list">
          {/* WhatsApp Option */}
          <a
            href="https://wa.me/919487255660?text=Hello%20Silvassa,%20I%20would%20like%20to%20enquire%20about%20your%20cakes%20and%20pastries."
            target="_blank"
            rel="noopener noreferrer"
            className="contact-opt-row opt-whatsapp"
            onClick={onClose}
          >
            <div className="contact-opt-icon-circle whatsapp-circle">
              <Icon name="whatsapp" />
            </div>
            <div className="contact-opt-details">
              <div className="contact-opt-name-badge">
                <span className="contact-opt-title">WhatsApp Message</span>
                <span className="contact-quick-tag">Fastest</span>
              </div>
              <span className="contact-opt-meta">+91 9487255660 • Instant Chat & Enquiries</span>
            </div>
            <div className="contact-opt-action-arrow">
              <Icon name="chevron-right" />
            </div>
          </a>

          {/* Call Option */}
          <a
            href="tel:+919361840921"
            className="contact-opt-row opt-call"
            onClick={onClose}
          >
            <div className="contact-opt-icon-circle call-circle">
              <Icon name="telephone-fill" />
            </div>
            <div className="contact-opt-details">
              <div className="contact-opt-name-badge">
                <span className="contact-opt-title">Phone Call</span>
              </div>
              <span className="contact-opt-meta">+91 9361840921 • Mon – Sun, 9 AM to 10 PM</span>
            </div>
            <div className="contact-opt-action-arrow">
              <Icon name="chevron-right" />
            </div>
          </a>

          {/* Gmail / Email Option */}
          <a
            href="mailto:silvassa0702@gmail.com?subject=Silvassa%20Enquiry&body=Hi%20Silvassa%20Team,"
            className="contact-opt-row opt-gmail"
            onClick={onClose}
          >
            <div className="contact-opt-icon-circle gmail-circle">
              <Icon name="envelope-fill" />
            </div>
            <div className="contact-opt-details">
              <div className="contact-opt-name-badge">
                <span className="contact-opt-title">Gmail / Email</span>
              </div>
              <span className="contact-opt-meta">silvassa0702@gmail.com • Direct Feedback & Orders</span>
            </div>
            <div className="contact-opt-action-arrow">
              <Icon name="chevron-right" />
            </div>
          </a>
        </div>

        <div className="contact-modal-footer">
          <p>Baked fresh. Delivered with love. 🍰</p>
        </div>
      </div>
    </div>
  );
}
