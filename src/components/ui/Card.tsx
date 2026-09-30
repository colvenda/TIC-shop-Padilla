import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('overflow-hidden rounded-lg bg-white shadow-md', className)} {...props} />;
}
