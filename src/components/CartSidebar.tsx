import { useEffect, useState, type MouseEvent } from 'react';
import Icon from './Icon';
import { MENU, SIZES } from '../data/menu';
import type { Cart } from '../types';
import { assetUrl } from '../utils/assets';
import { getCartTotalPrice, getUnitPrice } from '../utils/pricing';

interface CartSidebarProps {
  open: boolean;
  cart: Cart;
  onClose: () => void;
  onIncrease: (key: string) => void;
  onDecrease: (key: string) => void;
  onRemove: (key: string) => void;
  onEdit: (key: string) => void;
  onConfirm: () => void;
  onToast: (message: string) => void;
}

const DEFAULT_LOCATION = 'Silvassa, Dadra & Nagar Haveli';

export default function CartSidebar({
  open,
  cart,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onEdit,
  onConfirm,
  onToast,
}: CartSidebarProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [locating, setLocating] = useState(false);

  // Reset the checkout form every time the cart is opened
  useEffect(() => {
    if (open) {
      setCheckoutOpen(false);
      setName('');
      setPhone('');
      setLocation('');
    }
  }, [open]);

  const keys = Object.keys(cart);
  const total = getCartTotalPrice(cart);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleBack = () => {
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    if (keys.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setCheckoutOpen(true);
  };

  const handleConfirm = () => {
    if (!phone.trim()) {
      alert('Please enter your phone number.');
      return;
    }
    onConfirm();
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION);
      onToast('Default location set to Silvassa');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then((res) => res.json())
          .then((data: { display_name?: string }) => {
            if (data && data.display_name) {
              setLocation(data.display_name.split(',').slice(0, 3).join(',').trim());
            } else {
              setLocation(`Current Location (${lat}, ${lng})`);
            }
            onToast('Current location detected!');
          })
          .catch(() => {
            setLocation(`Current Location (${lat}, ${lng})`);
            onToast('Current location set!');
          })
          .finally(() => setLocating(false));
      },
      () => {
        setLocation(DEFAULT_LOCATION);
        onToast('Location set to Silvassa');
        setLocating(false);
      },
      { timeout: 8000 },
    );
  };

  return (
    <div className={`cart-overlay${open ? ' active' : ''}`} onClick={handleOverlayClick}>
      <div className="cart-sidebar">
        <div className="cart-header">
          <button className="cart-back-btn" aria-label="Go back to home" onClick={handleBack}>
            <Icon name="arrow-left" />
          </button>
          <h2>Your Cart</h2>
          <span className="cart-header-spacer"></span>
        </div>

        <div className="cart-items">
          {keys.length === 0 ? (
            <div className="cart-empty-msg">Your cart is empty.</div>
          ) : (
            keys.map((key) => {
              const entry = cart[key];
              const item = MENU.find((m) => m.id === entry.id);
              if (!item) return null;
              const sizeObj = SIZES.find((s) => s.id === entry.size) ?? SIZES[0];
              const unitPrice = getUnitPrice(item.price, entry.size);

              return (
                <div className="cart-item" key={key}>
                  <img src={assetUrl(item.img)} className="cart-item-img" alt={item.name} />
                  <div className="cart-item-info">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-variant">
                      <span className="cart-variant-tag">{sizeObj.name}</span>
                      <span className="cart-variant-unit">
                        ₹{unitPrice} × {entry.qty} pcs
                      </span>
                    </div>
                    <div className="cart-item-price">₹{unitPrice * entry.qty}</div>
                    <div className="cart-actions-row">
                      <div className="qty-ctrl">
                        <button title="Decrease" onClick={() => onDecrease(key)}>
                          &minus;
                        </button>
                        <span>{entry.qty}</span>
                        <button title="Increase" onClick={() => onIncrease(key)}>
                          +
                        </button>
                      </div>
                      <button className="cart-modify-btn" onClick={() => onEdit(key)}>
                        <Icon name="pencil-square" /> Modify
                      </button>
                      <button className="cart-del-btn" title="Remove item" onClick={() => onRemove(key)}>
                        <Icon name="trash3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="cart-footer-wrap">
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            {!checkoutOpen && (
              <button className="checkout-btn" onClick={handleCheckout}>
                <span>Checkout |</span>
                <span className="checkout-btn-price">₹{total}</span>
              </button>
            )}

            {checkoutOpen && (
              <div className="checkout-form" style={{ marginTop: 15 }}>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="checkout-input"
                  style={{ marginBottom: 10 }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="checkout-input"
                  style={{ marginBottom: 10 }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <div className="checkout-location-wrap" style={{ position: 'relative', marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Enter delivery address / location"
                    className="checkout-input"
                    style={{ paddingRight: 120 }}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <button
                    type="button"
                    className="use-location-btn"
                    title="Detect Current Location"
                    disabled={locating}
                    onClick={handleUseCurrentLocation}
                  >
                    {locating ? (
                      <>
                        <Icon name="arrow-repeat" /> Locating...
                      </>
                    ) : (
                      <>
                        <Icon name="geo-alt-fill" /> Current
                      </>
                    )}
                  </button>
                </div>

                <button className="confirm-btn" onClick={handleConfirm}>
                  Confirm Enquiry
                </button>
                <p
                  style={{
                    fontSize: 11,
                    color: '#718096',
                    textAlign: 'center',
                    marginTop: 8,
                    fontWeight: 500,
                  }}
                >
                  Silvassa executive will contact you shortly
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
