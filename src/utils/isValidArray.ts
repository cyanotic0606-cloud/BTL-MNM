export default function isValidArray(data: unknown) {
  return data && Array.isArray(data) && data.length > 0;
}
