'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ProductsService } from '@/services/firebase/products.service';
import { CATEGORIES } from '@/constants/categories';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const productCategories = CATEGORIES.filter((category) => category !== 'all');

export default function NewProductPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(productCategories[0]);
  const [stock, setStock] = useState('1');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const uploadImages = async (): Promise<string[]> => {
    const imageUrls: string[] = [];

    for (const image of images) {
      const formData = new FormData();
      formData.append('file', image);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'No se pudo subir una imagen');
      }
      imageUrls.push(data.url);
    }

    return imageUrls;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!user || user.role !== 'seller') {
      alert('Solo los vendedores pueden publicar productos');
      return;
    }

    setLoading(true);

    try {
      const imageUrls = images.length > 0 ? await uploadImages() : [];

      await ProductsService.createProduct({
        name,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock, 10),
        images: imageUrls,
        sellerId: user.id,
        sellerName: user.name,
      });

      router.push(ROUTES.SELLER_PRODUCTS);
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <p className="py-12 text-center text-gray-600">Cargando...</p>;
  }

  if (!user || user.role !== 'seller') {
    return <p className="py-12 text-center text-gray-600">No tienes permiso para acceder a esta página</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Publicar nuevo producto</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-md">
        <Input
          id="product-name"
          label="Nombre del producto"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="Ej: Cuaderno espiral"
        />

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe tu producto..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="price"
            label="Precio ($)"
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
            min="0"
            step="0.01"
            placeholder="0"
          />
          <Input
            id="stock"
            label="Stock"
            type="number"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            required
            min="1"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value as typeof category)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {productCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <Input
          id="images"
          label="Imágenes"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => setImages(event.target.files ? Array.from(event.target.files) : [])}
        />

        <Button type="submit" className="w-full py-3" disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar producto'}
        </Button>
      </form>
    </div>
  );
}
