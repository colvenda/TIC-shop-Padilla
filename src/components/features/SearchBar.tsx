'use client';

import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/constants/categories';
import { Input } from '@/components/ui/Input';

interface SearchBarProps {
  searchTerm: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  products?: { name: string }[];
}

export default function SearchBar({
  searchTerm,
  category,
  onSearchChange,
  onCategoryChange,
  products = [],
}: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const filtered = products
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((p) => p.name)
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm, products]);

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row relative">
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="shadow-sm"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 transition-colors text-slate-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="rounded-md border border-slate-300 px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-white"
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
