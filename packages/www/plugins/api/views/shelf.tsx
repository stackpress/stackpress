//modules
import type { ServerConfigPageProps } from 'stackpress/view/client';
//client
import { DocsFrame, DocsHead, ShelfBody } from '../../app/components/docs.js';

/**
 * Renders API index head tags.
 */
export function Head(props: ServerConfigPageProps) {
  return (
    <DocsHead
      {...props}
      title="Stackpress API Reference"
      description="Lookup-oriented Stackpress API reference."
    />
  );
}

/**
 * Renders the API index page.
 */
export function Page(props: ServerConfigPageProps) {
  return (
    <DocsFrame {...props}>
      <ShelfBody />
    </DocsFrame>
  );
}

export default Page;
