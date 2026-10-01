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
  const [deliveryPoint, setDeliveryPoint] = useState('Portería Principal');
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

    if (!deliveryPoint.trim()) {
      alert('Por favor ingresa el punto de entrega');
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
        deliveryAddress: deliveryPoint.trim(),
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
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Finalizar compra</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Información de entrega</h2>
          <label className="mb-1 block text-sm font-medium text-slate-700">Punto de entrega</label>
          <select
            value={deliveryPoint}
            onChange={(event) => setDeliveryPoint(event.target.value)}
            required
            className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Portería Principal">Portería Principal</option>
            <option value="Portería Secundaria">Portería Secundaria</option>
            <option value="Cafetería">Cafetería</option>
            <option value="Biblioteca">Biblioteca</option>
          </select>

          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-800">Pago contra entrega</h3>
            <p className="text-sm text-blue-700">
              Pagarás en efectivo al recibir tu pedido en el punto de entrega seleccionado.
            </p>
          </div>

          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar pedido'}
          </Button>
        </form>

        <Card className="h-fit p-6">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Resumen del pedido</h2>

          <div className="mb-4 space-y-4">
            {cart.reduce((acc, item) => {
              const seller = acc.find(s => s.sellerId === item.sellerId);
              if (seller) {
                seller.items.push(item);
                seller.total += item.price * item.quantity;
              } else {
                acc.push({
                  sellerId: item.sellerId,
                  sellerName: item.sellerName || 'Vendedor',
                  items: [item],
                  total: item.price * item.quantity,
                });
              }
              return acc;
            }, [] as Array<{sellerId: string; sellerName: string; items: typeof cart; total: number}>).map((sellerGroup, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-3">
                <p className="font-medium text-slate-900 mb-2">{sellerGroup.sellerName}</p>
                {sellerGroup.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium text-slate-900 mt-2 pt-2 border-t border-slate-100">
                  <span>Subtotal</span>
                  <span>{formatPrice(sellerGroup.total)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-4">
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
