//modules
import { createContext } from 'react';
//views
import type { ThemeContextProps } from '../types.js';

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light', 
  toggle: () => {}
});

export default ThemeContext;