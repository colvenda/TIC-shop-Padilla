'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push(ROUTES.HOME);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="tu@email.com"
        />
        <Input
          id="password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          placeholder="••••••••"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link href={ROUTES.REGISTER} className="font-medium text-blue-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </>
  );
}
