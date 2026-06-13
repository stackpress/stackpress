//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//plugins
import { readMarkdownDoc } from '../../app/helpers.js';
import { getGuideLevel, withNavLevels } from '../../app/progress.js';
//local
import { docs, nav, readingOrder } from '../manifest.js';

export default action(async function GuidesDocPage({ req, res, ctx }) {
  const pathname = req.url.pathname.replace(/\/$/, '');
  const item = docs.find(doc => doc.href === pathname);
  if (!item) return;
  const index = readingOrder.findIndex(doc => doc.href === pathname);

  const parsed = await readMarkdownDoc(item.file);
  const guideLevel = getGuideLevel(item.href);
  res.results({
    active: item.href,
    content: parsed.html,
    description: parsed.description || item.description,
    eyebrow: 'Guides',
    guideLevel,
    nav: withNavLevels(nav),
    next: readingOrder[index + 1],
    previous: readingOrder[index - 1],
    section: 'guides',
    title: parsed.title,
    toc: parsed.toc
  });
  setViewProps(req, res, ctx);
});
