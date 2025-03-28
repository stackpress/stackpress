export type {
  SessionRoute,
  SessionPermission,
  SessionPermissionList,
  SessionData,
  SessionTokenData
} from '../../session/types';

import { useState, useEffect } from 'react';
import Session from './Session';
export { Session };

export function useLocation() {
  const [ location, setLocation ] = useState<URL & { dirname: string }>();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const dirname = url.pathname.slice(0, url.pathname.lastIndexOf('/'))
      setLocation({ ...url, dirname });
    }
  }, []);
  return location;
}