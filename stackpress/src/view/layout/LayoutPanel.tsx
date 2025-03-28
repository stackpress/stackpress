//modules
import { useEffect } from 'react';
//view
import { unload, ToastContainer } from '../notify';
import { useTheme } from '../theme';
//components
import LayoutHead from './components/LayoutHead';
import LayoutLeft from './components/LayoutLeft';
import LayoutMain from './components/LayoutMain';
import LayoutMenu from './components/LayoutMenu';
import LayoutRight from './components/LayoutRight';
//local
import LayoutProvider from './LayoutProvider';
import { useToggle } from './hooks';

export type PanelAppProps = { 
  base?: string,
  logo?: string,
  brand?: string,
  language?: string,
  translations?: Record<string, string>,
  children?: React.ReactNode,
  path?: string,
  menu?: {
    name: string;
    icon: string;
    path: string;
    match: string;
  }[],
  left?: React.ReactNode,
  right?: React.ReactNode
};

export function PanelApp(props: PanelAppProps) {
  const { base, logo, brand, path, menu, children } = props;
  const [ left, toggleLeft ] = useToggle();
  const [ right, toggleRight ] = useToggle();
  const { theme, toggle: toggleTheme } = useTheme();
  return (
    <div className={`${theme} relative overflow-hidden px-w-100-0 px-h-100-0 theme-bg-bg0 theme-tx1`}>
      <LayoutHead 
        open={left} 
        theme={theme}
        toggleLeft={toggleLeft} 
        toggleRight={toggleRight} 
        toggleTheme={toggleTheme} 
      />
      <LayoutLeft
        brand={brand}
        base={base}
        logo={logo}
        open={left}
        toggle={toggleLeft}
      >
        {menu ? (
          <LayoutMenu path={path} menu={menu} />
        ) : props.left}
      </LayoutLeft>
      <LayoutRight open={right}>{props.right}</LayoutRight>
      <LayoutMain open={left}>{children}</LayoutMain>
    </div>
  );
}

export type LayoutPanelProps = { 
  base?: string,
  logo?: string,
  brand?: string,
  theme?: string,
  language?: string,
  translations?: Record<string, string>,
  children?: React.ReactNode,
  path?: string,
  menu?: {
    name: string;
    icon: string;
    path: string;
    match: string;
  }[],
  left?: React.ReactNode,
  right?: React.ReactNode
};

export default function LayoutPanel(props: LayoutPanelProps) {
  const { 
    base, 
    logo, 
    brand, 
    path,
    menu,
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
      <PanelApp 
        base={base} 
        logo={logo} 
        brand={brand} 
        left={left} 
        right={right}
        path={path}
        menu={menu}
      >
        {children}
      </PanelApp>
      <ToastContainer />
    </LayoutProvider>
  );
}