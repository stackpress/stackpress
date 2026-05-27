//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';

export default action(async function HomePage({ req, res, ctx }) {
  res.results({
    title: 'Store Sample',
    links: [
      { href: '/products', label: 'Browse Products' },
      { href: '/cart', label: 'View Cart' }
    ]
  });
  setViewProps(req, res, ctx);
});
