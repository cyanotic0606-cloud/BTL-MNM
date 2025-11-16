// src/app/api/checkout/route.ts

import { NextResponse } from 'next/server';

import { Resend } from 'resend';

import React from 'react';

import Airtable from "airtable";

import { revalidateTag } from 'next/cache'; // <--- THÊM IMPORT NÀY



// Import Mẫu Email

import { OrderConfirmationEmail } from '@/emails/OrderConfirmation'; 



// === KHỞI TẠO 1 LẦN (AN TOÀN TRÊN SERVER) ===

const resend = new Resend(process.env.RESEND_API_KEY);



const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_ACCESS_TOKEN }).base(

  process.env.AIRTABLE_BASE_ID as string

);

const ordersTable = base(process.env.AIRTABLE_ORDERS_TABLE_NAME as string);

const ordersProductsTable = base('orders-products');

const variantsTable = base('products-variants');

// ===============================================





export async function POST(request: Request) {

  try {

    // ----------------------------------------------------------------

    // BƯỚC A: NHẬN DỮ LIỆU TỪ FRONTEND

    // ----------------------------------------------------------------

    const body = await request.json();

    const { values, cartItems, cartTotal } = body;

    const { name, phone, email, address } = values; 



    if (!values || !cartItems || cartItems.length === 0) {

      return NextResponse.json({ success: false, error: 'Thiếu thông tin' }, { status: 400 });

    }



    // ----------------------------------------------------------------

    // BƯỚC B: KIỂM TRA TỒN KHO

    // ----------------------------------------------------------------

    console.log('Đang kiểm tra tồn kho...');

    const variantIds = cartItems.map((item: any) => item.variant_id);

    const filterFormula = "OR(" + variantIds.map((id: string) => `RECORD_ID() = '${id}'`).join(',') + ")";

    

    const stockRecords = await variantsTable.select({

      filterByFormula: filterFormula,

      fields: ['inhouse', 'name'] // <-- ĐÃ SỬA 'variant_name' THÀNH 'name'

    }).all();



    const recordsToUpdate = [];

    let outOfStockError = '';

    const stockMap = new Map(stockRecords.map(r => [r.id, r.fields]));



    for (const item of cartItems) {

      const stockData = stockMap.get(item.variant_id);

      

      if (!stockData || stockData.inhouse === undefined) {

        outOfStockError = `Không tìm thấy sản phẩm ${item.name}.`;

        break;

      }



      const currentStock = (stockData.inhouse as number) || 0;



      if (currentStock < item.quantity) {

        outOfStockError = `Sản phẩm "${item.name}" chỉ còn ${currentStock} sản phẩm (bạn đang đặt ${item.quantity}).`;

        break;

      }



      recordsToUpdate.push({

        id: item.variant_id,

        fields: {

          'inhouse': currentStock - item.quantity

        }

      });

    }



    if (outOfStockError) {

      console.error('Lỗi tồn kho:', outOfStockError);

      throw new Error(outOfStockError); 

    }



    // ----------------------------------------------------------------

    // BƯỚC C: LƯU VÀO BẢNG 'orders'

    // ----------------------------------------------------------------

    console.log('Đang lưu vào Bảng orders...');

    const newOrderRecord = await ordersTable.create([

      { fields: { 'name': name, 'phone': phone, 'email': email, 'address': address, 'status': 'Pending' } },

    ]);

    const orderId = newOrderRecord[0].id;

    console.log(`Đã lưu orders, ID: ${orderId}`);



    // ----------------------------------------------------------------

    // BƯỚC D: LƯU VÀO BẢNG 'orders-products'

    // ----------------------------------------------------------------

    console.log('Đang lưu vào Bảng orders-products...');

    const orderProductRecords = cartItems.map((item: any) => {

      return {

        fields: {

          price: item.price,

          quantity: item.quantity,

          product_variant: [item.variant_id],

          orders: [orderId],

        },

      };

    });

    await ordersProductsTable.create(orderProductRecords);

    console.log('Đã lưu orders-products');



    // ----------------------------------------------------------------

    // BƯỚC E: CẬP NHẬT TỒN KHO

    // ----------------------------------------------------------------

    console.log('Đang cập nhật tồn kho (trừ kho)...');

    await variantsTable.update(recordsToUpdate);

    console.log('Đã cập nhật tồn kho thành công!');



    // ----------------------------------------------------------------

    // BƯỚC E.2 (MỚI): XÓA CACHE CỦA TRANG SẢN PHẨM

    // ----------------------------------------------------------------
    // @ts-ignore
    revalidateTag('all-products'); // <-- XÓA CACHE DANH SÁCH
    // @ts-ignore
    revalidateTag('products');       // <-- XÓA CACHE CHI TIẾT

    console.log('Đã xóa cache sản phẩm.');

    

    // ----------------------------------------------------------------

    // BƯỚC F: GỬI MAIL "CHẠY THẬT"

    // ----------------------------------------------------------------

    console.log('Đang gửi email thật cho khách hàng:', email);

    await resend.emails.send({

      from: 'Tên Shop Của Bạn <donhang@grocery4everybody.id.vn>',

      to: [email], 

      subject: `Xác nhận đơn hàng #${orderId}`, 

      react: React.createElement(OrderConfirmationEmail, {

        customerName: name,

        orderId: orderId,

        items: cartItems.map((item: any) => ({

            name: item.name, 

            quantity: item.quantity, 

            price: item.price

        })),

        totalPrice: cartTotal,

      }),

    });

    console.log('Đã gửi email thành công cho:', email);



    // ----------------------------------------------------------------

    // BƯỚC G: TRẢ VỀ CHO FRONTEND

    // ----------------------------------------------------------------

    return NextResponse.json({

      success: true,

      message: 'Đặt hàng thành công!',

      orderId: orderId,

    });



  } catch (error) {

    console.error('Lỗi nghiêm trọng:', error);

    return NextResponse.json(

      { success: false, error: (error as Error).message },

      { status: 500 }

    );

  }

}