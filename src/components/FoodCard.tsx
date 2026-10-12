import { useState, type CSSProperties, type MouseEvent } from 'react';
import Icon from './Icon';
import type { MenuItem } from '../types';
import { assetUrl } from '../utils/assets';
import { getUnitPrice } from '../utils/pricing';

interface FoodCardProps {
  item: MenuItem;
  index: number;
  qtyInCart: number;
  onOpenDetails: (id: number) => void;
  onOpenCustomize: (id: number) => void;
}

export default function FoodCard({ item, index, qtyInCart, onOpenDetails, onOpenCustomize }: FoodCardProps) {
  const [liked, setLiked] = useState(false);
  void liked;
  const delay = (index * 0.05).toFixed(2);
  const style = { '--delay': `${delay}s` } as CSSProperties;

  const handleHeart = (e: MouseEvent) => {
    e.stopPropagation();
    setLiked((v) => !v);
  };
  void handleHeart;

  const handleAdd = (e: MouseEvent) => {
    e.stopPropagation();
    onOpenCustomize(item.id);
  };

  return (
    <div className="food-card" style={style} onClick={() => onOpenDetails(item.id)}>
      <div className="card-img-wrap">
        <img src={assetUrl(item.img)} alt={item.name} loading="lazy" />
        {item.topSelling && (
          <div className="top-selling-tag">
            <Icon name="star-fill" /> Top Selling
          </div>
        )}
        {/* <div className={`card-heart${liked ? ' liked' : ''}`} onClick={handleHeart}>
          <Icon name="heart" />
        </div> */}
      </div>
      <div className="card-body">
        <div className="card-title-row">
          <h3>{item.name}</h3>
          <div className="card-badges">
            <span className="rating-pill">
              <Icon name="star-fill" /> {item.rating.toFixed(1)} (47)
            </span>
          </div>
        </div>
        <div className="card-meta">{item.desc}</div>
        <div className="card-action-area">
          <div className="card-price-row">
            <div className="card-price-wrap">
              <span className="card-price">₹{getUnitPrice(item.price, 'half')}</span>
              <span className="card-price-sub">Half Kg</span>
            </div>
            <button
              className={`add-btn${qtyInCart > 0 ? ' added' : ''}`}
              aria-label={`Add ${item.name} to cart`}
              onClick={handleAdd}
            >
              {qtyInCart > 0 ? (
                <>
                  <Icon name="check2" /> Added ({qtyInCart})
                </>
              ) : (
                'ADD'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
