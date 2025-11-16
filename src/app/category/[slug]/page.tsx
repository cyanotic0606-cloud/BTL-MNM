// src/app/category/[slug]/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import base from '@/utils/airtable';
import { notFound, redirect } from 'next/navigation';
import isValidArray from '@/utils/isValidArray';
import ProductsList from '@/components/pages/products/products-list';
import Pagination from '@/components/ui/pagination';
import ProductSort, { SortOption } from '@/components/ui/product-sort';
import { sortProducts } from '@/utils/sort_utils';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

const ITEMS_PER_PAGE = 12;

// Cache data trong 1 giờ (3600 giây)
export const revalidate = 3600;
export const dynamic = 'force-dynamic';

// Valid sort options
const VALID_SORT_OPTIONS: SortOption[] = [
  'default',
  'price-asc',
  'price-desc',
  'name-asc',
  'name-desc',
];

// Cache category lookup để tránh fetch 2 lần
const getCategoryBySlug = unstable_cache(
  async (slug: string) => {
    const categories = await base('categories')
      .select({
        filterByFormula: `{slug} = "${slug}"`,
        maxRecords: 1,
      })
      .firstPage();
    return categories;
  },
  ['category-by-slug'],
  { revalidate: 3600, tags: ['categories'] }
);

// Cache all products
const getAllProducts = unstable_cache(
  async () => {
    return await base('products').select({}).all();
  },
  ['all-products'],
  { revalidate: 3600, tags: ['products'] }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategoryBySlug(slug);

  if (!isValidArray(categories)) {
    return { title: 'Danh mục không tồn tại' };
  }

  const categoryName = categories[0].fields.name as string;
  return {
    title: `${categoryName} | Shopping Web`,
    description: `Khám phá sản phẩm ${categoryName} với giá tốt nhất`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const urlParams = await searchParams;

  // Validate page number
  const pageNum = parseInt(urlParams.page || '1', 10);
  if (isNaN(pageNum) || pageNum < 1) {
    redirect(`/category/${slug}?page=1`);
  }

  // Validate sort option
  const sortParam = urlParams.sort as SortOption;
  const sortBy = VALID_SORT_OPTIONS.includes(sortParam) ? sortParam : 'default';
  if (urlParams.sort && !VALID_SORT_OPTIONS.includes(sortParam)) {
    redirect(`/category/${slug}?page=1`);
  }

  // Fetch category và products song song từ cache
  const [categories, allProducts] = await Promise.all([getCategoryBySlug(slug), getAllProducts()]);

  if (!isValidArray(categories)) {
    return notFound();
  }

  const category = categories[0];
  const categoryId = category.id;
  const categoryName = category.fields.name as string;

  // Filter products theo category
  const products = allProducts.filter((product: any) => {
    const productCategories = product.fields.category;
    return Array.isArray(productCategories) && productCategories.includes(categoryId);
  });

  // Sắp xếp sản phẩm
  const sortedProducts = sortProducts([...products], sortBy);

  // Tính toán pagination
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Validate page number against total pages
  if (pageNum > totalPages && totalPages > 0) {
    redirect(
      `/category/${slug}?page=${totalPages}${sortBy !== 'default' ? `&sort=${sortBy}` : ''}`
    );
  }

  const currentPage = pageNum;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="container px-4 mx-auto py-8 md:py-12 mt-16">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{categoryName}</h1>
              <p className="text-gray-600 mt-2">
                Danh mục: <span className="font-medium">{slug}</span> ({totalItems} sản phẩm)
              </p>
            </div>
            <ProductSort />
          </div>
        </div>

        {!isValidArray(products) ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Chưa có sản phẩm nào trong danh mục này</p>
          </div>
        ) : (
          <>
            <ProductsList data={JSON.stringify(paginatedProducts)} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={`/category/${slug}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
