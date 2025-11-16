'use client';

import { useCartStore } from '@/state/cart-store';
import isValidArray from '@/utils/isValidArray';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ShoppingBag, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default function OrderSuccess() {
  const cartStore = useCartStore();

  if (!isValidArray(cartStore.orderSuccessList))
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <Package className="w-20 h-20 text-gray-300 mx-auto" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Chưa có đơn hàng nào
          </h1>
          <p className="text-gray-600 mb-8">
            Bạn chưa hoàn tất đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
          </p>
          <Link href="/products">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="w-5 h-5" />
              Xem sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    );

  const totalAmount = cartStore.orderSuccessList.reduce(
    (acc, item) => acc + item.product_variant.variant_price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12">
      <div className="container px-4 mx-auto max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 text-lg">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Chi tiết đơn hàng</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {cartStore.orderSuccessList.map((item) => (
              <div key={item.variant_id} className="p-6">
                <div className="flex gap-4">
                  {item.product_variant.variant_image?.url && (
                    <div className="shrink-0">
                      <Image
                        src={item.product_variant.variant_image.url}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Phân loại: {item.product_variant.variant_name}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Số lượng: <span className="font-medium text-gray-900">{item.quantity}</span>
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {(item.product_variant.variant_price * item.quantity).toLocaleString(
                          'vi-VN'
                        )}
                        ₫
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
              <span className="text-2xl font-bold text-gray-900">
                {totalAmount.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              <ShoppingBag className="w-5 h-5" />
              Tiếp tục mua sắm
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
