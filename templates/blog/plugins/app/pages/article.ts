//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type { ArticleExtended } from 'blog-client/types';

export default action(async function HomePage({ req, res, ctx }) {
  //get the slug from the request
  const slug = req.data<string>('slug');
  //get articles
  const articles = await ctx.resolve<ArticleExtended[]>(
    'article-search', 
    { eq: { slug } }
  );
  //if error or no results, skip
  if (articles.code !== 200 
    || !articles.results 
    || !articles.results.length
  ) return;
  //get comments for the article
  const comments = await ctx.resolve(
    'comment-search',
    { eq: { articleId: articles.results[0].id } }
  );
  //set the results
  res.results({ ...articles.results[0], comments: comments.results || [] });
  //set view props (like brand, logo, view from config...)
  setViewProps(req, res, ctx);
});