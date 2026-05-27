//modules
import { TemplateEngine, helpers } from '@stackpress/lib/Template';

export type SigninEmailTemplateInput = {
  brand?: string;
  email: string;
  link: string;
  name?: string;
  pin?: string;
};

type SigninEmailTemplateRow = {
  name: string;
  subject: string;
  text: string;
  html: string;
};

const templates = [
  //0-------------------------------------------------------------------//
  `Hello {{name}},

You requested a one-time password to sign in to {{brand}}.

----

Your OTP is: {{pin}}
Open {{link}} to continue signing in.

----

If you did not request this sign-in, please ignore this email.`,

  //1-------------------------------------------------------------------//
  `<p>Hello {{name}},</p>
<p>You requested a one-time password to sign in to {{brand}}.</p>
<hr />
<p>Your OTP is: <strong>{{pin}}</strong></p>
<p>Open <a href="{{link}}">this sign-in page</a> to continue.</p>
<hr />
<p>If you did not request this sign-in, please ignore this email.</p>`,

  //2-------------------------------------------------------------------//
  `Hello {{name}},

You requested a magic link to sign in to {{brand}}.

----

Open {{link}} to continue signing in.

----

If you did not request this sign-in, please ignore this email.`,

  //3-------------------------------------------------------------------//
  `<p>Hello {{name}},</p>
<p>You requested a magic link to sign in to {{brand}}.</p>
<hr />
<p><a href="{{link}}">Click here to sign in</a></p>
<hr />
<p>If you did not request this sign-in, please ignore this email.</p>`
];

const rows: SigninEmailTemplateRow[] = [
  {
    name: 'Stackpress Sign In OTP',
    subject: 'Stackpress Sign In OTP',
    text: templates[0],
    html: templates[1]
  },
  {
    name: 'Stackpress Sign In Magic Link',
    subject: 'Stackpress Magic Sign In Link',
    text: templates[2],
    html: templates[3]
  }
];

/**
 * Escape html value
 */
function escapeHTML(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Render template
 */
function renderTemplate(
  template: string,
  data: Record<string, string>
) {
  //Use the shared template engine to expand the {{token}} placeholders 
  // from the row definitions into the final text and HTML message bodies.
  const engine = new TemplateEngine({ helpers });
  return engine.render(template, data);
}

/**
 * Render sign in email template row
 */
function renderRow(
  row: SigninEmailTemplateRow,
  data: Record<string, string>
) {
  return {
    subject: renderTemplate(row.subject, data),
    text: renderTemplate(row.text, data),
    html: renderTemplate(row.html, data)
  };
}

/**
 * Build OTP template
 */
export function makeOTPTemplate(input: SigninEmailTemplateInput) {
  const { brand = 'Stackpress', email, link, name, pin = '' } = input;
  const row = rows[0];
  const greeting = name?.trim() || email;
  return renderRow(row, {
    brand: escapeHTML(brand),
    link: escapeHTML(link),
    name: escapeHTML(greeting),
    pin: escapeHTML(pin)
  });
}

/**
 * Build magic link template
 */
export function makeMagicLinkTemplate(input: SigninEmailTemplateInput) {
  const { brand = 'Stackpress', email, link, name } = input;
  const row = rows[1];
  const greeting = name?.trim() || email;
  return renderRow(row, {
    brand: escapeHTML(brand),
    link: escapeHTML(link),
    name: escapeHTML(greeting)
  });
}
