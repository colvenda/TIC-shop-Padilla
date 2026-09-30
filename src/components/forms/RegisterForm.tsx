'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, name, role);
      router.push(ROUTES.HOME);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
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
          id="name"
          label="Nombre completo"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="Tu nombre"
        />
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
          minLength={6}
          placeholder="Mínimo 6 caracteres"
        />
        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
            Tipo de cuenta
          </label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="buyer">Comprador</option>
            <option value="seller">Vendedor</option>
          </select>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link href={ROUTES.LOGIN} className="font-medium text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
