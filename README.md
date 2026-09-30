# Tienda IE Almirante Padilla

Tienda virtual para el colegio Institución Educativa Almirante Padilla. Permite a estudiantes y profesores comprar y vender productos dentro de la comunidad educativa, con sistema de contraentrega.

## Características

- Autenticación para compradores y vendedores
- Catálogo con búsqueda y filtro por categoría
- Carrito persistente en el navegador
- Pedidos contraentrega
- Panel de vendedor para publicar productos
- Panel de administración de usuarios, productos y órdenes

## Tecnologías

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Firebase (Auth, Firestore)
- Cloudinary (imágenes)

## Configuración

1. Copia `.env.example` a `.env.local` y completa las claves de Firebase y Cloudinary.
2. En Firebase habilita Authentication (email/contraseña) y Firestore.
3. Instala y ejecuta:

```bash
npm install
npm run dev
```

Para convertir un usuario en administrador, cambia el campo `role` a `"admin"` en su documento de la colección `users`.

## Estructura

```
src/
├── app/                    # App Router y grupos de rutas
│   ├── (auth)/             # login y register
│   ├── (shop)/             # catálogo, carrito y checkout
│   ├── seller/             # panel de vendedor
│   ├── admin/              # panel de admin
│   └── api/upload          # subida de imágenes
├── components/             # UI, layout, features y forms
├── contexts/               # Auth y carrito (estado compartido)
├── hooks/                  # Acceso a contexts y datos
├── services/               # Firebase y Cloudinary
├── lib/                    # Configuración y utilidades
├── types/                  # Tipos TypeScript
└── constants/              # Rutas, roles y categorías
```
