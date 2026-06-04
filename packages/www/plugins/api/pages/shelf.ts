//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//local
import { description, docs, title } from '../manifest.js';

export default action(async function ApiShelfPage({ req, res, ctx }) {
  res.results({
    cards: docs.map(({ description, href, label }) => ({
      description,
      href,
      label
    })),
    description,
    eyebrow: 'API reference',
    section: 'api',
    title
  });
  setViewProps(req, res, ctx);
});
