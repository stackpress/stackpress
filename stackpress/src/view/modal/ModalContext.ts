import type { ReactNode } from 'react';
import { createContext } from 'react';

export type ModalContextProps = { 
  _title: string,
  _className: string,
  _body?: ReactNode,
  opened: boolean,
  title: (title: string) => void,
  open: (opened: boolean) => void,
  className: (className: string) => void,
  body: (body: ReactNode) => void
};

const ModalContext = createContext<ModalContextProps>({ 
  _title: '', 
  _className: '', 
  _body: undefined,
  opened: false, 
  title: () => {},
  className: () => {},
  body: () => {},
  open: () => {},
});

export default ModalContext;