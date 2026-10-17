import { useEffect, useState } from 'react';
import Icon from './Icon';
import { feedbackService } from '../services/feedbackService';
import { productService } from '../services/productService';
import type { MenuItem } from '../types';

interface FeedbackPageProps {
  onBack: () => void;
  onSubmitSuccess?: () => void;
}

export default function FeedbackPage({ onBack, onSubmitSuccess }: FeedbackPageProps) {
  const [name, setName] = useState('');
  const [dbProducts, setDbProducts] = useState<MenuItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    void productService.listPublic().then((items) => {
      setDbProducts(items);
      if (items.length > 0 && !selectedProduct) {
        setSelectedProduct(items[0].name);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!feedback.trim()) {
      setError('Please share your thoughts or feedback.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      // Connect to backend PostgreSQL database
      await feedbackService.submit({
        customer_name: name.trim(),
        product_name: selectedProduct,
        rating,
        message: feedback.trim(),
      });
      setSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess();
    } catch {
      setError('Failed to submit feedback. Please check your internet connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return 'Loved it! Outstanding 🌟';
      case 4:
        return 'Really Good & Tasty 🍰';
      case 3:
        return 'Average / Satisfactory 🙂';
      case 2:
        return 'Needs Improvement ⚠️';
      case 1:
        return 'Disappointed 🙁';
      default:
        return '';
    }
  };

  return (
    <div className="feedback-page-view">
      {/* Top Banner / Hero */}
      <section className="feedback-hero-section">
        <div className="feedback-hero-overlay" />
        <div className="feedback-hero-content">
          <div className="feedback-top-bar">
            <button className="feedback-back-btn" onClick={onBack} aria-label="Back to Home">
              <Icon name="arrow-left" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="feedback-hero-body">
            <span className="feedback-hero-pill">WE VALUE YOUR VOICE</span>
            <h1 className="feedback-hero-title">
              Share Your Experience with Silvassa
            </h1>
            <p className="feedback-hero-tagline">
              Your honest feedback helps us bake fresher, tastier, and deliver sweeter moments.
            </p>
          </div>
        </div>
      </section>

      {/* Main Feedback Form Container */}
      <main className="feedback-container">
        {submitted ? (
          <div className="feedback-success-card">
            <div className="feedback-success-icon-wrap">
              <Icon name="check-circle-fill" />
            </div>
            <h2 className="feedback-success-title">Thank You, {name}!</h2>
            <p className="feedback-success-desc">
              Your review for <strong>{selectedProduct}</strong> and {rating}-star rating have been safely stored in our database. We review every note to make your next treat even better.
            </p>
            <div className="feedback-success-actions">
              <button
                type="button"
                className="feedback-btn-primary"
                onClick={onBack}
              >
                <span>Back to Menu</span>
                <Icon name="arrow-right" />
              </button>
              <button
                type="button"
                className="feedback-btn-secondary"
                onClick={() => {
                  setName('');
                  setFeedback('');
                  setRating(5);
                  setSubmitted(false);
                }}
              >
                <span>Submit Another Review</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="feedback-card">
            <div className="feedback-card-header">
              <span className="feedback-step-badge">Quick Review</span>
              <h2 className="feedback-card-title">How was your treat?</h2>
              <p className="feedback-card-sub">
                Tell us what you enjoyed or what we can do better.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="feedback-form">
              {error && (
                <div className="feedback-error-banner" role="alert">
                  <Icon name="emoji-frown" />
                  <span>{error}</span>
                </div>
              )}

              {/* Star Rating Section */}
              <div className="feedback-form-group">
                <label className="feedback-label">
                  Rate Your Experience <span className="req-star">*</span>
                </label>
                <div className="feedback-star-selector" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        className={`feedback-star-btn ${active ? 'active' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${star} star`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="feedback-star-svg"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
                <div className="feedback-rating-badge">
                  {getRatingLabel(hoverRating || rating)}
                </div>
              </div>

              {/* Name Field */}
              <div className="feedback-form-group">
                <label htmlFor="feedback-name" className="feedback-label">
                  Your Name <span className="req-star">*</span>
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  className="feedback-input"
                  placeholder="e.g. Ananya Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="name"
                  required
                />
              </div>

              {/* Product Added / Ordered Field */}
              <div className="feedback-form-group">
                <label htmlFor="feedback-product" className="feedback-label">
                  Which Product / Treat Did You Try? <span className="req-star">*</span>
                </label>
                <select
                  id="feedback-product"
                  className="feedback-input"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  style={{ background: '#fff', cursor: 'pointer' }}
                >
                  {dbProducts.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name} ({item.cat.toUpperCase()})
                    </option>
                  ))}
                  <option value="General Bakery Experience">General Bakery &amp; Delivery Experience</option>
                </select>
              </div>

              {/* Feedback Message */}
              <div className="feedback-form-group">
                <label htmlFor="feedback-text" className="feedback-label">
                  Your Thoughts &amp; Feedback <span className="req-star">*</span>
                </label>
                <textarea
                  id="feedback-text"
                  rows={4}
                  className="feedback-textarea"
                  placeholder="What did you think of the flavor, texture, packaging, or delivery? Any suggestions?"
                  value={feedback}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                    if (error) setError('');
                  }}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="feedback-form-actions">
                <button type="submit" className="feedback-submit-btn" disabled={submitting}>
                  <span>{submitting ? 'Saving to Database...' : 'Send Feedback'}</span>
                  <Icon name="arrow-right" />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
