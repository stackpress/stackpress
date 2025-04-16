//modules
import { useContext } from 'react';
//theme
import ThemeContext from './ThemeContext.js';

export function useTheme() {
  return useContext(ThemeContext);
};