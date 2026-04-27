//modules
import { useEffect } from 'react';
import { notify, unload } from 'frui/Notifier';
//stackpress-view
import LayoutPanel from 'stackpress-view/layout/LayoutPanel';
//stackpress-admin
import type { AdminLayoutProps } from './types.js';

export default function LayoutAdmin(props: AdminLayoutProps) {
  //props
  const { 
    cookie,
    data,
    session,
    request,
    response,
    children 
  } = props;
  const { admin = {} } = data || {};
  const { menu = [] } = admin;
  //effects
  // unload any flash messages from the server
  useEffect(() => {
    unload(cookie);
  }, []);
  // if there is an error in the response, show a notification
  useEffect(() => {
    response?.error && notify('error', response.error);
  }, [ response?.error ]);
  //render
  return (
    <LayoutPanel 
      menu={menu}
      data={data}
      session={session}
      request={request}
      response={response}
    >
      {children}
    </LayoutPanel>
  );
};