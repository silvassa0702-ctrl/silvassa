import Icon, { type IconName } from './Icon';
import type { CategoryFilter } from '../types';

interface CategoryStripProps {
  active: CategoryFilter;
  onChange: (cat: CategoryFilter) => void;
}

const CATEGORIES: { id: CategoryFilter; label: string; icon: IconName }[] = [
  { id: 'all', label: 'All', icon: 'grid-fill' },
  { id: 'brownie', label: 'Brownies', icon: 'square-fill' },
  { id: 'teacake', label: 'Tea Cakes', icon: 'cup-hot-fill' },
  { id: 'icecake', label: 'Ice Cakes', icon: 'snow' },
  { id: 'cookies', label: 'Cookies', icon: 'circle-fill' },
];

export default function CategoryStrip({ active, onChange }: CategoryStripProps) {
  return (
    <section className="section-wrap" id="categoriesSection">
      <div className="category-strip" id="categoryStrip">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`cat-pill${active === c.id ? ' active' : ''}`}
            onClick={() => onChange(c.id)}
          >
            <Icon name={c.icon} /> {c.label}
          </button>
        ))}
      </div>
    </section>
  );
}
