'use client';

import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductQuickView({ product, isOpen, onClose, onAddToCart }: ProductQuickViewProps) {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">Sin imagen</div>
          )}
        </div>

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h2>
          <p className="text-slate-600 mb-4">{product.description}</p>

          <div className="mb-4">
            <span className="text-3xl font-bold text-slate-900">{formatPrice(product.price)}</span>
          </div>

          {product.sellerName && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Vendedor:</span> {product.sellerName}
              </p>
            </div>
          )}

          <div className="mt-auto">
            {onAddToCart && (
              <Button
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full"
              >
                Agregar al carrito
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
