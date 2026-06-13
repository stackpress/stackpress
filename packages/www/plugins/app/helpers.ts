//node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
//modules
import { setViewProps } from 'stackpress/view';
//client
import type { TocItem } from './types.js';

//--------------------------------------------------------------------//
// Types

// ParsedMarkdown is the HTML payload created from source Markdown files.
export type ParsedMarkdown = {
  title: string;
  description: string;
  html: string;
  toc: TocItem[];
};

//--------------------------------------------------------------------//
// Paths

const dirname = path.dirname(fileURLToPath(import.meta.url));

// wwwRoot points at the website package root.
export const wwwRoot = path.resolve(dirname, '../..');

// repoRoot points at the monorepo root for source-backed docs lookup.
export const repoRoot = path.resolve(wwwRoot, '../..');

// specsRoot points at the Markdown specs used by guide and API pages.
export const specsRoot = path.join(repoRoot, 'specs');

/**
 * Builds an absolute path inside the repository specs folder.
 */
export function specPath(...segments: string[]) {
  return path.join(specsRoot, ...segments);
}

/**
 * Applies Stackpress view props from a data route before rendering a view.
 */
export function setDocsViewProps(
  req: Parameters<typeof setViewProps>[0],
  res: Parameters<typeof setViewProps>[1],
  ctx: unknown
) {
  setViewProps(req, res, ctx as Parameters<typeof setViewProps>[2]);
}

//--------------------------------------------------------------------//
// Markdown

/**
 * Reads one Markdown source file and converts it into renderable HTML.
 */
export async function readMarkdownDoc(file: string) {
  const markdown = await fs.readFile(file, 'utf8');
  return markdownToHtml(markdown);
}

/**
 * Converts a constrained Markdown subset into docs-page HTML.
 */
export function markdownToHtml(markdown: string): ParsedMarkdown {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const toc: TocItem[] = [];
  const html: string[] = [];
  let title = '';
  let description = '';
  let paragraph: string[] = [];
  let list: string[] = [];
  let code: string[] = [];
  let codeLanguage = '';
  let table: string[][] = [];
  let inCode = false;

  const closeParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(' ').trim();
    if (!description) {
      description = stripMarkdown(text);
    }
    html.push(`<p>${inlineMarkdown(text)}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!list.length) return;
    html.push(`<ul>${list.map(item => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`);
    list = [];
  };

  const closeTable = () => {
    if (!table.length) return;
    const [head, ...body] = table;
    const header = head.map(cell => `<th>${inlineMarkdown(cell)}</th>`).join('');
    const rows = body.map(row => (
      `<tr>${row.map(cell => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`
    ));
    html.push(`<table><thead><tr>${header}</tr></thead><tbody>${rows.join('')}</tbody></table>`);
    table = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    // fenced blocks either become highlighted code or Mermaid diagrams
    if (line.startsWith('```')) {
      closeParagraph();
      closeList();
      closeTable();
      if (inCode) {
        if (codeLanguage.toLowerCase() === 'mermaid') {
          html.push(`<div class="mermaid">${escapeHtml(code.join('\n'))}</div>`);
        } else {
          const className = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : '';
          html.push(`<pre><code${className}>${escapeHtml(code.join('\n'))}</code></pre>`);
        }
        code = [];
        codeLanguage = '';
        inCode = false;
      } else {
        codeLanguage = line.replace(/^```/, '').trim().split(/\s+/)[0] || '';
        inCode = true;
      }
      continue;
    }

    // code block content is preserved until the closing fence
    if (inCode) {
      code.push(raw);
      continue;
    }

    // blank lines close any open block-level structure
    if (!line.trim()) {
      closeParagraph();
      closeList();
      closeTable();
      continue;
    }

    // headings create both article headings and table-of-contents entries
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      closeParagraph();
      closeList();
      closeTable();
      const level = heading[1].length;
      const text = stripMarkdown(heading[2]);
      const id = slugify(text);
      if (!title && level === 1) {
        title = text;
      } else if (level > 1 && level < 4) {
        toc.push({ id, level, text });
      }
      html.push(`<h${level} id="${id}">${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    // simple Markdown tables are collected until the next block closes them
    if (/^\|.+\|$/.test(line)) {
      closeParagraph();
      closeList();
      const cells = line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(cell => cell.trim());
      if (!cells.every(cell => /^:?-{3,}:?$/.test(cell))) {
        table.push(cells);
      }
      continue;
    }

    // unordered and ordered Markdown lists render as compact HTML lists
    const bullet = /^\s*[-*]\s+(.+)$/.exec(line);
    if (bullet) {
      closeParagraph();
      closeTable();
      list.push(bullet[1]);
      continue;
    }

    const ordered = /^\s*\d+\.\s+(.+)$/.exec(line);
    if (ordered) {
      closeParagraph();
      closeTable();
      list.push(ordered[1]);
      continue;
    }

    paragraph.push(line.trim());
  }

  closeParagraph();
  closeList();
  closeTable();

  return {
    title: title || 'Untitled',
    description,
    html: rewriteMarkdownLinks(html.join('\n')),
    toc
  };
}

/**
 * Rewrites Markdown-relative links into static-site route URLs.
 */
export function rewriteMarkdownLinks(html: string) {
  return html.replace(/href="([^"]+)\.md(#[^"]*)?"/g, (_match, href, hash = '') => {
    let next = href;
    if (next.endsWith('/README')) {
      next = `${next.slice(0, -'/README'.length)}/overview`;
    } else if (next.endsWith('/index')) {
      next = next.slice(0, -'/index'.length);
    }
    return `href="${next}${hash}"`;
  });
}

/**
 * Converts heading text into a predictable anchor id.
 */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Removes inline Markdown syntax from text used for metadata.
 */
export function stripMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Converts a constrained inline Markdown subset into escaped HTML.
 */
function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

/**
 * Escapes text before inserting it into generated HTML strings.
 */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
