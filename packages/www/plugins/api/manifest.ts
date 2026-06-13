import fs from 'node:fs';
import path from 'node:path';
import { specPath } from '../app/helpers.js';

export const title = 'Find the public surface fast.';
export const description =
  'API reference pages group public imports, config, CLI, and module surfaces for fast lookup.';

const referencesRoot = specPath('references');

function titleFromSlug(slug: string) {
  return slug
    .replace(/\.md$/, '')
    .replace(/^README$/, 'Overview')
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function hrefFromFile(file: string) {
  const relative = path.relative(referencesRoot, file);
  const parts = relative.split(path.sep);
  const slugParts = parts.map(part => {
    const slug = part.replace(/\.md$/, '');
    const isReadme = slug === 'README';
    if (isReadme) return 'overview';
    return slug.toLowerCase();
  }).filter(Boolean);
  return `/api/${slugParts.join('/')}`;
}

function labelFromFile(file: string) {
  const relative = path.relative(referencesRoot, file);
  const parts = relative.split(path.sep);
  const filename = parts[parts.length - 1];
  const title = titleFromSlug(filename);
  if (filename !== 'README.md' || parts.length === 1) return title;
  return `${titleFromSlug(parts[parts.length - 2])} Overview`;
}

function groupFromFile(file: string) {
  const relative = path.relative(referencesRoot, file);
  const parts = relative.split(path.sep);
  return parts.length > 1 ? titleFromSlug(parts[0]) : 'Reference';
}

function readMarkdownFiles(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return readMarkdownFiles(file);
      return entry.isFile() && entry.name.endsWith('.md') ? [file] : [];
    });
}

export const docs = readMarkdownFiles(referencesRoot)
  .map(file => ({
    description: `${labelFromFile(file)} reference.`,
    file,
    group: groupFromFile(file),
    href: hrefFromFile(file),
    label: labelFromFile(file)
  }))
  .sort((a, b) => a.href.localeCompare(b.href));

export const nav = Array.from(new Set(docs.map(doc => doc.group)))
  .map(group => ({
    label: group,
    items: docs
      .filter(doc => doc.group === group)
      .map(({ href, label }) => ({ href, label }))
  }));
