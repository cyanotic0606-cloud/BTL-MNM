/* eslint-disable @typescript-eslint/no-explicit-any */
import isValidArray from '@/utils/isValidArray';

export const getProductPrice = (productFields: any): number | any => {
  if (!isValidArray(productFields.variant_image)) return 0;
  if (!isValidArray(productFields.variant_price)) return 0;
  return productFields.variant_price.sort((a: number, b: number) => a - b)[0];
};

export const getProductVariants = (productFields: any) => {
  const keys: string[] = [
    'variants',
    'images',
    'record_id',
    'variant_price',
    'variant_image',
    'variant_name',
    'variant_inhouse',
    'variant_id',
  ];

  const rs: any[] = [];
  Array(productFields.variants.length)
    .fill(null)
    .forEach((_, index: number) => {
      const obj: any = {};
      keys.forEach((key) => {
        obj[key] = productFields[key] ? productFields[key][index] : null;
      });
      rs.push(obj);
    });
  return rs || [null];
};

export const resolveRichText = (text: any): string => {
  // Handle null, undefined, empty cases
  if (!text) return '';

  // Convert to string safely
  let result = String(text);

  // Replace all escaped characters - keep newlines for marked to handle
  result = result
    .replace(/\\\\/g, '\\') // Double backslash -> single backslash
    .replace(/\\n/g, '\n') // Escaped \n -> actual newline
    .replace(/\\t/g, '    ') // Escaped \t -> 4 spaces
    .replace(/\\r/g, '') // Remove carriage return
    .replace(/\\"/g, '"') // Escaped quotes -> quotes
    .replace(/\\'/g, "'") // Escaped single quotes -> single quotes
    .replace(/\\\//g, '/') // Escaped slash -> slash
    .trim(); // Remove leading/trailing whitespace

  return result;
};
