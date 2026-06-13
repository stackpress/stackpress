//modules
import type { ServerConfigPageProps } from 'stackpress/view/client';
//client
import { DocsFrame, DocsHead, DocBody } from '../../app/components/docs.js';

/**
 * Renders guide article head tags.
 */
export function Head(props: ServerConfigPageProps) {
  return (
    <DocsHead
      {...props}
      title="Stackpress Guides"
      description="Stackpress guide documentation."
    />
  );
}

/**
 * Renders a guide article page.
 */
export function Page(props: ServerConfigPageProps) {
  return (
    <DocsFrame {...props}>
      <DocBody />
    </DocsFrame>
  );
}

export default Page;
