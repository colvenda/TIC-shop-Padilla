'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { ROUTES } from '@/constants/routes';
import ProductCard from '@/components/features/ProductCard';

export default function SellerProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const { products, loading, deleteProduct } = useProducts(user?.id, user?.role === 'seller');

  if (authLoading || loading) {
    return <p className="py-12 text-center text-gray-600">Cargando productos...</p>;
  }

  if (!user || user.role !== 'seller') {
    return <p className="py-12 text-center text-gray-600">No tienes permiso para acceder a esta página</p>;
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Mis productos</h1>
        <Link
          href={ROUTES.SELLER_PRODUCTS_NEW}
          className="rounded-md bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
        >
          Publicar nuevo producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-600">No has publicado ningún producto</p>
          <Link
            href={ROUTES.SELLER_PRODUCTS_NEW}
            className="inline-block rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Publicar mi primer producto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              actionLabel="Eliminar"
              actionVariant="danger"
              onAction={() => {
                if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                  void deleteProduct(product.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
