/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import base from '@/utils/airtable';

// Helper: Normalize Vietnamese text (remove accents)
function normalizeVietnamese(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
}

// Fetch all products with Next.js cache (revalidate every 5 minutes)
const getAllProducts = unstable_cache(
  async () => {
    console.log('🔄 Fetching all products from Airtable...');
    const records = await base('products')
      .select({
        view: 'Grid view',
      })
      .all();
    console.log(`✅ Fetched ${records.length} products`);
    return records;
  },
  ['all-products'], // Cache key
  {
    revalidate: 300, // 5 minutes in seconds
    tags: ['products'],
  }
);

// Simple synonym dictionary (có thể mở rộng)
const SYNONYMS: Record<string, string[]> = {
  áo: ['quần áo', 'quần ao', 'ao quan'],
  giày: ['giay', 'dep', 'dép'],
  laptop: ['may tinh', 'máy tính', 'may tinh xach tay', 'máy tính xách tay'],
  'điện thoại': ['dien thoai', 'dt', 'phone', 'smartphone'],
  nước: ['nuoc', 'nước uống', 'nuoc uong'],
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    // Validation
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ products: [], total: 0 });
    }

    if (query.trim().length < 2) {
      return NextResponse.json({
        products: [],
        total: 0,
        message: 'Vui lòng nhập ít nhất 2 ký tự',
      });
    }

    if (query.length > 100) {
      return NextResponse.json(
        {
          error: 'Từ khóa tìm kiếm quá dài',
        },
        { status: 400 }
      );
    }

    const searchQuery = query.trim().toLowerCase();

    console.log('🔍 Search API called with query:', searchQuery);

    // Normalize query for fuzzy search
    const normalizedQuery = normalizeVietnamese(searchQuery);

    // Get synonyms cho query (giới hạn để tránh quá nhiều variants)
    const queryVariants = [searchQuery];
    if (normalizedQuery !== searchQuery) {
      queryVariants.push(normalizedQuery);
    }

    // Chỉ thêm synonym nếu có exact match
    for (const [key, values] of Object.entries(SYNONYMS)) {
      if (key === searchQuery || normalizeVietnamese(key) === normalizedQuery) {
        queryVariants.push(...values.slice(0, 2)); // Chỉ lấy 2 synonym đầu
        break; // Chỉ match 1 synonym group
      }
    }

    console.log('🔄 Query variants:', queryVariants);

    // Fetch tất cả products từ cache
    const allProducts = await getAllProducts();
    console.log('📦 Total products in cache:', allProducts.length);

    // Filter và ranking với normalize tiếng Việt
    const filteredProducts = allProducts
      .map((record) => {
        const fields = record.fields as {
          name?: string;
          description?: string;
          slug?: string;
          images?: string[];
        };

        const name = (fields.name || '').toLowerCase();
        const normalizedName = normalizeVietnamese(name);

        let score = 0;

        // Check tất cả query variants
        for (const variant of queryVariants) {
          const normalizedVariant = normalizeVietnamese(variant);

          // 1. EXACT MATCH (có dấu hoặc không dấu)
          if (name === variant || normalizedName === normalizedVariant) {
            score = Math.max(score, 100);
            break;
          }

          // 2. STARTS WITH (có dấu hoặc không dấu)
          if (name.startsWith(variant) || normalizedName.startsWith(normalizedVariant)) {
            score = Math.max(score, 80);
            break;
          }

          // 3. CONTAINS (có dấu hoặc không dấu) - KEY: tìm "chay" → "chày"
          if (name.includes(variant) || normalizedName.includes(normalizedVariant)) {
            score = Math.max(score, 60);
            break;
          }
        }

        return { record, score };
      })
      .filter((item) => item.score > 0) // Chỉ lấy có match
      .sort((a, b) => b.score - a.score)
      .slice(0, 50) // Limit kết quả
      .map((item) => item.record);

    console.log('✅ Filtered products found:', filteredProducts.length);

    // Map kết quả và validate dữ liệu
    const validProducts = filteredProducts
      .slice(0, 30) // Giảm xuống 30 để nhanh hơn
      .map((record) => {
        const fields = record.fields as {
          name?: string;
          description?: string;
          slug?: string;
          images?: Array<{ url?: string; thumbnails?: any }> | string[];
          variant_price?: number[];
          variant_image?: string[];
        };

        // Validate required fields
        if (
          !fields.name ||
          !Array.isArray(fields.variant_price) ||
          fields.variant_price.length === 0
        ) {
          return null;
        }

        // Get lowest price from variants
        const price = Math.min(...fields.variant_price);

        // Generate slug if not exists (for display purposes only)
        const slug =
          fields.slug ||
          fields.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Process images - Airtable returns array of attachment objects
        let imageUrls: string[] = [];
        if (Array.isArray(fields.images)) {
          imageUrls = fields.images
            .map((img) => {
              // If it's an Airtable attachment object
              if (typeof img === 'object' && img !== null && 'url' in img) {
                return img.url || '';
              }
              // If it's already a string
              if (typeof img === 'string') {
                return img;
              }
              return '';
            })
            .filter((url) => url && url.trim() !== '');
        }

        return {
          id: record.id, // Airtable record ID - dùng cho URL
          name: fields.name,
          slug: slug, // For display only
          price: price,
          description: fields.description || '',
          images: imageUrls,
        };
      })
      .filter((product): product is NonNullable<typeof product> => product !== null);

    console.log('📤 Returning products:', validProducts.length);

    return NextResponse.json({
      products: validProducts,
      total: validProducts.length,
    });
  } catch (error) {
    console.error('❌ Search API Error:', error);

    // Don't expose internal errors to client
    return NextResponse.json(
      {
        error: 'Có lỗi xảy ra khi tìm kiếm',
        products: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
