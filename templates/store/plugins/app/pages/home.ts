//modules
import { action } from '@stackpress/ingest';

export default action(async function HomePage({ res }) {
  res.results({
    title: 'Store Sample',
    links: [
      { href: '/products', label: 'Browse Products' },
      { href: '/cart', label: 'View Cart' }
    ]
  });
});
