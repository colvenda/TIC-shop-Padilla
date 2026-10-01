'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { OrdersService } from '@/services/firebase/orders.service';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  preparing: 'En preparación',
  ready: 'Listo para entrega',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user?.id) return;
    try {
      const buyerOrders = await OrdersService.getOrdersByBuyer(user.id);
      setOrders(buyerOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <p className="py-12 text-center text-slate-600">Cargando pedidos...</p>;
  }

  if (!user) {
    return <p className="py-12 text-center text-slate-600">Debes iniciar sesión para ver tus pedidos</p>;
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-slate-600">No has realizado ningún pedido aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">Pedido #{order.id.slice(-6)}</span>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {order.createdAt?.toLocaleDateString('es-ES')}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-slate-700">{item.name} x{item.quantity}</span>
                      <span className="text-slate-900 font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Punto de entrega:</span>
                    <span className="text-slate-900 font-medium">{order.deliveryAddress}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-slate-600">Total:</span>
                    <span className="text-slate-900 font-bold text-lg">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
