'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { ROUTES } from '@/constants/routes';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { createOrder } = useOrders();
  const router = useRouter();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }

    if (cart.length === 0) {
      router.push(ROUTES.HOME);
      return;
    }

    if (!deliveryAddress.trim()) {
      alert('Por favor ingresa una dirección de entrega');
      return;
    }

    setLoading(true);

    try {
      await createOrder({
        buyerId: user.id,
        buyerName: user.name,
        buyerEmail: user.email,
        items: cart,
        total: cartTotal,
        status: 'pending',
        deliveryAddress: deliveryAddress.trim(),
      });
      clearCart();
      router.push(ROUTES.ORDERS_SUCCESS);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al crear la orden. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <p className="py-12 text-center text-gray-600">Cargando...</p>;
  }

  if (!user) {
    return <p className="py-12 text-center text-gray-600">Debes iniciar sesión para realizar una compra</p>;
  }

  if (cart.length === 0) {
    return <p className="py-12 text-center text-gray-600">Tu carrito está vacío</p>;
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Finalizar compra</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Información de entrega</h2>
          <label className="mb-1 block text-sm font-medium text-gray-700">Dirección de entrega</label>
          <textarea
            value={deliveryAddress}
            onChange={(event) => setDeliveryAddress(event.target.value)}
            required
            rows={3}
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Salón, grado o punto de encuentro en el colegio"
          />

          <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="mb-2 font-semibold text-yellow-800">Pago contra entrega</h3>
            <p className="text-sm text-yellow-700">
              Pagarás en efectivo al recibir tu pedido. El vendedor coordinará la entrega dentro del colegio.
            </p>
          </div>

          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar pedido'}
          </Button>
        </form>

        <Card className="h-fit p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Resumen del pedido</h2>
          <div className="mb-4 space-y-3">
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
