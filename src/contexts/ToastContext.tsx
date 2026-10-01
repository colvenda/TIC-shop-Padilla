'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast, ToastContainer } from '@/components/ui/Toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showToastSuccess: (message: string, duration?: number) => void;
  showToastError: (message: string, duration?: number) => void;
  showToastInfo: (message: string, duration?: number) => void;
  showToastWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, addToast, removeToast } = useToast();

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    addToast(message, type, duration);
  };

  const showToastSuccess = (message: string, duration = 3000) => {
    addToast(message, 'success', duration);
  };

  const showToastError = (message: string, duration = 3000) => {
    addToast(message, 'error', duration);
  };

  const showToastInfo = (message: string, duration = 3000) => {
    addToast(message, 'info', duration);
  };

  const showToastWarning = (message: string, duration = 3000) => {
    addToast(message, 'warning', duration);
  };

  return (
    <ToastContext.Provider
      value={{ showToast, showToastSuccess, showToastError, showToastInfo, showToastWarning }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
