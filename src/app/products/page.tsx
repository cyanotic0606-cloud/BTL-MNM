import base from '@/utils/airtable';

import ProductsList from '@/components/pages/products/products-list';

import isValidArray from '@/utils/isValidArray';

import { notFound, redirect } from 'next/navigation';

import Pagination from '@/components/ui/pagination';

import ProductSort, { SortOption } from '@/components/ui/product-sort';

import { sortProducts } from '@/utils/sort_utils';

import type { Metadata } from 'next';

import { unstable_cache } from 'next/cache'; // <--- KHÔI PHỤC IMPORT NÀY



const ITEMS_PER_PAGE = 12;



// Cache data trong 1 giờ

export const revalidate = 3600;

export const dynamic = 'force-dynamic';



export const metadata: Metadata = {

  title: 'Tất cả sản phẩm | Shopping Web',

  description: 'Khám phá bộ sưu tập sản phẩm đa dạng với giá tốt nhất',

};



// KHÔI PHỤC LẠI UNSTABLE_CACHE VÀ THÊM TAG

const getAllProducts = unstable_cache(

  async () => {

    return await base('products').select({}).all();

  },

  ['all-products'], // Key

  { 

    revalidate: 3600, 

    tags: ['all-products'] // <--- GẮN TAG NÀY

  } 

);



// Valid sort options

const VALID_SORT_OPTIONS: SortOption[] = [

  'default',

  'price-asc',

  'price-desc',

  'name-asc',

  'name-desc',

];



export default async function ProductPage({

  searchParams,

}: {

  searchParams: Promise<{ page?: string; sort?: string }>;

}) {

  const params = await searchParams;



  // Validate page number

  const pageNum = parseInt(params.page || '1', 10);

  if (isNaN(pageNum) || pageNum < 1) {

    redirect('/products?page=1');

  }



  // Validate sort option

  const sortParam = params.sort as SortOption;

  const sortBy = VALID_SORT_OPTIONS.includes(sortParam) ? sortParam : 'default';

  if (params.sort && !VALID_SORT_OPTIONS.includes(sortParam)) {

    redirect('/products?page=1');

  }



  const allData = await getAllProducts();



  if (!isValidArray(allData)) {

    return notFound();

  }



  // Chuyển sang array thường để sort

  const productsArray = [...allData];



  // Sắp xếp trước khi phân trang

  const sortedData = sortProducts(productsArray, sortBy);



  // Tính toán pagination

  const totalItems = sortedData.length;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);



  // Validate page number against total pages

  if (pageNum > totalPages && totalPages > 0) {

    redirect(`/products?page=${totalPages}${sortBy !== 'default' ? `&sort=${sortBy}` : ''}`);

  }



  const currentPage = pageNum;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedData = sortedData.slice(startIndex, endIndex);



  return (

    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">

      <div className="container px-4 mx-auto py-8 md:py-12">

        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Tất cả sản phẩm</h1>

              <p className="text-gray-600 mt-2">

                Khám phá bộ sưu tập sản phẩm của chúng tôi ({totalItems} sản phẩm)

              </p>

            </div>

            <ProductSort />

          </div>

        </div>

        <ProductsList data={JSON.stringify(paginatedData)} />

        <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/products" />

      </div>

    </div>

  );

}