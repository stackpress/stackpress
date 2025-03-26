//modules
import { useLanguage } from 'r22n';
//stackpress
import { LayoutPanel, HeadProps, BodyProps } from 'stackpress/view';
//local
import { ProfileInput, ProfileExtended } from '../types';

type DataProps = {
  icon?: string,
  logo?: string,
  brand?: string,
  base?: string,
  admin: { 
    root: string,
    name: string, 
    logo: string,
    menu: {
      name: string,
      icon: string,
      path: string,
      match: string
    }[]
  }
};

type PageHeadProps = HeadProps<DataProps, Partial<ProfileInput>, ProfileExtended>;
type PageBodyProps = BodyProps<DataProps, Partial<ProfileInput>, ProfileExtended>;

export function Head(props: PageHeadProps) {
  const { data, styles = [] } = props;
  const { _ } = useLanguage();
  return (
    <>
      <title>{_('Profile Detail')}</title>
      {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

export default function ProfileDetailPage(props: PageBodyProps) {
  const { data, request } = props;
  const theme = request.session.theme as string | undefined;
  const { _ } = useLanguage();
  return (
    <LayoutPanel
      theme={theme} 
      brand={data.admin.name}
      base={data.admin.root}
      logo={data.admin.logo}
    >
      <div className="px-p-10">
        <h1>{_('Profile Detail')}</h1>
      </div>
    </LayoutPanel>
  )
}