import { UserRole } from '@/types';

export const ROLES: Record<UserRole, string> = {
  buyer: 'Comprador',
  seller: 'Vendedor',
  admin: 'Administrador',
};

export const ROLE_PERMISSIONS = {
  buyer: ['view_products', 'add_to_cart', 'checkout'],
  seller: ['view_products', 'add_to_cart', 'checkout', 'create_product', 'manage_products'],
  admin: ['view_products', 'add_to_cart', 'checkout', 'create_product', 'manage_products', 'manage_users', 'manage_orders'],
} as const;
