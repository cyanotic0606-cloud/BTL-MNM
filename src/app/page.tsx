import Homepage from '@/components/pages/homepage';
import base from '@/utils/airtable';
import type { Metadata } from 'next';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ThapCamStore | Chất lượng - Giá tốt - Giao hàng nhanh',
  description: 'Khám phá bộ sưu tập sản phẩm đa dạng với giá tốt nhất',
};

export default async function Home() {
  const products = await base('products')
    .select({
      filterByFormula: '{featured} = 1',
      maxRecords: 8,
      view: 'Grid view',
    })
    .all();

  const dataForHomepage = {
    products: products,
    shopTitle: 'ThapCamStore',
    shopSubtitle: 'Chất lượng - Giá tốt - Giao hàng nhanh',
  };

  return <Homepage data={JSON.stringify(dataForHomepage)} />;
}
