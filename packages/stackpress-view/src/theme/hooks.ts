//modules
import { useContext } from 'react';
//stackpress/view/theme
import ThemeContext from './ThemeContext.js';

export function useTheme() {
  return useContext(ThemeContext);
};