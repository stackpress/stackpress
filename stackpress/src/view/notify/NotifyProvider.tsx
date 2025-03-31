//views
import type { NotifyProviderProps } from '../types';
//notify
import NotifyContext from './NotifyContext';

// (this is what to put in app.tsx)
export default function NotifyProvider(props: NotifyProviderProps) {
  const { 
    children, 
    config = {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
    } 
  } = props;
  
  return (
    <NotifyContext.Provider value={{ config }}>
      {children}
    </NotifyContext.Provider>
  );
}