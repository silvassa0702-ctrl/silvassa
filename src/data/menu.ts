import type { MenuItem, Size } from '../types';

/**
 * Default empty menu list. All products are dynamically loaded from
 * the PostgreSQL database via productService.listPublic().
 */
export const MENU: MenuItem[] = [];

export const SIZES: Size[] = [
  { id: 'half', name: 'Half Kg', factor: 0.55 },
  { id: 'full', name: '1 Kg', factor: 1.0 },
];
