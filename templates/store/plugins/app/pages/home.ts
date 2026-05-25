//modules
import { action } from '@stackpress/ingest';
//plugins/store

export default action(async function HomePage({ res }) {
  res.results({ title: 'The Store' });
});