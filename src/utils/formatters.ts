/**
 * Format numbers as Indian Rupees (INR)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹ 0';
  return '₹ ' + amount.toLocaleString('en-IN');
}

/**
 * Format number with comma separators
 */
export function formatNumber(val: number): string {
  if (isNaN(val)) return '0';
  return val.toLocaleString('en-IN');
}

/**
 * Format date string
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}
