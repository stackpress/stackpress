//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//plugins
import { readMarkdownDoc } from '../../app/helpers.js';
//local
import { docs, nav } from '../manifest.js';

export default action(async function ApiDocPage({ req, res, ctx }) {
  const pathname = req.url.pathname.replace(/\/$/, '');
  const index = docs.findIndex(doc => doc.href === pathname);
  const item = docs[index];
  if (!item) return;

  const parsed = await readMarkdownDoc(item.file);
  res.results({
    active: item.href,
    content: parsed.html,
    description: parsed.description || item.description,
    eyebrow: 'API reference',
    nav,
    next: docs[index + 1],
    previous: docs[index - 1],
    section: 'api',
    title: parsed.title,
    toc: parsed.toc
  });
  setViewProps(req, res, ctx);
});
