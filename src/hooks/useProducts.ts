'use client';

import { useCallback, useEffect, useState } from 'react';
import { ProductsService } from '@/services/firebase/products.service';
import { Product } from '@/types';

export function useProducts(sellerId?: string, enabled = true) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (!enabled) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = sellerId
        ? await ProductsService.getProductsBySeller(sellerId)
        : await ProductsService.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [sellerId, enabled]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const createProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    await ProductsService.createProduct(product);
    await loadProducts();
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    await ProductsService.updateProduct(productId, updates);
    await loadProducts();
  };

  const deleteProduct = async (productId: string) => {
    await ProductsService.deleteProduct(productId);
    await loadProducts();
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    reloadProducts: loadProducts,
  };
}
