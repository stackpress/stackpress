import { createContext } from 'react';

export type ThemeContextProps = { 
  theme: string,
  toggle: () => void
};

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light', 
  toggle: () => {}
});

export default ThemeContext;