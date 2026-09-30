'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { ROUTES } from '@/constants/routes';
import ProductCard from '@/components/features/ProductCard';
import SearchBar from '@/components/features/SearchBar';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    if (!user) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      sellerId: product.sellerId,
    });
  };

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Tienda IE Almirante Padilla</h1>
      <p className="mb-6 text-gray-600">Compra y vende productos dentro de la comunidad educativa</p>

      <SearchBar
        searchTerm={searchTerm}
        category={category}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
      />

      {loading ? (
        <p className="py-12 text-center text-gray-600">Cargando productos...</p>
      ) : error ? (
        <p className="py-12 text-center text-red-600">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="py-12 text-center text-gray-600">No hay productos disponibles</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}

      {user?.role === 'seller' && (
        <div className="mt-8">
          <Link
            href={ROUTES.SELLER_PRODUCTS_NEW}
            className="inline-block rounded-md bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
          >
            Publicar nuevo producto
          </Link>
        </div>
      )}
    </>
  );
}
