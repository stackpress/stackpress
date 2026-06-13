//modules
import type { ServerConfigPageProps } from 'stackpress/view/client';
//client
import { DocsFrame, DocsHead, DocBody } from '../../app/components/docs.js';

/**
 * Renders API article head tags.
 */
export function Head(props: ServerConfigPageProps) {
  return (
    <DocsHead
      {...props}
      title="Stackpress API Reference"
      description="Stackpress API reference documentation."
    />
  );
}

/**
 * Renders an API reference article page.
 */
export function Page(props: ServerConfigPageProps) {
  return (
    <DocsFrame {...props}>
      <DocBody />
    </DocsFrame>
  );
}

export default Page;
