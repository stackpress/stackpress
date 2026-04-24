//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';

export default action.props(async function HomePage({ req, res, ctx }) {
  //only published
  req.data.set('status', 'PUBLISHED');
  //if no sort
  if (!req.data.has('sort')) {
    //default to published desc
    req.data.set('sort', 'published', 'desc');
  }
  //now search article
  await ctx.emit('article-search', req, res);
  //set view props (like brand, logo, view from config...)
  setViewProps(req, res, ctx);
});