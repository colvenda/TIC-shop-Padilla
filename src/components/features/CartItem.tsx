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
    <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md">
      <div className="h-24 w-24 flex-shrink-0 rounded-md bg-gray-200">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className="h-full w-full rounded-md object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">Sin imagen</div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="mt-2 text-lg font-bold text-blue-600">{formatPrice(item.price)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrease}
          className="h-8 w-8 rounded-md bg-gray-200 transition-colors hover:bg-gray-300"
        >
          -
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          type="button"
          onClick={onIncrease}
          className="h-8 w-8 rounded-md bg-gray-200 transition-colors hover:bg-gray-300"
        >
          +
        </button>
      </div>

      <Button type="button" variant="ghost" className="text-red-600 hover:text-red-700" onClick={onRemove}>
        Eliminar
      </Button>
    </div>
  );
}
