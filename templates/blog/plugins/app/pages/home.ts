//modules
import { action } from '@stackpress/ingest';

export default action.props(async function HomePage({ req, res, ctx }) {
  await ctx.emit('article-search', req, res);
});