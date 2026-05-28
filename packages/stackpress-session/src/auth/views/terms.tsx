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
  `These Terms of Use (“Terms”) govern access to and use of the Single Sign-On
  authentication platform (the “Service”) operated by Shoppable Business
  Incorporated (“Company”, “we”, “us”, or “our”). The Service enables users to
  authenticate once and securely access integrated business-to-business
  applications (“Registered Applications”) through standardized OAuth
  authorization mechanisms.`,
  `By creating an account, authenticating through the Service, or authorizing a
  Registered Application to access account data, you agree to be legally bound
  by these Terms. If you do not agree to these Terms, you must not use the
  Service.`,
  `If you are using the Service on behalf of a company or organization, you
  represent and warrant that you are authorized to bind that entity to these
  Terms.`
];

const sections: LegalSection[] = [
  {
    title: 'I. Nature of the Service',
    paragraphs: [
      `The Service functions as an identity and authentication provider. It
      verifies user credentials, maintains identity records, manages session
      tokens, and transmits authorized data to Registered Applications pursuant
      to OAuth authorization granted by users.`,
      `The Company does not operate, control, or assume responsibility for the
      services, products, or content of Registered Applications. Once a user
      authorizes a Registered Application to access certain data, that
      application operates independently and is governed by its own terms and
      privacy policy.`
    ]
  },
  {
    title: 'II. Account Registration and Eligibility',
    paragraphs: [
      `To use the Service, users must create an account using a username, email
      address, phone number, or an approved third-party authentication provider
      such as Google. Users must provide accurate, current, and complete
      information during registration and must maintain the accuracy of such
      information.`,
      `The Service is intended for business and professional use. Users must be
      at least 18 years of age or the age of majority in their jurisdiction to
      create an account.`,
      `You are responsible for maintaining the confidentiality of your login
      credentials and for all activities that occur under your account.`
    ]
  },
  {
    title: 'III. OAuth Authorization and Data Sharing',
    paragraphs: [
      `The Service uses OAuth standards to allow Registered Applications to
      request access to user data. When a Registered Application requests
      access, users are presented with a consent interface specifying the
      categories of data requested. Authorization is granted only after explicit
      user approval.`,
      `By approving a scope request, you instruct the Company to transmit the
      requested data to the Registered Application. You acknowledge that once
      transmitted, the data is subject to the Registered Application’s own data
      handling practices.`,
      `Users may revoke access to any Registered Application at any time through
      their account settings. Revocation will terminate future data access but
      does not affect data already obtained by the Registered Application.`
    ]
  },
  {
    title: 'IV. User Obligations',
    paragraphs: [
      `Users agree to use the Service solely for lawful purposes and in
      compliance with all applicable laws and regulations. Users must not
      attempt to interfere with the integrity, security, or proper functioning
      of the Service.`,
      `Users must not attempt to gain unauthorized access to accounts, tokens,
      authentication systems, or infrastructure. Automated abuse, credential
      stuffing, token harvesting, reverse engineering, or exploitation of
      vulnerabilities is strictly prohibited.`,
      `Users are responsible for ensuring that their use of Registered
      Applications complies with all applicable contractual and legal
      requirements.`
    ]
  },
  {
    title: 'V. Security and Availability',
    paragraphs: [
      `The Company implements reasonable technical and organizational measures
      to protect the security of the Service. However, no system can be
      guaranteed to be entirely secure or uninterrupted. The Company does not
      warrant that the Service will be error-free, continuously available, or
      immune from unauthorized access.`,
      `The Company reserves the right to suspend or restrict access to accounts
      where security risks, suspected abuse, or violations of these Terms are
      detected.`
    ]
  },
  {
    title: 'VI. Intellectual Property',
    paragraphs: [
      `All intellectual property rights in and to the Service, including
      software, infrastructure, branding, and documentation, remain the
      exclusive property of the Company or its licensors. These Terms do not
      grant users any ownership rights in the Service.`,
      `Users retain ownership of the personal data and content they submit but
      grant the Company a limited license to process such data solely for the
      purpose of operating the Service.`
    ]
  },
  {
    title: 'VII. Third-Party Applications',
    paragraphs: [
      `Registered Applications operate independently from the Service. The
      Company does not endorse, guarantee, or assume responsibility for the
      functionality, security, or compliance of any Registered Application.`,
      `Users acknowledge that interactions with Registered Applications are
      governed by separate agreements between the user and the application
      provider. The Company shall not be liable for damages arising from the use
      of Registered Applications.`
    ]
  },
  {
    title: 'VIII. Limitation of Liability',
    paragraphs: [
      `To the fullest extent permitted by law, the Company shall not be liable
      for indirect, incidental, consequential, special, or punitive damages
      arising out of or related to the use of the Service.`,
      `The Company's total aggregate liability for claims arising out of or
      relating to the Service shall not exceed the greater of one hundred euros
      (€100) or the total amount paid by the user, if any, for access to the
      Service during the twelve months preceding the claim.`,
      `Nothing in these Terms limits liability where such limitation is
      prohibited by law.`
    ]
  },
  {
    title: 'IX. Indemnification',
    paragraphs: [
      `Users agree to indemnify and hold harmless the Company from and against
      any claims, liabilities, damages, losses, and expenses arising from misuse
      of the Service, violation of these Terms, or infringement of third-party
      rights.`
    ]
  },
  {
    title: 'X. Termination',
    paragraphs: [
      `The Company may suspend or terminate access to the Service if a user
      breaches these Terms or poses a security risk. Users may terminate their
      account at any time by deleting their account through the platform.`,
      `Upon termination, authentication credentials and active session tokens
      will be revoked. Certain data may be retained as required by law or
      legitimate security interests.`
    ]
  },
  {
    title: 'XI. Modifications to the Terms',
    paragraphs: [
      `The Company may update these Terms from time to time. Continued use of
      the Service after the effective date of updated Terms constitutes
      acceptance of the revised Terms.`
    ]
  }
];

function AuthTermsSection(props: LegalSection) {
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

export function AuthTermsBody() {
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
            <i className="fas fa-fw fa-file-contract icon" />
            <h1 className="title">{_('Terms of Use')}</h1>
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
              <AuthTermsSection key={index} {...section} />
            ))}
            <div className="auth-legal-footer">
              <a href={`${base}/privacy-policy`} className="auth-legal-action">
                <span>{_('View Privacy Policy')}</span>
                <i className="fas fa-arrow-right" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export function AuthTermsHead(props: AuthPageProps) {
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
      <title>{_('Terms of Use')}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
};

export function AuthTermsPage(props: AuthPageProps) {
  return (
    <LayoutBlank {...props}>
      <AuthTermsBody />
    </LayoutBlank>
  );
};

export const Head = AuthTermsHead;
export default AuthTermsPage;
