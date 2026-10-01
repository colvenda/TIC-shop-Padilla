'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { pendingCount, loadPendingCount } = useOrders();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'seller') {
      loadPendingCount(user.id);
    }
  }, [user, loadPendingCount]);

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.HOME);
  };

  return (
    <nav className="bg-slate-900 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href={ROUTES.HOME} className="text-xl font-bold text-white sm:text-2xl">
            TIC-shop Padilla
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href={ROUTES.HOME} className="px-2 py-2 font-medium text-gray-300 hover:text-white transition-colors">
              Inicio
            </Link>

            {user?.role === 'seller' && (
              <>
                <Link
                  href={ROUTES.SELLER_PRODUCTS}
                  className="px-2 py-2 font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Mis productos
                </Link>
                <Link
                  href={ROUTES.SELLER_ORDERS}
                  className="relative px-2 py-2 font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Mis pedidos
                  {pendingCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <Link href={ROUTES.ADMIN} className="px-2 py-2 font-medium text-gray-300 hover:text-white transition-colors">
                Admin
              </Link>
            )}

            <Link href={ROUTES.CART} className="relative px-2 py-2 font-medium text-gray-300 hover:text-white transition-colors">
              Carrito
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user && (
              <>
                <Link href={ROUTES.ORDERS} className="px-2 py-2 font-medium text-gray-300 hover:text-white transition-colors">
                  Mis pedidos
                </Link>
                <Link href={ROUTES.PROFILE} className="px-2 py-2 font-medium text-gray-300 hover:text-white transition-colors">
                  Perfil
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden font-medium text-gray-300 sm:inline">{user.name}</span>
                <Button type="button" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={ROUTES.LOGIN} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">
                  Iniciar sesión
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="hidden rounded-md bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-600 sm:inline transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
