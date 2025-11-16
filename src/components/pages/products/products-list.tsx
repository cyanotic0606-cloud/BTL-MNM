'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import isValidArray from '@/utils/isValidArray';
import { getProductPrice } from '@/utils/product_utils';

export default function ProductsList(props: { data: any }) {
  const data = JSON.parse(props.data);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((product: any, index: number) => (
        <Fragment key={index}>
          <Link href={`/products/${product.id}`}>
            <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="relative overflow-hidden bg-gray-100">
                <ProductImage product={product} />
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 font-medium line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors min-h-12">
                  {product.fields.name}
                </h3>
                <p className="text-lg font-bold text-gray-900">
                  {getProductPrice(product.fields).toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          </Link>
        </Fragment>
      ))}
    </div>
  );
}

const ProductImage = ({ product }: { product: any }) => {
  if (!isValidArray(product.fields?.images)) {
    return (
      <div className="aspect-square w-full flex items-center justify-center bg-gray-100">
        <span className="text-gray-400 text-sm">Không có hình ảnh</span>
      </div>
    );
  }

  return (
    <div className="aspect-square w-full relative overflow-hidden">
      <Image
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        src={product.fields.images[0].url}
        alt={product.fields.name}
        width={product.fields.images[0].width}
        height={product.fields.images[0].height}
      />
    </div>
  );
};
