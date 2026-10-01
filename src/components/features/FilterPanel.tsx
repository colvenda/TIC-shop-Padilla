'use client';

interface FilterPanelProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  maxPrice: number;
}

export default function FilterPanel({
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
  maxPrice,
}: FilterPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-4">Filtros</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Rango de precio</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Min"
          />
          <span className="text-slate-500">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Max"
          />
        </div>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={priceRange[1]}
          onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
          className="w-full mt-2 accent-blue-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Ordenar por</label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="relevant">Relevancia</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="name">Nombre: A-Z</option>
        </select>
      </div>
    </div>
  );
}
