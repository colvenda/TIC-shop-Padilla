'use client';

import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="h-24 w-24 flex-shrink-0 rounded-md bg-slate-100 overflow-hidden">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">Sin imagen</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
        <p className="mt-1 text-lg font-bold text-slate-900">{formatPrice(item.price)}</p>
        <p className="mt-1 text-sm text-slate-500">Subtotal: {formatPrice(item.price * item.quantity)}</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 border border-slate-300 rounded-md">
          <button
            type="button"
            onClick={onDecrease}
            className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 transition-colors"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            type="button"
            onClick={onIncrease}
            className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
