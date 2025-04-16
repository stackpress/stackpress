//modules
import { createContext } from 'react';
//views
import type { NotifyContextProps } from '../types.js';

export const config = {
  position: 'bottom-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
};

const NotifyContext = createContext<NotifyContextProps>({ config });

export default NotifyContext;