/** ISO 4217 currency codes and labels. */
export const CURRENCY_OPTIONS = [
  { value: 'PKR', label: 'PKR — Pakistani Rupee' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'AED', label: 'AED — UAE Dirham' },
  { value: 'SAR', label: 'SAR — Saudi Riyal' },
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
  { value: 'MYR', label: 'MYR — Malaysian Ringgit' },
  { value: 'BDT', label: 'BDT — Bangladeshi Taka' },
] as const;

export type CurrencyCode = (typeof CURRENCY_OPTIONS)[number]['value'];

export const DEFAULT_CURRENCY: CurrencyCode = 'PKR';

/** Plain list of currency code strings (for select options that only need values). */
export const CURRENCY_CODES = CURRENCY_OPTIONS.map((c) => c.value) as CurrencyCode[];
