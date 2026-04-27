//modules
import { useContext } from 'react';
//stackpress-view
import ThemeContext from './ThemeContext.js';

export function useTheme() {
  return useContext(ThemeContext);
};