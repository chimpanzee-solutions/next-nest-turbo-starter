import { format } from 'date-fns';
import { DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT } from '@repo/web-constants';

export function formatDate(date: Date | string): string {
  return format(new Date(date), DATE_FORMAT);
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), DATETIME_FORMAT);
}

export function formatTime(date: Date | string): string {
  return format(new Date(date), TIME_FORMAT);
}
