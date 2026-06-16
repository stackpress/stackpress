//modules
import { action } from '@stackpress/ingest';

export default action(async function HomePage({ res }) {
  res.results({ title: 'Hello World' });
});
