import ms from 'ms';

export function parseDurationMs(value: string): number {
  const n = ms(value as never);
  if (typeof n !== 'number') {
    throw new Error(`Invalid duration: ${value}`);
  }
  return n;
}
