import type { ServerConfigPageProps } from 'stackpress/view/client';
import { DocsFrame, DocsHead, DocBody } from '../../app/components/docs.js';

export function Head(props: ServerConfigPageProps) {
  return (
    <DocsHead
      {...props}
      title="Stackpress API Reference"
      description="Stackpress API reference documentation."
    />
  );
}

export function Page(props: ServerConfigPageProps) {
  return <DocsFrame {...props}><DocBody /></DocsFrame>;
}

export default Page;
