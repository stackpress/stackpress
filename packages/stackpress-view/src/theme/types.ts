//modules
import type { ReactNode } from 'react';

export type ThemeContextProps = { 
  theme: string,
  toggle: () => void
};

export type ThemeProviderProps = { 
  theme?: string,
  children: ReactNode 
};