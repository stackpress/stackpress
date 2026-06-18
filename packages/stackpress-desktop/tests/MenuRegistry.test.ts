import { describe, it } from 'mocha';
import { expect } from 'chai';

import MenuRegistry from '../src/MenuRegistry.js';

describe('desktop/MenuRegistry', () => {
  it('should group contributions by target menu', () => {
    const registry = new MenuRegistry();
    registry.add({ id: 'about', menu: 'app', label: 'About' });
    registry.add({ id: 'docs', menu: 'help', label: 'Docs' });

    expect(registry.compile().map(group => group.menu)).to.deep.equal([ 'app', 'help' ]);
  });

  it('should sort deterministically', () => {
    const registry = new MenuRegistry();
    registry.add({ id: 'second', menu: 'file', label: 'Second', priority: 20 });
    registry.add({ id: 'first', menu: 'file', label: 'First', priority: 10 });
    registry.add({ id: 'third', menu: 'file', label: 'Third', priority: 20 });

    expect(registry.compile()[0].items.map(item => item.id)).to.deep.equal([
      'first',
      'second',
      'third'
    ]);
  });

  it('should reject duplicate ids', () => {
    const registry = new MenuRegistry();
    registry.add({ id: 'docs', menu: 'help', label: 'Docs' });

    expect(() => registry.add({ id: 'docs', menu: 'help', label: 'Docs Again' }))
      .to.throw(/duplicate.*docs/i);
  });

  it('should retain event-backed items', () => {
    const registry = new MenuRegistry();
    registry.add({
      id: 'refresh-content',
      menu: 'view',
      label: 'Refresh Content',
      event: 'desktop:refresh-content'
    });

    expect(registry.compile()[0].items[0].event).to.equal('desktop:refresh-content');
  });

  it('should include a disabled update placeholder', () => {
    const registry = new MenuRegistry({ updatePlaceholder: true });
    const appMenu = registry.compile().find(group => group.menu === 'app');

    expect(appMenu?.items.find(item => item.id === 'desktop:update-placeholder'))
      .to.include({ enabled: false });
  });

  it('should preserve nested submenus with deterministic child ordering', () => {
    const registry = new MenuRegistry();
    registry.add({
      id: 'tools',
      menu: 'view',
      label: 'Tools',
      submenu: [
        { id: 'tools-second', menu: 'view', label: 'Second', priority: 20 },
        { id: 'tools-first', menu: 'view', label: 'First', priority: 10 }
      ]
    });

    const tools = registry.compile()[0].items[0];

    expect(tools.submenu?.map(item => item.id)).to.deep.equal([
      'tools-first',
      'tools-second'
    ]);
  });

  it('should retain role and enabled state for Electron menu compilation', () => {
    const registry = new MenuRegistry();
    registry.add({
      id: 'reload',
      menu: 'view',
      label: 'Reload',
      role: 'reload',
      enabled: false
    });

    expect(registry.compile()[0].items[0]).to.include({
      role: 'reload',
      enabled: false
    });
  });

  it('should break priority ties by label before insertion order', () => {
    const registry = new MenuRegistry();
    registry.add({ id: 'zulu', menu: 'help', label: 'Zulu', priority: 10 });
    registry.add({ id: 'alpha', menu: 'help', label: 'Alpha', priority: 10 });
    registry.add({ id: 'beta', menu: 'help', label: 'Beta', priority: 10 });

    expect(registry.compile()[0].items.map(item => item.id)).to.deep.equal([
      'alpha',
      'beta',
      'zulu'
    ]);
  });

  it('should reject duplicate ids inside nested submenus', () => {
    const registry = new MenuRegistry();

    expect(() => registry.add({
      id: 'tools',
      menu: 'view',
      label: 'Tools',
      submenu: [
        { id: 'tools', menu: 'view', label: 'Duplicate' }
      ]
    })).to.throw(/duplicate.*tools/i);
  });

  it('should use the reserved update event for the disabled placeholder', () => {
    const registry = new MenuRegistry({ updatePlaceholder: true });
    const appMenu = registry.compile().find(group => group.menu === 'app');
    const update = appMenu?.items.find(item => (
      item.id === 'desktop:update-placeholder'
    ));

    expect(update).to.include({
      enabled: false,
      event: 'desktop:update-check'
    });
  });
});
