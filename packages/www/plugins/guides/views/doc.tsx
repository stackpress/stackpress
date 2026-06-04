import type { ServerConfigPageProps } from 'stackpress/view/client';
import { DocsFrame, DocsHead, DocBody } from '../../app/components/docs.js';

export function Head(props: ServerConfigPageProps) {
  return (
    <DocsHead
      {...props}
      title="Stackpress Guides"
      description="Stackpress guide documentation."
    />
  );
}

export function Page(props: ServerConfigPageProps) {
  return <DocsFrame {...props}><DocBody /></DocsFrame>;
}

export default Page;
