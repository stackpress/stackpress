//modules
import { useState, useEffect } from 'react';
import Modal from 'frui/element/Modal';
//views
import type { ModalProviderProps } from '../types';
//modal
import ModalContext from './ModalContext';

// (this is what to put in app.tsx)
const ModalProvider = ({ children, ...config }: ModalProviderProps) => {
  const [ ready, isReady ] = useState(false);
  const [ opened, open ] = useState(false);
  const [ _title, title ] = useState(config.title || '');
  const [ _className, className ] = useState(config.className || '');
  const [ _body, body ] = useState<React.ReactNode>();

  const value = { 
    _title,    _className, _body, opened, 
    className, title,      body,  open 
  };

  useEffect(() => {
    isReady(true);
  }, []);
  
  return (
    <ModalContext.Provider value={value}>
      {children}
      {ready && (
        <Modal 
          title={_title} 
          className={_className} 
          opened={opened} 
          onClose={() => open(false)}
        >
          {_body}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

export default ModalProvider;