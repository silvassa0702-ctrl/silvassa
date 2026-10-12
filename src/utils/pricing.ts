import { MENU, SIZES } from '../data/menu';
import type { Cart, Category, SizeId } from '../types';

export function getSizeDesc(cat: Category, sizeId: SizeId): string {
  if (cat === 'brownie') {
    return sizeId === 'half' ? 'Half portion (~3-4 pcs)' : 'Full portion (~6-8 pcs)';
  }
  if (cat === 'teacake') {
    return sizeId === 'half' ? 'Half loaf portion' : 'Full loaf portion';
  }
  if (cat === 'icecake') {
    return sizeId === 'half' ? 'Half cake (~500g)' : 'Full cake (~1kg)';
  }
  return sizeId === 'half' ? 'Half portion' : 'Full portion';
}

export function getUnitPrice(basePrice: number, sizeId: SizeId): number {
  const size = SIZES.find((s) => s.id === sizeId) ?? SIZES[0];
  return Math.round((basePrice * size.factor) / 10) * 10;
}

export function getItemTotalQty(cart: Cart, itemId: number): number {
  return Object.values(cart)
    .filter((c) => c.id === itemId)
    .reduce((sum, c) => sum + c.qty, 0);
}

export function getCartTotalPieces(cart: Cart): number {
  return Object.values(cart).reduce((sum, c) => sum + c.qty, 0);
}

export function getCartTotalPrice(cart: Cart): number {
  return Object.values(cart).reduce((sum, c) => {
    const item = MENU.find((m) => m.id === c.id);
    return item ? sum + getUnitPrice(item.price, c.size) * c.qty : sum;
  }, 0);
}
