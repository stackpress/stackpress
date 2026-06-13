//--------------------------------------------------------------------//
// Types

// HomeResults is the page payload for the documentation landing page.
export type HomeResults = {
  description: string,
  guideCount?: number,
  guideJourney?: NavItem[],
  paths: ShelfCard[],
  title: string
};

// NavGroup describes one visible sidebar section and its guide links.
export type NavGroup = {
  label: string,
  level?: number,
  items: NavItem[]
};

// NavItem describes one sidebar or mobile navigation link.
export type NavItem = {
  href: string,
  label: string,
  level?: number
};

// DocsPageResults is the page payload shared by dev routes and static builds.
export type DocsPageResults = {
  active: string,
  content: string,
  description: string,
  eyebrow: string,
  guideCount?: number,
  guideJourney?: NavItem[],
  guideLevel?: number,
  nav: NavGroup[],
  next?: PagerItem,
  previous?: PagerItem,
  section: SiteSection,
  title: string,
  toc: TocItem[]
};

// PagerItem describes a previous or next article link.
export type PagerItem = {
  href: string,
  label: string
};

// ShelfCard describes one guide or API card on a shelf page.
export type ShelfCard = {
  description: string,
  href: string,
  label: string,
  level?: number
};

// ShelfResults is the page payload for guide and API index pages.
export type ShelfResults = {
  cards: ShelfCard[],
  description: string,
  eyebrow: string,
  guideCount?: number,
  guideJourney?: NavItem[],
  section: SiteSection,
  title: string
};

// SiteSection keeps shared shell behavior explicit by section.
export type SiteSection = 'home' | 'guides' | 'api';

// TocItem describes one generated heading anchor in an article.
export type TocItem = {
  id: string,
  level: number,
  text: string
};
