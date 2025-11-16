'use client'; // Component này có click (DropdownMenuTrigger) nên phải là 'use client'

import Link from 'next/link';
import { RxHamburgerMenu } from 'react-icons/rx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 1. Định nghĩa kiểu 'Category' để TypeScript hiểu dữ liệu
interface Category {
  id: string;
  name: string;
  slug: string; // 'slug' mà bạn đã tạo trong Airtable
}

export default function HeaderDropdownMenu({ categories }: { categories: Category[] }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors group outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
        <RxHamburgerMenu className="w-6 h-6 md:w-7 md:h-7 text-gray-700 group-hover:text-gray-900 transition-colors" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 shadow-lg border-gray-200">
        <DropdownMenuLabel className="text-xs font-bold text-gray-900 uppercase tracking-wider px-4 py-3 bg-gray-50">
          Danh mục sản phẩm
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200" />

        <div className="py-2">
          {categories.map((category) => (
            <DropdownMenuItem key={category.id} asChild>
              <Link
                href={`/category/${category.slug}`}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer rounded-none font-medium"
              >
                <span className="mr-3 text-gray-400">▸</span>
                {category.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
