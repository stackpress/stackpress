//modules
import type { ServerConfigPageProps } from 'stackpress/view/client';
//client
import {
  DocsFrame,
  DocsHead,
  HomeBody
} from '../components/docs.js';

/**
 * Renders the static home page head tags.
 */
export function Head(props: ServerConfigPageProps) {
  return (
    <DocsHead
      {...props}
      title="Stackpress Docs"
      description="Learn Stackpress by building the first working app."
    />
  );
}

/**
 * Renders the static documentation home page.
 */
export function Page(props: ServerConfigPageProps) {
  return (
    <DocsFrame {...props}>
      <HomeBody />
    </DocsFrame>
  );
}

export default Page;
