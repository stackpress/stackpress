//modules
import { useState, useEffect } from 'react';
import UniversalCookie from 'universal-cookie';
//views
import type { ThemeProviderProps } from '../types.js';
//theme
import ThemeContext from './ThemeContext.js';

const cookie = new UniversalCookie();

// (this is what to put in app.tsx)
export default function ThemeProvider(props: ThemeProviderProps) {
  const { children, theme: init = 'light' } = props;
  const [ theme, setTheme ] = useState(init);
  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    cookie.set('theme', newTheme);
  };
  const value = { theme, toggle };
  useEffect(() => {
    setTheme(cookie.get('theme') as string || init);
  }, []);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}