'use client';

import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'danger';
}

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  actionLabel,
  onAction,
  actionVariant = 'primary',
}: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">Sin imagen</div>
        )}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-slate-800 text-xs px-3 py-1.5 rounded-md font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Ver más
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 truncate font-semibold text-slate-900">{product.name}</h3>
        <p className="mb-2 line-clamp-2 text-sm text-slate-600">{product.description}</p>
        {product.sellerName && (
          <p className="mb-2 text-xs text-slate-500">Vendedor: {product.sellerName}</p>
        )}
        <div className="mb-2">
          <span className={`text-xs font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 5 ? 'text-orange-600' : 'text-slate-500'}`}>
            {product.stock === 0 ? 'Agotado' : product.stock < 5 ? `¡Últimos ${product.stock}!` : `Stock: ${product.stock}`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-slate-900">{formatPrice(product.price)}</span>
          {onAddToCart && (
            <Button
              type="button"
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className={product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {product.stock === 0 ? 'Agotado' : 'Agregar'}
            </Button>
          )}
          {actionLabel && onAction && (
            <Button type="button" variant={actionVariant} onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
