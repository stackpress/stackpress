import { createContext } from 'react';
//views
import type { ModalContextProps } from '../types.js';

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