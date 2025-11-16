'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PiShoppingBagOpen, PiTruck, PiShieldCheck } from 'react-icons/pi';
import isValidArray from '@/utils/isValidArray';
import { getProductPrice } from '@/utils/product_utils';

export default function Homepage(props: { data: any }) {
  const parsed = typeof props.data === 'string' ? JSON.parse(props.data) : props.data;
  const shopTitle: string = parsed?.shopTitle ?? 'ThapCamStore';
  const shopSubtitle: string = parsed?.shopSubtitle ?? 'Chất lượng - Giá tốt - Giao hàng nhanh';
  const airtableProducts = parsed?.products;

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="container px-4 mx-auto pt-8 md:pt-16 pb-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Chỗ này cho thằng Vũ đặt tên
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">{shopSubtitle}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12">
              <Link
                href="/products"
                className="px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white text-gray-900 rounded-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                Giới thiệu
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto md:mx-0">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <PiTruck className="w-6 h-6 text-gray-700" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Giao hàng nhanh</div>
                  <div className="text-sm text-gray-600">Toàn quốc</div>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <PiShieldCheck className="w-6 h-6 text-gray-700" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Hoàn tiền 100%</div>
                  <div className="text-sm text-gray-600">Nếu lỗi</div>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <PiShoppingBagOpen className="w-6 h-6 text-gray-700" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Chất lượng</div>
                  <div className="text-sm text-gray-600">Đảm bảo</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Featured Image */}
          <div className="flex-1 hidden md:block">
            <div className="relative w-full h-96 bg-gray-100 rounded-2xl overflow-hidden">
              <Image src="/images/cityzen.jpg" alt="ThapCamStore" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container px-4 mx-auto py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
            <p className="text-gray-600 mt-2">Khám phá các sản phẩm hot nhất</p>
          </div>
          <Link
            href="/products"
            className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2 group"
          >
            Xem tất cả
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isValidArray(airtableProducts) ? (
            airtableProducts.slice(0, 8).map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                  {product.fields.images?.[0]?.url ? (
                    <Image
                      src={product.fields.images[0].url}
                      alt={product.fields.name ?? 'Sản phẩm'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Không có hình ảnh</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 font-medium line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors min-h-12">
                    {product.fields.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-900">
                    {getProductPrice(product.fields).toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              Chưa có sản phẩm nào
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
