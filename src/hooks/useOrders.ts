'use client';

import { useCallback, useState } from 'react';
import { OrdersService } from '@/services/firebase/orders.service';
import { Order } from '@/types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await OrdersService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('No se pudieron cargar las órdenes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    return OrdersService.createOrder(order);
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    await OrdersService.updateOrder(orderId, updates);
    await loadOrders();
  };

  return { orders, loading, error, createOrder, updateOrder, reloadOrders: loadOrders };
}
