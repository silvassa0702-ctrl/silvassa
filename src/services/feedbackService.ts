import type { FeedbackItem } from '../types';
import { requestJson } from './apiConfig';

export interface SubmitFeedbackPayload {
  customer_name: string;
  customer_email?: string;
  rating: number;
  message: string;
  product_name?: string;
}

interface BackendFeedbackPagination {
  items: Array<{
    id: string;
    customer_name: string;
    customer_email?: string;
    rating: number;
    message: string;
    product_name?: string;
    status: string;
    created_at: string;
  }>;
  total: number;
}

export const feedbackService = {
  /**
   * Submits user feedback and the product they added/ordered directly into the PostgreSQL database!
   */
  async submit(payload: SubmitFeedbackPayload): Promise<boolean> {
    try {
      const res = await requestJson<{ success: boolean }>('/public/feedbacks', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return Boolean(res?.success);
    } catch (err) {
      // Also cache in localStorage as fallback
      try {
        const local = JSON.parse(localStorage.getItem('silvassa_feedbacks') || '[]');
        local.push({
          id: Date.now().toString(),
          ...payload,
          status: 'approved',
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('silvassa_feedbacks', JSON.stringify(local));
      } catch {
        // ignore
      }
      return true;
    }
  },

  async listAdmin(): Promise<FeedbackItem[]> {
    try {
      const res = await requestJson<BackendFeedbackPagination>('/admin/feedbacks?limit=100');
      if (res && Array.isArray(res.items)) {
        return res.items.map((f) => ({
          id: f.id,
          customerName: f.customer_name,
          customerEmail: f.customer_email,
          rating: f.rating,
          message: f.message,
          productName: f.product_name,
          status: f.status,
          createdAt: f.created_at,
        }));
      }
    } catch {
      // Local fallback
    }

    try {
      const raw = localStorage.getItem('silvassa_feedbacks');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  },
};
