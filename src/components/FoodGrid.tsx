import Icon from './Icon';
import FoodCard from './FoodCard';
import type { Cart, MenuItem } from '../types';
import { getItemTotalQty } from '../utils/pricing';

interface FoodGridProps {
  items: MenuItem[];
  cart: Cart;
  onOpenDetails: (id: number | string) => void;
  onOpenCustomize: (id: number | string) => void;
}

export default function FoodGrid({ items, cart, onOpenDetails, onOpenCustomize }: FoodGridProps) {
  return (
    <section className="section-wrap" id="foodSection">
      <div className="section-header">
        <h2 className="section-title">See What's Baking</h2>
      </div>

      <div className="food-grid" id="foodGrid">
        {items.map((item, idx) => (
          <FoodCard
            key={item.id}
            item={item}
            index={idx}
            qtyInCart={getItemTotalQty(cart, item.id)}
            onOpenDetails={onOpenDetails}
            onOpenCustomize={onOpenCustomize}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty-state" style={{ display: 'block' }}>
          <Icon name="emoji-frown" />
          <p>No items match your search.</p>
        </div>
      )}
    </section>
  );
}
