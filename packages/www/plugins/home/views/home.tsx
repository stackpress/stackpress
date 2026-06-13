//modules
import type { ServerConfigPageProps } from 'stackpress/view/client';
//client
import {
  DocsFrame,
  DocsHead,
  HomeBody
} from '../../app/components/docs.js';

/**
 * Renders the static home page head tags.
 */
export function Head(props: ServerConfigPageProps) {
  return (
    <DocsHead
      {...props}
      title="Stackpress - Full Stack App Framework"
      description="Stackpress is a turn-key app framework with modern routing, react templating, SQL dialects and an admin generator. Go from zero to sixty and 💯 open source."
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
