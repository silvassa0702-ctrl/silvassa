export type Category = 'brownie' | 'teacake' | 'icecake' | 'cookies';
export type CategoryFilter = 'all' | Category;
export type SizeId = 'half' | 'full';

export interface MenuItem {
  id: number | string;
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
  id: number | string;
  size: SizeId;
  qty: number;
}

/** key: `${itemId}_${sizeId}` */
export type Cart = Record<string, CartEntry>;

export interface CustomizeState {
  itemId: number | string;
  size: SizeId;
  qty: number;
  editingKey: string | null;
}

/** Catalog record aligned with the PostgreSQL products table. */
export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: number | string;
  name: string;
  category: Category;
  description: string;
  imageUrl: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

/** Admin user shape for PostgreSQL-backed auth service. */
export type AdminRole = 'admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
}

export type EnquiryConfirmationStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'dispatched'
  | 'completed'
  | 'cancelled';

export interface EnquiryItem {
  productId: number | string;
  productName: string;
  size?: SizeId | string;
  sizeName?: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

/** Cart checkout enquiry / order shown in the admin portal. */
export interface Enquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  location: string;
  items: EnquiryItem[];
  total: number;
  confirmationStatus: EnquiryConfirmationStatus;
  submittedAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface CartEnquiryDetails {
  customerName: string;
  customerPhone: string;
  location: string;
}

export interface AdminSession {
  identifier: string;
  token?: string;
  signedInAt: string;
}

export interface FeedbackItem {
  id: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  message: string;
  productName?: string;
  status: string;
  createdAt: string;
}
