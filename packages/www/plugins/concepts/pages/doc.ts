//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//plugins
import { readMarkdownDoc } from '../../app/helpers.js';
//local
import { docs, nav } from '../manifest.js';

export default action(async function ConceptsDocPage({ req, res, ctx }) {
  const pathname = req.url.pathname.replace(/\/$/, '');
  const index = docs.findIndex(doc => doc.href === pathname);
  const item = docs[index];
  if (!item) return;

  const parsed = await readMarkdownDoc(item.file);
  res.results({
    active: item.href,
    content: parsed.html,
    description: parsed.description || item.description,
    eyebrow: 'Concepts',
    nav,
    next: docs[index + 1],
    previous: docs[index - 1],
    section: 'concepts',
    title: parsed.title,
    toc: parsed.toc
  });
  setViewProps(req, res, ctx);
});
