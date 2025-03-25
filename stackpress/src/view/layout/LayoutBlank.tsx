//modules
import { useEffect } from 'react';
//view
import { unload, ToastContainer } from '../notify';
import { useTheme } from '../theme';
//components
import LayoutHead from './components/LayoutHead';
import LayoutMain from './components/LayoutMain';
//local
import LayoutProvider from './LayoutProvider';

export type BlankAppProps = { 
  href?: string,
  logo?: string,
  brand?: string,
  language?: string,
  translations?: Record<string, string>,
  children?: React.ReactNode
};

export function BlankApp(props: BlankAppProps) {
  const { href, logo, brand, children } = props;
  const { theme, toggle: toggleTheme } = useTheme();
  return (
    <div className={`${theme} relative px-w-100-0 px-h-100-0 theme-bg-bg0 theme-tx1`}>
      <LayoutHead 
        theme={theme}
        href={href}
        logo={logo}
        brand={brand}
        toggleTheme={toggleTheme} 
      />
      <LayoutMain>{children}</LayoutMain>
    </div>
  );
}

export type LayoutBlankProps = { 
  href?: string,
  logo?: string,
  brand?: string,
  theme?: string,
  language?: string,
  translations?: Record<string, string>,
  children?: React.ReactNode,
};

export default function LayoutBlank(props: LayoutBlankProps) {
  const { theme, href, logo, brand, language, translations, children } = props;
  //unload flash message
  useEffect(unload, []);
  return (
    <LayoutProvider theme={theme} language={language} translations={translations}>
      <BlankApp href={href} logo={logo} brand={brand}>
        {children}
      </BlankApp>
      <ToastContainer />
    </LayoutProvider>
  );
}