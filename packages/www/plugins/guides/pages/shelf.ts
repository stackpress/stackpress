//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
import { withCardLevels } from '../../app/progress.js';
//local
import { description, docs, title } from '../manifest.js';

export default action(async function GuidesShelfPage({ req, res, ctx }) {
  res.results({
    cards: withCardLevels(docs.map(({ description, href, label }) => ({
      description,
      href,
      label
    }))),
    description,
    eyebrow: 'Guides',
    section: 'guides',
    title
  });
  setViewProps(req, res, ctx);
});
