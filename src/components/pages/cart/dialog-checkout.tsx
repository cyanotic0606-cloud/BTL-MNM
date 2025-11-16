import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { z } from 'zod';
import validator from 'validator';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/state/cart-store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const checkoutFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Ít nhất 2 ký tự',
  }),
  email: z.string().min(1, { message: 'Email là bắt buộc' }).email({
    message: 'Địa chỉ email không hợp lệ',
  }),
  phone: z.string().refine(
    (phone) => {
      return validator.isMobilePhone(phone, 'vi-VN');
    },
    { message: 'Số điện thoại không hợp lệ' }
  ),
  address: z.string().min(10, {
    message: 'Ít nhất 10 ký tự',
  }),
});

export default function DialogCheckout(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const cartStore = useCartStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(values: z.infer<typeof checkoutFormSchema>) {
    setLoading(true);

    try {
      // 1. Chuẩn bị dữ liệu giỏ hàng để gửi đi
      // (Chúng ta cần gửi nhiều thông tin hơn cho API)
      const cartItems = cartStore.list.map((item) => {
        return {
          name: item.product.name + ' - ' + item.product_variant.variant_name, // Cho email
          price: item.product_variant.variant_price,
          quantity: item.quantity,
          variant_id: item.variant_id, // Cho Airtable
        };
      });

      const cartTotal = cartStore.list.reduce(
        (acc, item) => acc + item.product_variant.variant_price * item.quantity,
        0
      );

      if (cartItems.length === 0) {
        toast.error('Giỏ hàng của bạn đang trống');
        setLoading(false);
        return;
      }

      // 2. Gói tất cả dữ liệu vào một đối tượng
      const apiData = {
        values: values, // Dữ liệu từ form (name, email, phone, address)
        cartItems: cartItems, // Dữ liệu giỏ hàng
        cartTotal: cartTotal, // Tổng tiền
      };

      // 3. GỌI API BACKEND (AN TOÀN)
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      // 4. Xử lý kết quả
      if (response.ok && result.success) {
        toast.success('Tạo đơn hàng thành công!');
        cartStore.addSuccessList(); // (Giữ nguyên code của bạn)
        cartStore.reset(); // (Giữ nguyên code của bạn)
        router.push('/cart/order-success'); // (Giữ nguyên code của bạn)
      } else {
        // Hiển thị lỗi từ server
        toast.error(`Lỗi: ${result.error || 'Không thể tạo đơn hàng'}`);
      }
    } catch (a) {
      console.log(a);
      toast.error('Đã có lỗi xảy ra, vui lòng thử lại.');
    }

    setLoading(false);
  }

  return (
    <Dialog open={props.open} onOpenChange={(open) => props.onOpenChange(open)}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Thông tin giao hàng
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">
                      Họ và tên <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        required
                        placeholder="Nhập họ tên người nhận..."
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">
                      Số điện thoại <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        required
                        placeholder="Nhập số điện thoại..."
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">
                      Email <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={loading}
                        required
                        placeholder="email@example.com"
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">
                      Địa chỉ nhận hàng <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        required
                        placeholder="Nhập địa chỉ chi tiết..."
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Số lượng sản phẩm:</span>
                <span className="font-semibold text-gray-900">
                  {cartStore.list.length} sản phẩm
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                <span className="text-gray-900 font-semibold">Tổng tiền:</span>
                <span className="text-xl font-bold text-gray-900">
                  {cartStore.list
                    .reduce(
                      (acc, item) => acc + item.product_variant.variant_price * item.quantity,
                      0
                    )
                    .toLocaleString('vi-VN')}
                  ₫
                </span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => props.onOpenChange(false)}
                disabled={loading}
                className="border-gray-300 mr-3"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
