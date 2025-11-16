import { Suspense } from 'react';
import SearchResults from '@/components/pages/search/search-results';

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
          <div className="container px-4 mx-auto py-8 md:py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-gray-600">Đang tải...</p>
            </div>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
