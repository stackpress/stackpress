//stackpress-view
import {
  LayoutBlank,
  useConfig,
  useLanguage
} from 'stackpress-view/client';
//stackpress-session
import type { AuthPageProps } from '../types.js';

type LegalSection = {
  title: string;
  paragraphs: string[];
};

const introduction = [
  `This Privacy Policy describes how the Single Sign-On authentication platform
  (the “Service”) operated by Shoppable Business Incorporated (“Company”, “we”,
  “us”, or “our”) collects, uses, stores, and discloses personal information
  when users create an account, sign in, and authorize Registered Applications
  through the Service.`,
  `By using the Service, you acknowledge that your information will be
  processed in accordance with this Privacy Policy and applicable data
  protection laws.`
];

const sections: LegalSection[] = [
  {
    title: 'I. Information We Collect',
    paragraphs: [
      `We may collect identity and account information such as your name,
      username, email address, phone number, login credentials, profile
      preferences, and other information you choose to provide when registering
      or updating your account.`,
      `We also collect authentication and technical data needed to operate the
      Service, including session identifiers, OAuth consent records, security
      events, device or browser metadata, IP address, timestamps, and logs
      associated with access to the Service.`
    ]
  },
  {
    title: 'II. How We Use Information',
    paragraphs: [
      `We use personal information to create and manage accounts, authenticate
      users, issue and validate session and OAuth tokens, provide account
      recovery flows, protect the Service against abuse, and communicate
      service-related notices.`,
      `We may also use information to monitor service performance, investigate
      fraud or security incidents, comply with legal obligations, enforce
      contractual rights, and improve the reliability of the Service.`
    ]
  },
  {
    title: 'III. OAuth Authorization and Data Sharing',
    paragraphs: [
      `The Service allows Registered Applications to request access to specific
      categories of account data through OAuth authorization. Data is shared
      only after you grant consent to the requested scopes.`,
      `When you approve an authorization request, we transmit the approved
      information to the Registered Application on your behalf. That application
      then processes the data under its own privacy policy and terms, which we
      do not control.`
    ]
  },
  {
    title: 'IV. Legal Basis and Legitimate Interests',
    paragraphs: [
      `We process information where necessary to provide the Service you
      request, to perform contractual obligations, to comply with legal
      requirements, or to pursue legitimate interests such as fraud prevention,
      account security, and service reliability.`,
      `Where consent is required for specific processing activities, you may
      withdraw that consent through the available account controls, subject to
      any lawful basis we may still have to retain or process certain
      information.`
    ]
  },
  {
    title: 'V. Data Retention',
    paragraphs: [
      `We retain personal information for as long as necessary to operate the
      Service, maintain security and audit trails, resolve disputes, enforce our
      agreements, and comply with legal or regulatory obligations.`,
      `When retention is no longer necessary, we will delete, anonymize, or
      securely archive the information in accordance with applicable law and our
      internal retention practices.`
    ]
  },
  {
    title: 'VI. Security Measures',
    paragraphs: [
      `We implement reasonable administrative, technical, and organizational
      safeguards to protect personal information from unauthorized access,
      misuse, loss, alteration, or disclosure.`,
      `No method of transmission or storage is completely secure. While we work
      to protect information, we cannot guarantee absolute security and
      encourage users to maintain strong credentials and protect access to their
      devices.`
    ]
  },
  {
    title: 'VII. Your Rights and Choices',
    paragraphs: [
      `Depending on your jurisdiction, you may have rights to access, correct,
      update, delete, restrict, or object to certain processing of your
      personal information, as well as rights relating to data portability or
      withdrawal of consent.`,
      `You may also revoke OAuth access previously granted to Registered
      Applications through your account settings. Revocation prevents new access
      going forward but does not retroactively recover data already shared with
      a Registered Application.`
    ]
  },
  {
    title: 'VIII. International Transfers and Processors',
    paragraphs: [
      `We may use infrastructure providers, email services, security vendors,
      and other service providers that process information on our behalf under
      appropriate contractual and security obligations.`,
      `Where information is transferred across jurisdictions, we will take
      reasonable steps to ensure appropriate safeguards are in place as required
      by applicable data protection laws.`
    ]
  },
  {
    title: 'IX. Changes to this Privacy Policy',
    paragraphs: [
      `We may update this Privacy Policy from time to time to reflect
      operational, legal, or regulatory changes. Continued use of the Service
      after an updated policy becomes effective constitutes acknowledgment of
      the revised policy.`
    ]
  }
];

function AuthPrivacySection(props: LegalSection) {
  //props
  const { title, paragraphs } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <section className="auth-legal-section">
      <h2 className="auth-legal-section-title">{_(title)}</h2>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="auth-legal-copy">
          {_(paragraph)}
        </p>
      ))}
    </section>
  );
}

export function AuthPrivacyBody() {
  //hooks
  const { _ } = useLanguage();
  const config = useConfig();
  //variables
  const base = config.path('auth.base', '/auth');
  //render
  return (
    <main className="auth-page auth-legal-page">
      <div className="container">
        {config.has('brand', 'logo') ? (
          <img
            height="50"
            alt={config.path('brand.name')}
            src={config.path('brand.logo')}
            className="logo"
          />
        ) : config.withPath.has('brand.name') ? (
          <h2 className="brand">{config.path('brand.name')}</h2>
        ) : null}
        <section className="auth-modal">
          <header>
            <i className="fas fa-fw fa-shield-halved icon" />
            <h1 className="title">{_('Privacy Policy')}</h1>
          </header>
          <div className="auth-legal-content">
            <a href="/" className="auth-legal-back">
              <i className="fas fa-arrow-left" />
              <span>{_('Back to Home')}</span>
            </a>
            <div className="auth-legal-introduction">
              {introduction.map((paragraph, index) => (
                <p key={index} className="auth-legal-copy">
                  {_(paragraph)}
                </p>
              ))}
            </div>
            {sections.map((section, index) => (
              <AuthPrivacySection key={index} {...section} />
            ))}
            <div className="auth-legal-footer">
              <a href={`${base}/terms-of-use`} className="auth-legal-action">
                <span>{_('View Terms of Use')}</span>
                <i className="fas fa-arrow-right" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export function AuthPrivacyHead(props: AuthPageProps) {
  //props
  const { data, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const { favicon = '/favicon.ico' } = data?.brand || {};
  const mimetype = favicon.endsWith('.png')
    ? 'image/png'
    : favicon.endsWith('.svg')
    ? 'image/svg+xml'
    : 'image/x-icon';
  //render
  return (
    <>
      <title>{_('Privacy Policy')}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
};

export function AuthPrivacyPage(props: AuthPageProps) {
  return (
    <LayoutBlank {...props}>
      <AuthPrivacyBody />
    </LayoutBlank>
  );
};

export const Head = AuthPrivacyHead;
export default AuthPrivacyPage;
