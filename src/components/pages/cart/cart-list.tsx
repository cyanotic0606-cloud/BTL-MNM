'use client';

import { TCartItem, useCartStore } from '@/state/cart-store';
import isValidArray from '@/utils/isValidArray';
import Link from 'next/link';
import Image from 'next/image';
import { PiMinus, PiPlus, PiTrash, PiShoppingCartSimple } from 'react-icons/pi';
import DialogCheckout from '@/components/pages/cart/dialog-checkout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';

export default function CartList() {
  const [checkoutDialog, setCheckoutDialog] = React.useState(false);
  const cartStore = useCartStore();

  if (!isValidArray(cartStore.list))
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PiShoppingCartSimple className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
          <Link href="/products">
            <Button size="lg" className="w-full">
              Khám phá sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    );
  const totalAmount = cartStore.list.reduce(
    (acc, item) => acc + item.product_variant.variant_price * item.quantity,
    0
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div className="col-span-6 text-sm font-medium text-gray-700">Sản phẩm</div>
            <div className="col-span-3 text-sm font-medium text-gray-700">Số lượng</div>
            <div className="col-span-3 text-sm font-medium text-gray-700 text-right">Giá</div>
          </div>
          <div className="divide-y divide-gray-100">
            {cartStore.list.map((item) => (
              <div
                key={item.variant_id}
                className="p-4 md:p-6 hover:bg-gray-50/50 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="md:col-span-6">
                    <CartItemInfo cartItem={item} />
                  </div>

                  {/* Quantity Controls */}
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          if (item.quantity > 1) {
                            cartStore.increaseQuantity({
                              variant_id: item.variant_id,
                              quantity: -1,
                            });
                          }
                        }}
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-lg"
                        disabled={item.quantity <= 1}
                      >
                        <PiMinus className="w-4 h-4" />
                      </Button>
                      <Input
                        className="w-16 text-center h-9"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = Number(e.target.value);
                          if (newQuantity > 0) {
                            cartStore.updateQuantity({
                              variant_id: item.variant_id,
                              quantity: newQuantity,
                            });
                          }
                        }}
                        min={1}
                      />
                      <Button
                        onClick={() => {
                          cartStore.increaseQuantity({
                            variant_id: item.variant_id,
                            quantity: 1,
                          });
                        }}
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-lg"
                      >
                        <PiPlus className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          cartStore.deleteCartItem({
                            variant_id: item.variant_id,
                          });
                        }}
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <PiTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-3 md:text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {(item.product_variant.variant_price * item.quantity).toLocaleString('vi-VN')}
                      ₫
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.product_variant.variant_price.toLocaleString('vi-VN')}₫ ×{' '}
                      {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tổng đơn hàng</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span className="font-medium">{totalAmount.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển</span>
              <span className="font-medium">Miễn phí</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-gray-900">
                  {totalAmount.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={() => setCheckoutDialog(true)}>
            Thanh toán
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">Miễn phí giao hàng cho đơn từ 0₫</p>
        </div>
      </div>

      <DialogCheckout open={checkoutDialog} onOpenChange={(open) => setCheckoutDialog(open)} />
    </div>
  );
}

export const CartItemInfo = ({ cartItem }: { cartItem: TCartItem }) => {
  const { product_variant } = cartItem;
  return (
    <div className="flex gap-4">
      {product_variant.variant_image?.url ? (
        <div className="shrink-0">
          <Image
            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg bg-gray-100"
            src={product_variant.variant_image.url}
            alt={product_variant.variant_name}
            width={96}
            height={96}
          />
        </div>
      ) : (
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${product_variant.record_id}`}
          className="font-medium text-gray-900 hover:text-gray-700 line-clamp-2 transition-colors"
        >
          {product_variant.name}
        </Link>
        <p className="text-sm text-gray-600 mt-1">{product_variant.variant_name}</p>
        <p className="text-sm font-medium text-gray-500 mt-1 md:hidden">
          {product_variant.variant_price.toLocaleString('vi-VN')}₫
        </p>
      </div>
    </div>
  );
};
