'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.HOME);
  };

  return (
    <nav className="bg-yellow-400 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href={ROUTES.HOME} className="text-xl font-bold text-blue-900 sm:text-2xl">
            Tienda IE Almirante Padilla
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href={ROUTES.HOME} className="px-2 py-2 font-medium text-blue-900 hover:text-blue-700">
              Inicio
            </Link>

            {user?.role === 'seller' && (
              <Link
                href={ROUTES.SELLER_PRODUCTS}
                className="px-2 py-2 font-medium text-blue-900 hover:text-blue-700"
              >
                Mis productos
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link href={ROUTES.ADMIN} className="px-2 py-2 font-medium text-blue-900 hover:text-blue-700">
                Admin
              </Link>
            )}

            <Link href={ROUTES.CART} className="relative px-2 py-2 font-medium text-blue-900 hover:text-blue-700">
              Carrito
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden font-medium text-blue-900 sm:inline">{user.name}</span>
                <Button type="button" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={ROUTES.LOGIN} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Iniciar sesión
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="hidden rounded-md bg-white px-4 py-2 font-medium text-blue-600 hover:bg-gray-100 sm:inline"
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
