'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import Image from 'next/image';
import isValidArray from '@/utils/isValidArray';

export default function ProductImageGallery({
  productData,
}: {
  productData: { name: any; images: any[] };
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, imageId: string) => {
    e.preventDefault();
    const element = document.getElementById(imageId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!isValidArray(productData.images)) {
    return (
      <div className="bg-gray-100 rounded-xl aspect-square flex items-center justify-center">
        <span className="text-gray-400">Không có hình ảnh</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Thumbnails */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="sticky top-24">
          <div className="flex flex-col gap-3">
            {productData.images.map((image: any, index: number) => (
              <a
                href={`#${image.id}`}
                key={image.id}
                onClick={(e) => handleClick(e, image.id)}
                className="block rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-900 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <Image
                  src={image.url}
                  alt={productData.name}
                  width={80}
                  height={80}
                  className="w-full aspect-square object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Images */}
      <div className="lg:col-span-11">
        <div className="flex flex-col gap-4 scroll-smooth">
          {productData.images.map((image: any, index: number) => (
            <div
              key={image.id}
              id={image.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <Image
                className="w-full"
                src={image.url}
                alt={productData.name}
                width={image.width}
                height={image.height}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
