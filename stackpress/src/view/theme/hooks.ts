//modules
import { useContext } from 'react';
//theme
import ThemeContext from './ThemeContext';

export function useTheme() {
  return useContext(ThemeContext);
};