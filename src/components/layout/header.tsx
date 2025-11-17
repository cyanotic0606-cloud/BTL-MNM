// src/components/layout/header.tsx

import Link from 'next/link';
import { Suspense } from 'react';
import HeaderDropdownMenu from './header-dropdown-menu';
import HeaderShoppingCart from './header-shopping-cart';
import SearchInput from './search-input';
import base from '@/utils/airtable';
import { unstable_cache } from 'next/cache';

const getCategories = unstable_cache(
  async () => {
    return await base('Categories')
      .select({
        sort: [{ field: 'name', direction: 'asc' }],
      })
      .firstPage();
  },
  ['header-categories'],
  { revalidate: 3600, tags: ['categories'] }
);

export default async function Header() {
  const categories = await getCategories();

  const categoryFields = categories.map((record) => ({
    id: record.id,
    ...(record.fields as { name: string; slug: string }),
  }));

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 border-b border-gray-200 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 md:h-20 px-4 mx-auto gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-red-700 text-2xl md:text-3xl lg:text-4xl italic font-bold hover:text-red-600 transition-colors shrink-0"
        >
          Hoang Anh -  Vu - Thanh
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors relative group whitespace-nowrap"
          >
            Trang chủ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/products"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors relative group whitespace-nowrap"
          >
            Sản phẩm
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors relative group whitespace-nowrap"
          >
            Giới thiệu
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden lg:flex flex-1 max-w-md">
          <Suspense fallback={<div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />}>
            <SearchInput />
          </Suspense>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 shrink-0">
          <HeaderDropdownMenu categories={categoryFields} />
          <HeaderShoppingCart />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden border-t border-gray-200 px-4 py-3">
        <SearchInput />
      </div>
    </header>
  );
}
