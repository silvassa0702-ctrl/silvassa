export type Category = 'brownie' | 'teacake' | 'icecake' | 'cookies';
export type CategoryFilter = 'all' | Category;
export type SizeId = 'half' | 'full';

export interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: number;
  rating: number;
  cat: Category;
  img: string;
  time: string;
  topSelling?: boolean;
  ingredients?: string;
}

export interface Size {
  id: SizeId;
  name: string;
  factor: number;
}

export interface CartEntry {
  id: number;
  size: SizeId;
  qty: number;
}

/** key: `${itemId}_${sizeId}` */
export type Cart = Record<string, CartEntry>;

export interface CustomizeState {
  itemId: number;
  size: SizeId;
  qty: number;
  editingKey: string | null;
}
