'use client';

import React from 'react';
import Image from 'next/image';

type Props = {
  imageUrl: string;
  name: string;
  title: string;
  desc: string;
};

export default function IntroCard({ imageUrl, name, title, desc }: Props) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-lg bg-white w-120">
      <div className="w-full h-100 bg-gray-100 relative">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>

      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-base text-gray-600">{title}</p>
        <p className="text-sm mt-3 text-gray-700">{desc}</p>
      </div>
    </div>
  );
}
