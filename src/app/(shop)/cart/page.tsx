'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import CartItem from '@/components/features/CartItem';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }
    router.push(ROUTES.CHECKOUT);
  };

  if (loading) {
    return <p className="py-12 text-center text-gray-600">Cargando...</p>;
  }

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-gray-600">Debes iniciar sesión para ver tu carrito</p>
        <Link
          href={ROUTES.LOGIN}
          className="inline-block rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Tu carrito</h1>

      {cart.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-600">Tu carrito está vacío</p>
          <Link
            href={ROUTES.HOME}
            className="inline-block rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
                onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
                onRemove={() => removeFromCart(item.productId)}
              />
            ))}
          </div>

          <Card className="h-fit p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Resumen</h2>
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>Contraentrega</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <Button type="button" className="w-full py-3" onClick={handleCheckout}>
              Proceder al pago
            </Button>
            <Button type="button" variant="secondary" className="mt-2 w-full py-3" onClick={clearCart}>
              Vaciar carrito
            </Button>
          </Card>
        </div>
      )}
    </>
  );
}
