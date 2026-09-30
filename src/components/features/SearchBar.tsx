'use client';

import { CATEGORIES } from '@/constants/categories';
import { Input } from '@/components/ui/Input';

interface SearchBarProps {
  searchTerm: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export default function SearchBar({
  searchTerm,
  category,
  onSearchChange,
  onCategoryChange,
}: SearchBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat === 'all' ? 'Todas las categorías' : cat}
          </option>
        ))}
      </select>
    </div>
  );
}
