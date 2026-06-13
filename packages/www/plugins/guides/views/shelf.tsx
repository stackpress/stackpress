//modules
import type { ServerConfigPageProps } from 'stackpress/view/client';
//client
import { DocsFrame, DocsHead, ShelfBody } from '../../app/components/docs.js';

/**
 * Renders guide index head tags.
 */
export function Head(props: ServerConfigPageProps) {
  return (
    <DocsHead
      {...props}
      title="Stackpress Guides"
      description="Practical Stackpress tutorials and workflow guides."
    />
  );
}

/**
 * Renders the guide index page.
 */
export function Page(props: ServerConfigPageProps) {
  return (
    <DocsFrame {...props}>
      <ShelfBody />
    </DocsFrame>
  );
}

export default Page;
