//hooks
import { useContext } from 'react';
//components
import ThemeContext from './ThemeContext';

export function useTheme() {
  return useContext(ThemeContext);
};