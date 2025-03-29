import type { PageHeadProps, PageBodyProps, AdminDataProps } from "stackpress/view";
import type { SearchParams } from "stackpress/sql";
import type { ProfileExtended } from "../../types";
import { useLanguage } from "r22n";
import { Crumbs, LayoutAdmin } from "stackpress/view";

export function AdminProfileRemoveCrumbs(props: { root: string, results: ProfileExtended }) {

        const { root, results } = props;
        //hooks
        const { _ } = useLanguage();
        //variables
        const crumbs = [
          {
            label: (
              <span className="theme-info">{_('Profiles')}</span>
            ),
            icon: 'user',
            href: `${root}/profile/search`
          },
          {
            label: (
              <span className="theme-info">
                {`${results?.name || ''}`}
              </span>
            ),
            icon: 'user',
            href: `${root}/profile/detail/${results.id}`
          },
          {
            label: _('Remove'),
            icon: 'trash'
          }
        ];
        return (<Crumbs crumbs={crumbs} />);
      
}

export function AdminProfileRemoveForm(props: { root: string, results: ProfileExtended }) {

        const { root, results } = props;
        const { _ } = useLanguage();
        return (
          <div>
            <div className="theme-bg-bg1 px-fs-16 px-p-20">
              <i className="px-mr-5 inline-block fas fa-fw fa-info-circle"></i>
              <strong className="font-semibold">
                {_(
                  'Are you sure you want to remove %s forever?', 
                  `${results?.name || ''}`
                )}
              </strong> 
              <br />
              <em className="px-fs-14">{_('(Thats a real long time)')}</em>
            </div>
            <div className="px-mt-20">
              <a 
                className="theme-bg-muted px-px-14 px-py-10 inline-block rounded" 
                href={`${root}/profile/detail/${results.id}`}
              >
                <i className="px-mr-5 inline-block fas fa-fw fa-arrow-left"></i>
                <span>Nevermind.</span>
              </a>
              <a 
                className="theme-bg-error px-px-14 px-py-10 px-ml-10 inline-block rounded" 
                href="?confirmed=true"
              >
                <i className="px-mr-5 inline-block fas fa-fw fa-trash"></i>
                <span>{_('Confirmed')}</span>
              </a>
            </div>
          </div>
        ); 
      
}

export function AdminProfileRemoveBody(props: PageBodyProps<AdminDataProps, Partial<SearchParams>, ProfileExtended>) {

        const { data, response } = props;
        const { root = '/admin' } = data.admin || {};
        const results = response.results as ProfileExtended;
        //render
        return (
          <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
            <div className="px-px-10 px-py-14 theme-bg-bg2">
              <AdminProfileRemoveCrumbs root={root} results={results} />
            </div>
            <div className="px-p-10">
              <AdminProfileRemoveForm root={root} results={results} />
            </div>
          </main>
        );
      
}

export function AdminProfileRemoveHead(props: PageHeadProps<AdminDataProps, Partial<SearchParams>, ProfileExtended>) {

        const { data, styles = [] } = props;
        const { _ } = useLanguage();
        return (
          <>
            <title>{_('Remove Profile')}</title>
            {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
            <link rel="stylesheet" type="text/css" href="/styles/global.css" />
            {styles.map((href, index) => (
              <link key={index} rel="stylesheet" type="text/css" href={href} />
            ))}
          </>
        );  
      
}

export function AdminProfileRemovePage(props: PageBodyProps<AdminDataProps, Partial<SearchParams>, ProfileExtended>) {

        const { data, session, request } = props;
        const theme = request.session.theme as string | undefined;
        const {
          root = '/admin',
          name = 'Admin',
          logo = '/images/logo-square.png',
          menu = []
        } = data.admin;
        const path = request.url.pathname;
        return (
          <LayoutAdmin
            theme={theme} 
            brand={name}
            base={root}
            logo={logo}
            path={path} 
            menu={menu}
            session={session}
          >
            <AdminProfileRemoveBody {...props} />
          </LayoutAdmin>
        );  
      
}

export const Head = AdminProfileRemoveHead;
export default AdminProfileRemovePage;
