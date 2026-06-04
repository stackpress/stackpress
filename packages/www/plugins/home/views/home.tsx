//stackpress
import type { ServerConfigPageProps } from 'stackpress/view/client';
//plugins
import {
  DocsFrame,
  DocsHead,
  HomeBody
} from '../../app/components/docs.js';

export function Head(props: ServerConfigPageProps) {
  return (
    <DocsHead
      {...props}
      title="Stackpress Docs"
      description="Learn Stackpress by building the first working app."
    />
  );
}

export function Page(props: ServerConfigPageProps) {
  return (
    <DocsFrame {...props}>
      <HomeBody />
    </DocsFrame>
  );
}

export default Page;
