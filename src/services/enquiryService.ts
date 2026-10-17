import { SIZES } from '../data/menu';
import type { Cart, CartEnquiryDetails, Enquiry, EnquiryConfirmationStatus, EnquiryItem, MenuItem } from '../types';
import { getUnitPrice } from '../utils/pricing';
import { requestJson } from './apiConfig';

const STORAGE_KEY = 'silvassa_confirmed_enquiries';
const SEQ_KEY = 'silvassa_enquiry_seq';

const seed: Enquiry[] = [
  {
    id: 'ENQ-1001',
    customerName: 'Priya Sharma',
    customerPhone: '9876543210',
    location: 'Silvassa, Dadra & Nagar Haveli',
    items: [
      {
        productId: 1,
        productName: 'Roasted Nut Fudge Brownie',
        size: 'full',
        sizeName: '1 Kg',
        qty: 2,
        unitPrice: 640,
        lineTotal: 1280,
      },
    ],
    total: 1280,
    confirmationStatus: 'pending',
    submittedAt: '2026-10-12T09:30:00.000Z',
    updatedAt: '2026-10-12T09:30:00.000Z',
  },
];

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function readSeq(): number {
  const raw = localStorage.getItem(SEQ_KEY);
  const n = raw ? Number(raw) : 1002;
  return Number.isFinite(n) ? n : 1002;
}

function writeSeq(n: number): void {
  localStorage.setItem(SEQ_KEY, String(n));
}

function loadEnquiries(): Enquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return [...seed];
    }
    const parsed = JSON.parse(raw) as Enquiry[];
    if (!Array.isArray(parsed)) return [...seed];
    return parsed;
  } catch {
    return [...seed];
  }
}

let enquiries: Enquiry[] = loadEnquiries();
let nextSeq = readSeq();

function persist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
  writeSeq(nextSeq);
  emit();
}

export function subscribeEnquiries(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getEnquiriesSnapshot(): Enquiry[] {
  return enquiries;
}

function isNew(enquiry: Enquiry, now = Date.now()): boolean {
  const submitted = new Date(enquiry.submittedAt).getTime();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return now - submitted <= sevenDays;
}

export interface EnquiryStats {
  total: number;
  totalConfirmed: number;
  newConfirmed: number;
  pending: number;
  inProgress: number;
  dispatched: number;
  completed: number;
  cancelled: number;
}

import { productService } from './productService';

export function cartToEnquiryItems(cart: Cart, menuList?: MenuItem[]): EnquiryItem[] {
  const pool = menuList && menuList.length > 0 ? menuList : productService.getMenuItems();
  return Object.values(cart).flatMap((entry) => {
    const item = pool.find((m) => String(m.id) === String(entry.id));
    if (!item) return [];
    const sizeObj = SIZES.find((s) => s.id === entry.size) ?? SIZES[0];
    const unitPrice = getUnitPrice(item.price, entry.size);
    return [
      {
        productId: item.id,
        productName: item.name,
        size: entry.size,
        sizeName: sizeObj.name,
        qty: entry.qty,
        unitPrice,
        lineTotal: unitPrice * entry.qty,
      },
    ];
  });
}

interface BackendEnquiry {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  location?: string;
  items?: EnquiryItem[];
  total?: number | string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
  };
}

interface BackendEnquiryPagination {
  items: BackendEnquiry[];
  total: number;
}

