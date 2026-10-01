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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Tu carrito</h1>
        <span className="text-slate-600">{cart.length} {cart.length === 1 ? 'producto' : 'productos'}</span>
      </div>

      {cart.length === 0 ? (
        <div className="py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="mb-4 text-slate-600 text-lg">Tu carrito está vacío</p>
          <p className="mb-6 text-slate-500">¡Explora nuestra tienda y encuentra lo que necesitas!</p>
          <Link
            href={ROUTES.HOME}
            className="inline-block rounded-md bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
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

          <div className="lg:col-span-1">
            <Card className="sticky top-4 p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Resumen del pedido</h2>
              <div className="mb-4 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} artículos)</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="border-t border-slate-200 pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold text-slate-900">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4 rounded-lg bg-blue-50 p-3">
                <p className="text-sm text-blue-800">
                  💰 Pago contra entrega en Portería Principal
                </p>
              </div>

              <Button type="button" className="w-full py-3 text-lg" onClick={handleCheckout}>
                Proceder al pago
              </Button>

              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full text-sm text-slate-600 hover:text-slate-800 transition-colors"
              >
                Vaciar carrito
              </button>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <Link href={ROUTES.HOME} className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  ← Continuar comprando
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
