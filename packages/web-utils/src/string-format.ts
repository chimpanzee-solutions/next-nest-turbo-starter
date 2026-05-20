export function getInitials(value: string, maxParts = 2): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxParts)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function capitalize(value: string): string {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
