'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  images?: string[];
}

interface SearchResult {
  products: Product[];
  total: number;
}

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Function to reset search completely
  const resetSearch = useCallback(() => {
    // Clear debounce timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = null;
    }

    // Abort pending fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Reset states
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setIsLoading(false);
  }, []);

  // Reset search khi chuyển trang (pathname hoặc searchParams thay đổi)
  useEffect(() => {
    resetSearch();
  }, [pathname, searchParams, resetSearch]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tìm kiếm với debounce
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Abort previous fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    // Yêu cầu ít nhất 2 ký tự
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceTimeout.current = setTimeout(async () => {
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      try {
        console.log('🔍 Client: Searching for:', query);
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: abortControllerRef.current.signal,
        });

        console.log('📡 Client: Response status:', response.status);

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data: SearchResult = await response.json();
        console.log('📦 Client: Received data:', data);
        setResults(data.products.slice(0, 5)); // Hiển thị tối đa 5 kết quả
        setIsOpen(true);
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('🚫 Search request aborted');
          return;
        }
        console.error('❌ Client: Search error:', error);
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    resetSearch();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white hover:border-gray-300 transition-colors text-sm md:text-base"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 animate-spin" />
          )}
        </div>
      </form>

      {/* Dropdown kết quả */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
          <div className="p-2">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                {product.images && product.images.length > 0 && product.images[0] ? (
                  <div className="relative w-14 h-14 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-900 font-semibold mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 p-2">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors"
            >
              Xem tất cả kết quả →
            </Link>
          </div>
        </div>
      )}

      {/* Không có kết quả */}
      {isOpen && !isLoading && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg p-4 z-50">
          <p className="text-gray-500 text-sm text-center">Không tìm thấy sản phẩm phù hợp</p>
        </div>
      )}
    </div>
  );
}
