'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  images?: string[];
  description?: string;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!query.trim()) {
        setProducts([]);
        setTotal(0);
        setIsLoading(false);
        return;
      }

      if (query.trim().length < 2) {
        setProducts([]);
        setTotal(0);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        setProducts([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="container px-4 mx-auto py-8 md:py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-gray-700 animate-spin mb-4" />
            <p className="text-gray-600">Đang tìm kiếm...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="container px-4 mx-auto py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-6 h-6 text-gray-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Kết quả tìm kiếm</h1>
          </div>
          {query && (
            <p className="text-gray-600">
              Tìm kiếm cho: <span className="font-semibold text-gray-900">&quot;{query}&quot;</span>
              {total > 0 && (
                <span className="ml-2">
                  - Tìm thấy <span className="font-semibold">{total}</span> sản phẩm
                </span>
              )}
            </p>
          )}
        </div>

        {/* Results */}
        {!query.trim() ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Vui lòng nhập từ khóa để tìm kiếm sản phẩm</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h2>
            <p className="text-gray-600 mb-6">
              Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với &quot;{query}&quot;
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-lg"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {product.images && product.images.length > 0 && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Search className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 font-medium line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors min-h-12">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Gợi ý */}
        {products.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-lg"
            >
              Khám phá thêm sản phẩm khác
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
