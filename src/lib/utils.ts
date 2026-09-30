export function formatPrice(value: number) {
  return `$${value.toLocaleString('es-CO')}`;
}

export function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate();
  }
  return new Date();
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
