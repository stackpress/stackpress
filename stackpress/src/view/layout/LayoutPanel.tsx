//modules
import { useEffect } from 'react';
//view
import { unload, ToastContainer } from '../notify';
import { useTheme } from '../theme';
//components
import LayoutHead from './components/LayoutHead';
import LayoutLeft from './components/LayoutLeft';
import LayoutMain from './components/LayoutMain';
import LayoutRight from './components/LayoutRight';
//local
import LayoutProvider from './LayoutProvider';
import { useToggle } from './hooks';

export type PanelAppProps = { 
  href?: string,
  logo?: string,
  brand?: string,
  language?: string,
  translations?: Record<string, string>,
  children?: React.ReactNode,
  left?: React.ReactNode,
  right?: React.ReactNode
};

export function PanelApp(props: PanelAppProps) {
  const { href, logo, brand, children } = props;
  const [ left, toggleLeft ] = useToggle();
  const [ right, toggleRight ] = useToggle();
  const { theme, toggle: toggleTheme } = useTheme();
  return (
    <div className={`${theme} relative px-w-100-0 px-h-100-0 theme-bg-bg0 theme-tx1`}>
      <LayoutHead 
        open={left} 
        theme={theme}
        toggleLeft={toggleLeft} 
        toggleRight={toggleRight} 
        toggleTheme={toggleTheme} 
      />
      <LayoutLeft
        brand={brand}
        href={href}
        logo={logo}
        open={left}
        toggle={toggleLeft}
      >
        {props.left}
      </LayoutLeft>
      <LayoutRight open={right}>{props.right}</LayoutRight>
      <LayoutMain open={left}>{children}</LayoutMain>
    </div>
  );
}

export type LayoutPanelProps = { 
  href?: string,
  logo?: string,
  brand?: string,
  theme?: string,
  language?: string,
  translations?: Record<string, string>,
  children?: React.ReactNode,
  left?: React.ReactNode,
  right?: React.ReactNode
};

export default function LayoutPanel(props: LayoutPanelProps) {
  const { 
    href, 
    logo, 
    brand, 
    left, 
    right, 
    theme,
    language, 
    translations, 
    children 
  } = props;
  //unload flash message
  useEffect(unload, []);
  return (
    <LayoutProvider theme={theme} language={language} translations={translations}>
      <PanelApp href={href} logo={logo} brand={brand} left={left} right={right}>
        {children}
      </PanelApp>
      <ToastContainer />
    </LayoutProvider>
  );
}