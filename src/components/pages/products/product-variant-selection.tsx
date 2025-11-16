'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getProductPrice, getProductVariants } from '@/utils/product_utils';
import React, { useState } from 'react';
import Image from 'next/image';
import { PiCheckCircleFill } from 'react-icons/pi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCartStore } from '@/state/cart-store';

export default function ProductVariantSelection(props: { product: any }) {
  const CartStore = useCartStore();
  const product = JSON.parse(props.product);
  const variants: any = getProductVariants(product.fields);

  const [price, setPrice] = useState(Number(getProductPrice(product.fields)));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="text-sm text-gray-600 mb-1">Giá bán</div>
        <div className="text-3xl font-bold text-gray-900">{price.toLocaleString('vi-VN')}₫</div>
      </div>

      {/* Variants */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân loại</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {variants.map((variant: any) => {
            const isSelected = selectedId === variant.variants;
            const inStock = Number(variant.variant_inhouse) > 0;

            return (
              <div
                key={variant.variants}
                className={cn(
                  'group relative bg-white rounded-lg overflow-hidden border transition-all duration-200',
                  inStock ? 'cursor-pointer hover:shadow-sm' : 'opacity-50 cursor-not-allowed',
                  isSelected ? 'border-gray-900 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => {
                  if (inStock) {
                    setPrice(Number(variant.variant_price));
                    setSelectedId(variant.variants);
                  }
                }}
              >
                {variant.variant_image?.url ? (
                  <Image
                    className="w-full aspect-square object-cover bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                    src={variant.variant_image.url}
                    alt={variant.variant_name}
                    width={150}
                    height={150}
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-100" />
                )}
                <div className="p-3">
                  <p
                    className="text-sm font-medium text-gray-900 line-clamp-1"
                    title={variant.variant_name}
                  >
                    {variant.variant_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Kho: {variant.variant_inhouse}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <PiCheckCircleFill className="w-6 h-6 text-gray-900 bg-white rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className="w-full text-lg font-semibold"
        disabled={!selectedId}
        onClick={() => {
          if (!selectedId) {
            toast.error('Vui lòng chọn phân loại sản phẩm');
            return;
          }
          CartStore.add({
            product: {
              name: product.fields.name,
              record_id: product.fields.record_id,
            },
            product_variant: variants.find((v: any) => v.variants === selectedId),
            variant_id: selectedId,
            quantity: 1,
          });
          toast.success('🛒 Thêm vào giỏ hàng thành công', {
            description: `${product.fields.name} - ${
              variants.find((v: any) => v.variants === selectedId)?.variant_name
            }`,
          });
        }}
      >
        {selectedId ? 'Thêm vào giỏ hàng' : 'Chọn loại sản phẩm'}
      </Button>
    </div>
  );
}
