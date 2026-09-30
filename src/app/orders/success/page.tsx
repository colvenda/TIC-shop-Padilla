'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(ROUTES.HOME);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="rounded-lg bg-white p-8 text-center shadow-md">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">¡Pedido realizado con éxito!</h1>
      <p className="mb-6 text-gray-600">
        Tu pedido quedó registrado. El vendedor coordinará la entrega dentro del colegio.
      </p>
      <Link
        href={ROUTES.HOME}
        className="inline-block rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Volver a la tienda
      </Link>
      <p className="mt-4 text-sm text-gray-500">Serás redirigido automáticamente en 5 segundos...</p>
    </div>
  );
}
