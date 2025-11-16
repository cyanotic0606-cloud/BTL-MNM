'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'default';

const sortOptions = [
  { value: 'default', label: 'Mặc định' },
  { value: 'name-asc', label: 'Tên: A → Z' },
  { value: 'name-desc', label: 'Tên: Z → A' },
  { value: 'price-asc', label: 'Giá: Thấp → Cao' },
  { value: 'price-desc', label: 'Giá: Cao → Thấp' },
];

export default function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get('sort') as SortOption) || 'default';
  const currentLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || 'Mặc định';

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sortValue === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', sortValue);
    }

    // Reset về trang 1 khi đổi sort
    params.delete('page');

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-gray-300 hover:border-gray-900 hover:bg-gray-50"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">Sắp xếp:</span> {currentLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] border-gray-200 shadow-lg">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={`cursor-pointer ${
              currentSort === option.value
                ? 'bg-gray-900 text-white hover:bg-gray-800 hover:text-white font-medium'
                : 'hover:bg-gray-50'
            }`}
          >
            {option.label}
            {currentSort === option.value && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
