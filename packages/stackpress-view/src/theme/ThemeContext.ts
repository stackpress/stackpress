//modules
import { createContext } from 'react';
//stackpress-view
import type { ThemeContextProps } from './types.js';

export type { ThemeContextProps };

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light', 
  toggle: () => {}
});

export default ThemeContext;