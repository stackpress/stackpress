//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type { ArticleExtended } from 'blog-client/types';

export default action.props(async function HomePage({ req, res, ctx }) {
  //get the slug from the request
  const slug = req.data<string>('slug');
  //get articles
  const articles = await ctx.resolve<ArticleExtended[]>(
    'article-search', 
    { filter: { slug } }
  );
  //if error or no results, skip
  if (articles.code !== 200 
    || !articles.results 
    || !articles.results.length
  ) return;
  //set the results
  res.setResults(articles.results[0]);
  //set view props (like brand, logo, view from config...)
  setViewProps(req, res, ctx);
});