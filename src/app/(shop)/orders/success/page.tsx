'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(ROUTES.ORDERS);
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="py-16 text-center">
      <div className="mb-4 text-6xl">✅</div>
      <h1 className="mb-4 text-3xl font-bold text-slate-900">¡Pedido realizado con éxito!</h1>
      <p className="mb-8 text-slate-600">Te redirigiremos a tus pedidos en unos segundos...</p>
      <Link href={ROUTES.ORDERS}>
        <Button type="button">Ver mis pedidos</Button>
      </Link>
    </div>
  );
}
