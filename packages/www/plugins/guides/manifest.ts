import fs from 'node:fs';
import path from 'node:path';
import { specPath } from '../app/helpers.js';

export const title = 'Get from first route to working Stackpress project.';
export const description =
  'Guides organize the hands-on path first, then progressively unlock data, idea, build, structure, built-ins, studio, and AI workflows.';

const guideRoot = specPath('guides');

const groupLabels: Record<string, string> = {
  '000': '000 Orientation',
  '100': '100 Develop',
  '200': '200 Data',
  '300': '300 Idea',
  '400': '400 Build',
  '500': '500 Structure',
  '600': '600 Built-ins',
  '700': '700 Studio',
  '800': '800 AI'
};

function titleFromSlug(slug: string) {
  return slug
    .replace(/^\d{3}-?/, '')
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function labelFromSlug(slug: string) {
  const number = /^\d{3}/.exec(slug)?.[0];
  const title = titleFromSlug(slug);
  return number ? `${number} ${title}` : title;
}

function descriptionFromSlug(slug: string) {
  return `${titleFromSlug(slug)} guide.`;
}

function readDocs() {
  return fs
    .readdirSync(guideRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && /^\d{3}$/.test(entry.name))
    .flatMap(group => fs
      .readdirSync(path.join(guideRoot, group.name), { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => {
        const slug = entry.name.replace(/\.md$/, '');
        return {
          description: descriptionFromSlug(slug),
          file: specPath('guides', group.name, entry.name),
          group: group.name,
          href: `/guides/${slug}`,
          label: labelFromSlug(slug),
          level: group.name === '000' ? 1 : Number(group.name.charAt(0))
        };
      }))
    .sort((a, b) => {
      const level = b.level - a.level;
      return level || a.href.localeCompare(b.href);
    });
}

export const docs = readDocs();

export const readingOrder = [...docs].sort((a, b) => {
  const level = a.level - b.level;
  return level || a.href.localeCompare(b.href);
});

export const nav = Object.entries(groupLabels)
  .map(([group, label]) => {
    const level = group === '000' ? 1 : Number(group.charAt(0));
    return {
      label,
      level,
      items: docs
        .filter(doc => doc.group === group)
        .sort((a, b) => a.href.localeCompare(b.href))
        .map(({ href, label, level }) => ({ href, label, level }))
    };
  })
  .filter(group => group.items.length)
  .sort((a, b) => b.level - a.level);
