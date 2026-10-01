'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { OrdersService } from '@/services/firebase/orders.service';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
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

export default function SellerOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { orders, loading, loadPendingCount } = useOrders();
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadPendingCount(user.id);
    }
  }, [user, loadPendingCount]);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await OrdersService.updateOrder(orderId, { status });
      await loadPendingCount(user?.id || '');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al actualizar el estado del pedido');
    }
  };

  if (authLoading || loading) {
    return <p className="py-12 text-center text-slate-600">Cargando pedidos...</p>;
  }

  if (!user || user.role !== 'seller') {
    return <p className="py-12 text-center text-slate-600">No tienes permiso para acceder a esta página</p>;
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-slate-600">No tienes pedidos pendientes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold text-slate-900">Pedido #{order.id.slice(-6)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Comprador: {order.buyerName} ({order.buyerEmail})
                  </p>
                  <p className="text-sm text-slate-600 mb-2">
                    Punto de entrega: {order.deliveryAddress}
                  </p>
                  <div className="mb-2 space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm text-slate-700">
                        {item.name} x{item.quantity} - {formatPrice(item.price * item.quantity)}
                      </div>
                    ))}
                  </div>
                  <p className="font-bold text-slate-900">Total: {formatPrice(order.total)}</p>
                </div>

                <div className="flex flex-col gap-2">
                  {order.status === 'pending' && (
                    <>
                      <Button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="text-sm"
                      >
                        En preparación
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="text-sm"
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <Button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="text-sm"
                    >
                      Listo para entrega
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="text-sm"
                    >
                      Entregado
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
