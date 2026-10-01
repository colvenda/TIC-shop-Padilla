'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (loading) {
    return <p className="py-12 text-center text-slate-600">Cargando...</p>;
  }

  if (!user) {
    return <p className="py-12 text-center text-slate-600">Debes iniciar sesión para ver tu perfil</p>;
  }

  const handleSave = async () => {
    setSaving(true);
    // Aquí iría la lógica para actualizar el usuario en Firebase
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  const roleLabels: Record<string, string> = {
    buyer: 'Comprador',
    seller: 'Vendedor',
    admin: 'Administrador',
  };

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Mi perfil</h1>

      <div className="max-w-2xl">
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Información personal</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <p className="text-slate-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {roleLabels[user.role] || user.role}
                </span>
              </div>

              {isEditing ? (
                <div>
                  <Input
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <p className="text-slate-900">{user.name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button type="button" onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                  }}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Editar perfil
              </Button>
            )}
          </div>
        </Card>

        {user.role === 'buyer' && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">¿Quieres vender?</h2>
            <p className="text-slate-600 mb-4">
              Conviértete en vendedor y empieza a vender productos en TIC-shop Padilla.
            </p>
            <Button type="button">Solicitar ser vendedor</Button>
          </Card>
        )}
      </div>
    </>
  );
}
