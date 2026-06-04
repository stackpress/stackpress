import type { ServerConfigPageProps } from 'stackpress/view/client';
import { DocsFrame, DocsHead, ShelfBody } from '../../app/components/docs.js';

export function Head(props: ServerConfigPageProps) {
  return (
    <DocsHead
      {...props}
      title="Stackpress API Reference"
      description="Lookup-oriented Stackpress API reference."
    />
  );
}

export function Page(props: ServerConfigPageProps) {
  return <DocsFrame {...props}><ShelfBody /></DocsFrame>;
}

export default Page;
