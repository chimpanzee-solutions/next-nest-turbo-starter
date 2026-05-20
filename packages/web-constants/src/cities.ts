/** City select options grouped by country code. Pakistan is the only supported country for now. */
export const CITY_OPTIONS_BY_COUNTRY = {
  PK: [
    { value: 'Karachi', label: 'Karachi' },
    { value: 'Lahore', label: 'Lahore' },
    { value: 'Islamabad', label: 'Islamabad' },
    { value: 'Rawalpindi', label: 'Rawalpindi' },
    { value: 'Faisalabad', label: 'Faisalabad' },
    { value: 'Multan', label: 'Multan' },
    { value: 'Peshawar', label: 'Peshawar' },
    { value: 'Quetta', label: 'Quetta' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Gujranwala', label: 'Gujranwala' },
    { value: 'Sialkot', label: 'Sialkot' },
    { value: 'Bahawalpur', label: 'Bahawalpur' },
    { value: 'Sargodha', label: 'Sargodha' },
    { value: 'Abbottabad', label: 'Abbottabad' },
    { value: 'Sukkur', label: 'Sukkur' },
    { value: 'Larkana', label: 'Larkana' },
    { value: 'Mardan', label: 'Mardan' },
    { value: 'Rahim Yar Khan', label: 'Rahim Yar Khan' },
    { value: 'Murree', label: 'Murree' },
    { value: 'Gwadar', label: 'Gwadar' },
  ],
} as const;

export type SupportedCityCountryCode = keyof typeof CITY_OPTIONS_BY_COUNTRY;

export const PAKISTAN_CITY_OPTIONS = CITY_OPTIONS_BY_COUNTRY.PK;

export type PakistanCityValue = (typeof PAKISTAN_CITY_OPTIONS)[number]['value'];
