'use client';

import { CATEGORIES } from '@/constants/categories';

const categoryIcons: Record<string, string> = {
  'all': '🏠',
  'Tecnología': '💻',
  'Ropa': '👕',
  'Libros': '📚',
  'Deportes': '⚽',
  'Hogar': '🏠',
  'Juguetes': '🧸',
  'Música': '🎵',
  'Arte': '🎨',
};

interface CategoryGridProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryGrid({ selectedCategory, onCategoryChange }: CategoryGridProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Categorías</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
              selectedCategory === category
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-blue-300'
            }`}
          >
            <span className="text-3xl mb-2">{categoryIcons[category] || '📦'}</span>
            <span className="text-sm font-medium text-slate-700">
              {category === 'all' ? 'Todas' : category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
