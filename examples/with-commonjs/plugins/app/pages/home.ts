//stackpress
import { action } from 'stackpress/server';

export default action(async function ErrorPage(req, res) {
  const name = req.data.path('name', 'guest');
  res.setHTML(`<h1>Hello ${name}</h1>`);
});