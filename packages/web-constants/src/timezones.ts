/** IANA timezone identifiers with display labels. */
export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Karachi', label: 'Asia/Karachi (PKT, UTC+5)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST, UTC+5:30)' },
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (BST, UTC+6)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST, UTC+4)' },
  { value: 'Asia/Riyadh', label: 'Asia/Riyadh (AST, UTC+3)' },
  { value: 'Asia/Kuwait', label: 'Asia/Kuwait (AST, UTC+3)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT, UTC+8)' },
  { value: 'Asia/Kuala_Lumpur', label: 'Asia/Kuala_Lumpur (MYT, UTC+8)' },
  { value: 'Asia/Colombo', label: 'Asia/Colombo (IST, UTC+5:30)' },
  { value: 'Asia/Kabul', label: 'Asia/Kabul (AFT, UTC+4:30)' },
  { value: 'Asia/Tehran', label: 'Asia/Tehran (IRST, UTC+3:30)' },
  { value: 'Asia/Baghdad', label: 'Asia/Baghdad (AST, UTC+3)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET, UTC+1)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET, UTC+1)' },
  { value: 'Europe/Istanbul', label: 'Europe/Istanbul (TRT, UTC+3)' },
  { value: 'Africa/Cairo', label: 'Africa/Cairo (EET, UTC+2)' },
  { value: 'Africa/Nairobi', label: 'Africa/Nairobi (EAT, UTC+3)' },
  { value: 'America/New_York', label: 'America/New_York (ET, UTC-5/-4)' },
  { value: 'America/Chicago', label: 'America/Chicago (CT, UTC-6/-5)' },
  { value: 'America/Denver', label: 'America/Denver (MT, UTC-7/-6)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PT, UTC-8/-7)' },
  { value: 'America/Toronto', label: 'America/Toronto (ET, UTC-5/-4)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST, UTC+10/+11)' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZST, UTC+12/+13)' },
  { value: 'UTC', label: 'UTC' },
] as const;

export type TimezoneValue = (typeof TIMEZONE_OPTIONS)[number]['value'];

export const DEFAULT_TIMEZONE: TimezoneValue = 'Asia/Karachi';

/** Plain list of timezone value strings. */
export const TIMEZONE_VALUES = TIMEZONE_OPTIONS.map((t) => t.value) as TimezoneValue[];
