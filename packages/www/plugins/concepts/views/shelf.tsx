import type { ServerConfigPageProps } from 'stackpress/view/client';
import { DocsFrame, DocsHead, ShelfBody } from '../../app/components/docs.js';

export function Head(props: ServerConfigPageProps) {
  return (
    <DocsHead
      {...props}
      title="Stackpress Concepts"
      description="Understand the Stackpress model before the details."
    />
  );
}

export function Page(props: ServerConfigPageProps) {
  return <DocsFrame {...props}><ShelfBody /></DocsFrame>;
}

export default Page;
