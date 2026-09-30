export const CATEGORIES = [
  'all',
  'Útiles escolares',
  'Libros',
  'Uniformes',
  'Tecnología',
  'Deportes',
  'Arte',
  'Snacks',
  'Otros',
] as const;

export type Category = typeof CATEGORIES[number];
