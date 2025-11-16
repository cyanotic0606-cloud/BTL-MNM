import { getProductPrice } from './product_utils';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'default';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function sortProducts(products: any[], sortBy: SortOption) {
  if (!products || products.length === 0) return products;

  const sorted = [...products];

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => {
        const nameA = (a.fields.name || '').toLowerCase();
        const nameB = (b.fields.name || '').toLowerCase();
        return nameA.localeCompare(nameB, 'vi');
      });

    case 'name-desc':
      return sorted.sort((a, b) => {
        const nameA = (a.fields.name || '').toLowerCase();
        const nameB = (b.fields.name || '').toLowerCase();
        return nameB.localeCompare(nameA, 'vi');
      });

    case 'price-asc':
      return sorted.sort((a, b) => {
        const priceA = getProductPrice(a.fields);
        const priceB = getProductPrice(b.fields);
        return priceA - priceB;
      });

    case 'price-desc':
      return sorted.sort((a, b) => {
        const priceA = getProductPrice(a.fields);
        const priceB = getProductPrice(b.fields);
        return priceB - priceA;
      });

    default:
      return products; // Giữ nguyên thứ tự mặc định
  }
}
