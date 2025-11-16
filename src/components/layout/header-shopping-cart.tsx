'use client';

import { AiOutlineShoppingCart } from 'react-icons/ai';
import { clearStateTime, useCartStore } from '@/state/cart-store';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HeaderShoppingCart() {
  const cartStore = useCartStore();

  useEffect(() => {
    const now = new Date().getTime();

    if (cartStore.setupTime) {
      if (now - cartStore.setupTime > clearStateTime) {
        cartStore.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartStore.setupTime]);

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group"
    >
      <AiOutlineShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-gray-700 group-hover:text-gray-900 transition-colors" />
      {cartStore.list.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
          {cartStore.list.length}
        </span>
      )}
    </Link>
  );
}
