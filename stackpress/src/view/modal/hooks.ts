//types
import type { ReactNode } from 'react';
//hooks
import React from 'react';
import { useContext } from 'react';
//notify
import { useNotify } from '../notify/hooks';
//modal
import ModalContext from './ModalContext';
import Confirm from './ModalConfirm';

export function useModal() {
  const { className, title, body, open } = useContext(ModalContext);
  return { className, title, body, open };
}

export function useConfirm(config: {
  label: () => string,
  message: () => ReactNode,
  action: () => Promise<void>
}) {
  const { label, message, action } = config;
  const { open, title, body } = useModal();
  const { notify } = useNotify();
  const confirmed = () => action().then(() => {
    open(false);
  }).catch(e => {
    open(false);
    notify('error', e.message);
  });
  const confirm = () => {
    title(label());
    //<Confirm open={open} message={message} confirmed={confirmed} />
    body(React.createElement(Confirm, { 
      open, 
      message: message(), 
      confirmed
    }));
    open(true);
  };

  return { confirm };
};