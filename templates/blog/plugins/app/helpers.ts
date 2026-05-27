//--------------------------------------------------------------------//
// Types

export type ContentSignal = {
  label: string;
  value: string;
};

export type ArticleComment = {
  id: string;
  comment?: string | null;
};

const articleDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC'
});

//--------------------------------------------------------------------//
// Helpers

export function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function formatArticleDate(dateString?: string | Date | number | null) {
  if (!dateString) {
    return 'Unscheduled';
  }

  return articleDateFormatter.format(new Date(dateString));
}

export function getFeaturedArticle<T>(articles: T[]) {
  return [articles[0] || null, articles.slice(1)] as const;
}

export function getArticleSummary(
  article: { contents?: string | null },
  limit = 160
) {
  const text = stripHtml(article.contents || '');

  if (!text) {
    return 'Open the article to read the full entry.';
  }

  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, Math.max(0, limit)).trimEnd()}...`;
}

export function getReadingTimeLabel(contents?: string | null) {
  const words = stripHtml(contents || '').split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));

  return `${minutes} min read`;
}

export function getContentSignals(
  articles: Array<{ published?: string | Date | null; banner?: string | null; }>
) {
  const latest = articles.reduce<number | null>((max, article) => {
    if (!article.published) {
      return max;
    }

    const next = new Date(article.published).getTime();

    if (Number.isNaN(next)) {
      return max;
    }

    if (max === null || next > max) {
      return next;
    }

    return max;
  }, null);
  const visuals = articles.filter(article => article.banner).length;

  return [
    { label: 'Published', value: String(articles.length) },
    { label: 'With Visuals', value: String(visuals) },
    { label: 'Latest', value: formatArticleDate(latest) }
  ] satisfies ContentSignal[];
}

export function getTopicHighlights() {
  return [
    'Systems and platform notes',
    'Design-aware implementation details',
    'Operational thinking for product builders',
    'Patterns that scale from content to application UI'
  ];
}

export function getCommentCountLabel(comments: ArticleComment[] = []) {
  if (!comments.length) {
    return 'No comments yet';
  }

  if (comments.length === 1) {
    return '1 comment';
  }

  return `${comments.length} comments`;
}
