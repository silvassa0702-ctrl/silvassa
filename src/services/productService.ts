import type { Category, MenuItem, Product, ProductStatus } from '../types';
import { requestJson, uploadFormData } from './apiConfig';

export const CATEGORY_LABELS: Record<Category, string> = {
  brownie: 'Brownies',
  teacake: 'Tea Cakes',
  icecake: 'Ice Cakes',
  cookies: 'Cookies',
};

interface BackendProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  price: string | number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BackendProductPagination {
  items: BackendProduct[];
  total: number;
}

// In-memory store for database products
let cachedMenuItems: MenuItem[] = [];
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((l) => l());
}

export const productService = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getMenuItems(): MenuItem[] {
    return cachedMenuItems;
  },

  /**
   * Fetches the real live catalog from the PostgreSQL database (/api/public/products)
   * completely replacing any dummy data.
   */
  async listPublic(): Promise<MenuItem[]> {
    try {
      const res = await requestJson<BackendProductPagination>('/public/products?limit=100');
      if (res && Array.isArray(res.items)) {
        const mapped: MenuItem[] = res.items.map((p) => ({
          id: p.id,
          name: p.name,
          desc: p.description,
          price: Number(p.price) || 500,
          rating: 5.0,
          cat: (p.category as Category) || 'brownie',
          img: p.image_url,
          time: '5 hrs',
          topSelling: p.category === 'brownie' || p.category === 'icecake',
        }));
        cachedMenuItems = mapped;
        notify();
        return mapped;
      }
    } catch {
      // ignore
    }
    return cachedMenuItems;
  },

  async list(): Promise<Product[]> {
    try {
      const res = await requestJson<BackendProductPagination>('/admin/products?limit=100');
      if (res && Array.isArray(res.items)) {
        return res.items.map((p) => ({
          id: p.id,
          name: p.name,
          category: (p.category as Category) || 'brownie',
          description: p.description,
          imageUrl: p.image_url,
          status: (p.status as ProductStatus) || 'active',
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }));
      }
    } catch {
      // ignore
    }
    return [];
  },

  async getById(id: number | string): Promise<Product | null> {
    const all = await this.list();
    return all.find((p) => String(p.id) === String(id)) ?? null;
  },

  async count(): Promise<number> {
    const all = await this.list();
    return all.length;
  },

  /**
   * Uploads the photo directly to AWS S3 via the backend,
   * then saves the new product record into the PostgreSQL database!
   */
  async createProductWithImage(
    draft: ProductUploadDraft,
    imageFile?: File,
  ): Promise<Product> {
    let imageUrl = 'img/cheesecake-brownie.jpg';

    // 1. If an image file was provided, upload it to S3
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      const uploadRes = await uploadFormData<{ success: boolean; image_url: string }>(
        '/admin/products/upload-image',
        formData,
      );
      if (uploadRes?.image_url) {
        imageUrl = uploadRes.image_url;
      }
    }

    // 2. Save product to PostgreSQL database
    const payload = {
      name: draft.name.trim(),
      category: draft.category,
      description: draft.description.trim(),
      image_url: imageUrl,
      price: draft.price ? Number(draft.price) : 600.0,
      status: draft.status,
    };

    const newProd = await requestJson<BackendProduct>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // Refresh public menu cache so customers immediately see the new product
    void this.listPublic();

    return {
      id: newProd.id,
      name: newProd.name,
      category: newProd.category as Category,
      description: newProd.description,
      imageUrl: newProd.image_url,
      status: newProd.status as ProductStatus,
      createdAt: newProd.created_at,
      updatedAt: newProd.updated_at,
    };
  },

  async setStatus(id: string, status: ProductStatus): Promise<void> {
    await requestJson(`/admin/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    void this.listPublic();
  },
};

export interface ProductUploadDraft {
  name: string;
  category: Category;
  description: string;
  imageName: string;
  price?: number | string;
  status: ProductStatus;
}

export function validateProductUpload(draft: ProductUploadDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!draft.name.trim()) errors.name = 'Product name is required.';
  if (!draft.category) errors.category = 'Choose a category.';
  if (!draft.description.trim()) errors.description = 'Description is required.';
  else if (draft.description.trim().length < 12) {
    errors.description = 'Description should be at least 12 characters.';
  }
  if (!draft.imageName) errors.image = 'Choose a product image.';
  if (draft.status !== 'active' && draft.status !== 'inactive') {
    errors.status = 'Choose a status.';
  }
  return errors;
}
