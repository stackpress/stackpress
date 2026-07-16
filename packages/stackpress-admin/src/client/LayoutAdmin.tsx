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
  //render
  return (
    <LayoutPanel 
      cookie={cookie}
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
