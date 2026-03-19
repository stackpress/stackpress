//modules
import { action } from '@stackpress/ingest';
//client
import type { ArticleExtended } from 'blog-client/types';

export default action.props(async function HomePage({ req, res, ctx }) {
  const slug = req.data<string>('slug');
  const articles = await ctx.resolve<ArticleExtended[]>(
    'article-search', 
    { filter: { slug } }
  );
  if (articles.code !== 200 
    || !articles.results 
    || !articles.results.length
  ) return;
  res.setResults(articles.results[0]);
});