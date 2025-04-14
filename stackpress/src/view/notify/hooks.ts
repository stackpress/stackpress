//modules
import type { ToastOptions } from 'react-toastify';
import React, { useContext } from 'react';
import cookie from 'js-cookie';
import { toast } from 'react-toastify';
//notify
import NotifyContext, { config } from './NotifyContext';

const cookieConfig = { path: '/' };

/**
 * No hook notify function
 */
export function notify(
  type: string, 
  message: string|React.ReactNode,
  autoClose?: number
) {
  if (!autoClose) {
    autoClose = config.autoClose || 5000;
  }
  const options = { ...config, autoClose } as ToastOptions;
  switch (type) {
    case 'info': toast.info(message, options); break;
    case 'warn': toast.warn(message, options); break;
    case 'error': toast.error(message, options); break;
    case 'success': toast.success(message, options); break;
  }
}

/**
 * No hook flash
 */
export function flash(type: string, message: string, close: number = 5000) {
  cookie.set('flash', JSON.stringify({ type, message, close }), cookieConfig);
};

/**
 * No hook unload
 */
export function unload() {
  const value = cookie.get('flash');
  if (value) {
    cookie.remove('flash', cookieConfig);
    const args: Record<string, any> = JSON.parse(value as string);
    notify(args.type, args.message, args.close);
  }
};

export function useNotify() {
  const { config } = useContext(NotifyContext);
  const handlers = {
    notify(
      type: string, 
      message: string|React.ReactNode,
      autoClose?: number
    ) {
      if (!autoClose) {
        autoClose = config.autoClose || 5000;
      }
      const options = { ...config, autoClose } as ToastOptions;
      switch (type) {
        case 'info': toast.info(message, options); break;
        case 'warn': toast.warn(message, options); break;
        case 'error': toast.error(message, options); break;
        case 'success': toast.success(message, options); break;
      }
    },
    flash,
    unload() {
      const value = cookie.get('flash');
      if (value) {
        cookie.remove('flash', cookieConfig);
        const args: Record<string, any> = JSON.parse(value as string);
        handlers.notify(args.type, args.message, args.close);
      }
    }
  };
  return handlers;
}