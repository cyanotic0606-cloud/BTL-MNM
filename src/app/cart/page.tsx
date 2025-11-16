import CartList from '@/components/pages/cart/cart-list';

export const dynamic = 'force-dynamic';

export default function Cart() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="container px-4 mx-auto py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Giỏ hàng</h1>
          <p className="text-gray-600 mt-2">Đừng ki bo nữa...</p>
        </div>
        <CartList />
      </div>
    </div>
  );
}
