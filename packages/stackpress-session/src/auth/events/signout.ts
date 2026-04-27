//modules
import { action } from '@stackpress/ingest/Server';

export default action.props(async function AuthSignout({ res }) {
  //remove session
  res.session.delete('session');
  res.setStatus(200);
});