'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  // Hàm tạo URL giữ nguyên các query params khác (như sort)
  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNum === 1) {
      params.delete('page');
    } else {
      params.set('page', pageNum.toString());
    }
    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Số trang hiển thị tối đa

    if (totalPages <= showPages) {
      // Nếu tổng số trang ít, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic phức tạp hơn cho nhiều trang
      if (currentPage <= 3) {
        // Đầu danh sách
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Cuối danh sách
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Giữa danh sách
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      {/* Nút Previous */}
      <Link
        href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
      >
        <Button
          variant="outline"
          disabled={currentPage === 1}
          className="px-4 py-2 border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-colors"
        >
          ← Trước
        </Button>
      </Link>

      {/* Số trang */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                •••
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link key={pageNum} href={createPageUrl(pageNum)}>
              <Button
                variant={isActive ? 'default' : 'outline'}
                className={`min-w-10 h-10 ${
                  isActive
                    ? 'bg-gray-900 hover:bg-gray-800 text-white border-gray-900'
                    : 'border-gray-300 hover:border-gray-900 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {pageNum}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Nút Next */}
      <Link
        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
      >
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          className="px-4 py-2 border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-colors"
        >
          Tiếp →
        </Button>
      </Link>
    </div>
  );
}
