'use client';

import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'danger';
}

export default function ProductCard({
  product,
  onAddToCart,
  actionLabel,
  onAction,
  actionVariant = 'primary',
}: ProductCardProps) {
  return (
    <Card>
      <div className="relative aspect-square bg-gray-200">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">Sin imagen</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 truncate font-semibold text-gray-900">{product.name}</h3>
        <p className="mb-2 line-clamp-2 text-sm text-gray-600">{product.description}</p>
        {product.sellerName && <p className="mb-2 text-xs text-gray-500">Vendedor: {product.sellerName}</p>}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</span>
          {onAddToCart && (
            <Button type="button" onClick={() => onAddToCart(product)}>
              Agregar
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
