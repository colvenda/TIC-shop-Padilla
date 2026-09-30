'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UsersService } from '@/services/firebase/users.service';
import { ProductsService } from '@/services/firebase/products.service';
import { OrdersService } from '@/services/firebase/orders.service';
import { Order, OrderStatus, Product, User } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type AdminTab = 'users' | 'products' | 'orders';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'users') {
          setUsers(await UsersService.getAllUsers());
        } else if (activeTab === 'products') {
          setProducts(await ProductsService.getAllProducts());
        } else {
          setOrders(await OrdersService.getAllOrders());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [user, activeTab]);

  if (authLoading) {
    return <p className="py-12 text-center text-gray-600">Cargando...</p>;
  }

  if (!user || user.role !== 'admin') {
    return <p className="py-12 text-center text-gray-600">No tienes permiso para acceder a esta página</p>;
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Panel de administración</h1>

      <div className="mb-6 flex gap-4">
        {(['users', 'products', 'orders'] as AdminTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-2 font-medium ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab === 'users' ? 'Usuarios' : tab === 'products' ? 'Productos' : 'Órdenes'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-12 text-center text-gray-600">Cargando...</p>
      ) : activeTab === 'users' ? (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Rol
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((userItem) => (
                <tr key={userItem.id}>
                  <td className="whitespace-nowrap px-6 py-4">{userItem.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">{userItem.email}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <select
                      value={userItem.role}
                      onChange={(event) => {
                        const role = event.target.value as User['role'];
                        void UsersService.updateUser(userItem.id, { role }).then(() => {
                          setUsers(users.map((entry) => (entry.id === userItem.id ? { ...entry, role } : entry)));
                        });
                      }}
                      className="rounded border px-2 py-1 text-sm"
                    >
                      <option value="buyer">Comprador</option>
                      <option value="seller">Vendedor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'products' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-1 font-semibold text-gray-900">{product.name}</h3>
              <p className="mb-2 text-sm text-gray-600">{product.description}</p>
              <p className="mb-2 text-lg font-bold text-blue-600">{formatPrice(product.price)}</p>
              <Button
                type="button"
                variant="danger"
                className="w-full"
                onClick={() => {
                  if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
                  void ProductsService.deleteProduct(product.id).then(() => {
                    setProducts(products.filter((item) => item.id !== product.id));
                  });
                }}
              >
                Eliminar
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Comprador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">{order.buyerName}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">{formatPrice(order.total)}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(event) => {
                        const status = event.target.value as OrderStatus;
                        void OrdersService.updateOrder(order.id, { status }).then(() => {
                          setOrders(
                            orders.map((entry) => (entry.id === order.id ? { ...entry, status } : entry))
                          );
                        });
                      }}
                      className="rounded border px-2 py-1 text-sm"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
