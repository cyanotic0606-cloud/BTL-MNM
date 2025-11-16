'use client';

import React from 'react';
import IntroCard from '@/components/pages/about/intro-card';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center mt-10">
      <h1 className="text-5xl font-bold mb-8 text-center">Giới thiệu</h1>

      <div className="flex gap-6 mb-10">
        <IntroCard
          imageUrl="/images/aha.jpg"
          name="AN HOÀNG ANH"
          title="RAI"
          desc="Mã sinh viên: 223332813"
        />

        <IntroCard
          imageUrl="/images/nct.jpg"
          name="NGUYỄN CÔNG THÀNH"
          title="RAI"
          desc="Mã sinh viên: 223332850"
        />

        <IntroCard
          imageUrl="/images/ldgv.jpg"
          name="LÊ ĐỖ GIA VŨ"
          title="RAI"
          desc="Mã sinh viên: 223332864"
        />
      </div>
    </div>
  );
}
