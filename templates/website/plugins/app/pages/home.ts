//modules
import { action } from '@stackpress/ingest';
//plugins/store

export default action.props(async function HomePage({ res }) {
  res.setResults({ title: 'Welcome to Stackpress' });
});