export const enquiryService = {
  listAll(): Enquiry[] {
    return enquiries;
  },

  listConfirmed(): Enquiry[] {
    return enquiries;
  },

  getById(id: string): Enquiry | null {
    return enquiries.find((item) => item.id === id) ?? null;
  },

  /**
   * Loads live orders from PostgreSQL database and synchronizes with local state.
   */
  async fetchFromBackend(): Promise<Enquiry[]> {
    try {
      const res = await requestJson<BackendEnquiryPagination>('/admin/enquiries?limit=50');
      if (res && Array.isArray(res.items)) {
        const mapped: Enquiry[] = res.items.map((item) => {
          let parsedItems: EnquiryItem[] = [];
          if (Array.isArray(item.items) && item.items.length > 0) {
            parsedItems = item.items;
          } else if (item.product) {
            parsedItems = [
              {
                productId: item.product.id,
                productName: item.product.name,
                qty: 1,
                unitPrice: Number(item.total) || 640,
                lineTotal: Number(item.total) || 640,
              },
            ];
          }

          return {
            id: String(item.id),
            customerName: item.customer_name,
            customerPhone: item.customer_phone,
            location: item.location || 'Silvassa, Dadra & Nagar Haveli',
            items: parsedItems,
            total: Number(item.total) || parsedItems.reduce((acc, curr) => acc + (curr.lineTotal || 0), 0),
            confirmationStatus: (item.status as EnquiryConfirmationStatus) || 'pending',
            notes: item.notes,
            submittedAt: item.created_at,
            updatedAt: item.updated_at,
          };
        });

        if (mapped.length > 0) {
          enquiries = mapped;
          persist();
          return mapped;
        }
      }
    } catch {
      // Offline or unauthenticated fallback to local state
    }
    return enquiries;
  },

  async updateStatus(id: string, status: EnquiryConfirmationStatus, notes?: string): Promise<Enquiry | null> {
    const idx = enquiries.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    const updated: Enquiry = {
      ...enquiries[idx],
      confirmationStatus: status,
      updatedAt: new Date().toISOString(),
      ...(notes !== undefined ? { notes } : {}),
    };
    enquiries[idx] = updated;
    persist();

    // Persist to PostgreSQL database
    try {
      await requestJson(`/admin/enquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (notes !== undefined) {
        await requestJson(`/admin/enquiries/${id}/notes`, {
          method: 'PATCH',
          body: JSON.stringify({ notes }),
        });
      }
    } catch {
      // Backend sync error handled gracefully
    }

    return updated;
  },

  async deleteEnquiry(id: string): Promise<boolean> {
    const prevLen = enquiries.length;
    enquiries = enquiries.filter((item) => item.id !== id);
    if (enquiries.length !== prevLen) {
      persist();
      try {
        await requestJson(`/admin/enquiries/${id}`, {
          method: 'DELETE',
        });
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  },

  getStats(): EnquiryStats {
    const total = enquiries.length;
    const pending = enquiries.filter((item) => item.confirmationStatus === 'pending').length;
    const inProgress = enquiries.filter(
      (item) => item.confirmationStatus === 'in_progress' || item.confirmationStatus === 'confirmed',
    ).length;
    const dispatched = enquiries.filter((item) => item.confirmationStatus === 'dispatched').length;
    const completed = enquiries.filter((item) => item.confirmationStatus === 'completed').length;
    const cancelled = enquiries.filter((item) => item.confirmationStatus === 'cancelled').length;
    const totalConfirmed = enquiries.filter((item) => item.confirmationStatus !== 'cancelled').length;
    const newConfirmed = enquiries.filter((item) => isNew(item)).length;

    return {
      total,
      totalConfirmed,
      newConfirmed,
      pending,
      inProgress,
      dispatched,
      completed,
      cancelled,
    };
  },

  /**
   * Confirms the order from the user's cart, saves all added products into PostgreSQL DB,
   * and preserves local state for immediate feedback.
   */
  async confirmFromCart(details: CartEnquiryDetails, cart: Cart, menuList?: MenuItem[]): Promise<Enquiry | null> {
    const items = cartToEnquiryItems(cart, menuList);
    if (items.length === 0) return null;

    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const tempId = `ENQ-${nextSeq++}`;

    const enquiry: Enquiry = {
      id: tempId,
      customerName: details.customerName.trim(),
      customerPhone: details.customerPhone.trim(),
      location: details.location.trim(),
      items,
      total,
      confirmationStatus: 'pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    enquiries = [enquiry, ...enquiries];
    persist();

    // Save into PostgreSQL database!
    try {
      const summaryMsg = `Customer confirmed cart with ${items.length} items (${items.map((i) => `${i.qty}x ${i.productName}`).join(', ')}). Total: ₹${total}`;
      const res = await requestJson<{ success: boolean; data: { id: string } }>('/public/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: details.customerName.trim(),
          customer_phone: details.customerPhone.trim(),
          location: details.location.trim(),
          items,
          total,
          message: summaryMsg,
        }),
      });

      if (res?.data?.id) {
        // Update local enquiry ID to the real database UUID
        enquiry.id = res.data.id;
        persist();
      }
    } catch {
      // Local fallback preserves order if network is temporarily interrupted
    }

    return enquiry;
  },
};
