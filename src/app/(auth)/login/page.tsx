import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-yellow-400 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Tienda IE Almirante Padilla</h1>
          <p className="text-gray-600">Iniciar sesión</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
