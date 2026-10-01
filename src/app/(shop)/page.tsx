'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { useToastContext } from '@/contexts/ToastContext';
import { ROUTES } from '@/constants/routes';
import ProductCard from '@/components/features/ProductCard';
import SearchBar from '@/components/features/SearchBar';
import CategoryGrid from '@/components/features/CategoryGrid';
import FilterPanel from '@/components/features/FilterPanel';
import ProductQuickView from '@/components/features/ProductQuickView';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('relevant');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();
  const { showToastSuccess, showToastError } = useToastContext();

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.price)) : 10000;

  const handleAddToCart = (product: Product) => {
    if (!user) {
      showToastError('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    if (product.stock === 0) {
      showToastError('Este producto está agotado');
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      sellerId: product.sellerId,
    });
    showToastSuccess(`${product.name} agregado al carrito`);
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">TIC-shop Padilla</h1>
        <p className="text-slate-600">Compra y vende productos dentro de la comunidad educativa</p>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        category={category}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
        products={products}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 flex-shrink-0">
          <FilterPanel
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            maxPrice={maxPrice}
          />
        </aside>

        <div className="flex-1">
          <CategoryGrid selectedCategory={category} onCategoryChange={setCategory} />

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <p className="py-12 text-center text-red-600">{error}</p>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-600">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onQuickView={handleQuickView} />
              ))}
            </div>
          )}

      {user?.role === 'seller' && (
        <div className="mt-8">
          <Link
            href={ROUTES.SELLER_PRODUCTS_NEW}
            className="inline-block rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Publicar nuevo producto
          </Link>
        </div>
      )}
        </div>
      </div>

      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
