//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
import { getHomeCards } from '../../app/progress.js';

export default action(async function HomePage({ req, res, ctx }) {
  res.results({
    title: 'Learn Stackpress by building the first working app.',
    description:
      'A docs-first path for building, understanding, and looking up Stackpress without leaving the repository source of truth.',
    paths: getHomeCards()
  });
  setViewProps(req, res, ctx);
});
