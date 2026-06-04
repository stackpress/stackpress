//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//local
import { description, docs, title } from '../manifest.js';

export default action(async function ConceptsShelfPage({ req, res, ctx }) {
  res.results({
    cards: docs.map(({ description, href, label }) => ({
      description,
      href,
      label
    })),
    description,
    eyebrow: 'Concepts',
    section: 'concepts',
    title
  });
  setViewProps(req, res, ctx);
});
