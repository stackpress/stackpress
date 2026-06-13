//node
import fs from 'node:fs/promises';
import path from 'node:path';

//--------------------------------------------------------------------//
// Types

export type TocItem = {
  id: string;
  level: number;
  text: string;
};

export type ParsedMarkdown = {
  title: string;
  description: string;
  html: string;
  toc: TocItem[];
};

//--------------------------------------------------------------------//
// Paths

export const wwwRoot = path.resolve(import.meta.dirname, '../..');
export const repoRoot = path.resolve(wwwRoot, '../..');
export const specsRoot = path.join(repoRoot, 'specs');

export function specPath(...segments: string[]) {
  return path.join(specsRoot, ...segments);
}

//--------------------------------------------------------------------//
// Markdown

export async function readMarkdownDoc(file: string) {
  const markdown = await fs.readFile(file, 'utf8');
  return markdownToHtml(markdown);
}

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

    if (inCode) {
      code.push(raw);
      continue;
    }

    if (!line.trim()) {
      closeParagraph();
      closeList();
      closeTable();
      continue;
    }

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

export function rewriteMarkdownLinks(html: string) {
  return html.replace(/href="([^"]+)\.md(#[^"]*)?"/g, (_match, href, hash = '') => {
    let next = href;
    if (next.endsWith('/README')) {
      next = next.slice(0, -'/README'.length);
    } else if (next.endsWith('/index')) {
      next = next.slice(0, -'/index'.length);
    }
    return `href="${next}${hash}"`;
  });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function stripMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
