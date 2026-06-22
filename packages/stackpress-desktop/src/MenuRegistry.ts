//client
import type {
  DesktopCompiledMenuGroup,
  DesktopMenuContribution
} from './types.js';

//Stored menu entries pair the contribution with insertion order so stable
// sorting can fall back to the original registration sequence.
type StoredContribution = {
  item: DesktopMenuContribution;
  order: number;
};

//Menu registry options let the desktop plugin seed framework-owned items while
// still using the same registry path as application contributions.
export type MenuRegistryOptions = {
  nativeEditMenu?: boolean;
  updatePlaceholder?: boolean;
};

//The default application menu order keeps native-feeling menu placement before
// custom menu names are sorted alphabetically.
const DEFAULT_MENU_ORDER = [
  'app',
  'file',
  'edit',
  'view',
  'window',
  'help'
];

//Menu labels are shared by compiled runtime menus and generated Electron main
// source so both paths render the same native menu captions.
const MENU_LABELS: Record<string, string> = {
  app: 'App',
  file: 'File',
  edit: 'Edit',
  view: 'View',
  window: 'Window',
  help: 'Help'
};

//Native edit roles keep standard text editing accelerators available when the
// desktop shell installs an app-defined menu instead of Electron's default.
const NATIVE_EDIT_MENU_ITEMS: DesktopMenuContribution[] = [
  { id: 'desktop:edit-undo', menu: 'edit', role: 'undo', priority: 10 },
  { id: 'desktop:edit-redo', menu: 'edit', role: 'redo', priority: 20 },
  { id: 'desktop:edit-cut', menu: 'edit', role: 'cut', priority: 30 },
  { id: 'desktop:edit-copy', menu: 'edit', role: 'copy', priority: 40 },
  { id: 'desktop:edit-paste', menu: 'edit', role: 'paste', priority: 50 },
  {
    id: 'desktop:edit-paste-and-match-style',
    menu: 'edit',
    role: 'pasteAndMatchStyle',
    priority: 60
  },
  { id: 'desktop:edit-delete', menu: 'edit', role: 'delete', priority: 70 },
  {
    id: 'desktop:edit-select-all',
    menu: 'edit',
    role: 'selectAll',
    priority: 80
  }
];

/**
 * Collect desktop menu contributions and compile them into Electron-ready
 * groups that callers can pass to runtime or generated main process code.
 */
export default class MenuRegistry {
  //The id set guards every top-level and nested menu contribution so Electron
  // templates do not receive ambiguous menu item identifiers.
  protected ids = new Set<string>();

  //The stored contribution list preserves registration order for stable
  // tie-breaking after priority and label sorting have been applied.
  protected items: StoredContribution[] = [];

  //The next insertion number is assigned before every push and only increases
  // through add(), which keeps the registry deterministic.
  protected order = 0;

  //The registry options are retained so future registry behavior can inspect
  // the seed choices that were used when the registry was created.
  protected options: MenuRegistryOptions;

  /**
   * Create a menu registry and optionally seed framework-owned menu entries.
   */
  public constructor(options: MenuRegistryOptions = {}) {
    this.options = options;

    //if requested, seed the native edit roles before app code contributes so
    // copy/paste shortcuts survive custom application menus.
    if (options.nativeEditMenu) {
      for (const item of NATIVE_EDIT_MENU_ITEMS) {
        this.add(item);
      }
    }

    //if requested, seed the update placeholder before app code contributes
    // menu items so normal priority sorting can place it later.
    if (options.updatePlaceholder) {
      this.add({
        id: 'desktop:update-placeholder',
        menu: 'app',
        label: 'Check for Updates',
        enabled: false,
        event: 'desktop:update-check',
        priority: 1000
      });
    }
  }

  /**
   * Add one contribution to the registry after validating nested ids.
   */
  public add(item: DesktopMenuContribution) {
    //first reserve all ids in the contribution tree
    this.assertUnique(item);

    //then store the original insertion order for deterministic tie-breaking
    this.items.push({ item, order: this.order++ });
    return this;
  }

  /**
   * Return the registered menu contributions in registration order.
   */
  public list() {
    //return only contribution payloads so callers cannot mutate sort metadata
    return this.items.map(entry => entry.item);
  }

  /**
   * Compile registered contributions into sorted groups and sorted items.
   */
  public compile(): DesktopCompiledMenuGroup[] {
    const groups = new Map<string, StoredContribution[]>();

    //for each stored contribution, group items by their target native menu
    for (const entry of this.items) {
      const group = groups.get(entry.item.menu) || [];
      group.push(entry);
      groups.set(entry.item.menu, group);
    }

    //then order the menu groups and each group's entries independently
    return Array.from(groups.entries())
      .sort(([ left ], [ right ]) => this.compareMenus(left, right))
      .map(([ menu, entries ]) => ({
        menu,
        items: this.sortEntries(entries).map(entry => this.sortItem(entry.item))
      }));
  }

  /**
   * Reserve a contribution id and every nested submenu id.
   */
  protected assertUnique(item: DesktopMenuContribution) {
    //if the id already exists, fail before mutating the registry with a dup
    if (this.ids.has(item.id)) {
      throw new Error(`Duplicate desktop menu contribution id: ${item.id}`);
    }

    //once the current id is reserved, recurse through any nested submenus
    this.ids.add(item.id);
    for (const child of item.submenu || []) {
      this.assertUnique(child);
    }
  }

  /**
   * Compare two native menu names using the default order before alpha order.
   */
  protected compareMenus(left: string, right: string) {
    const leftIndex = DEFAULT_MENU_ORDER.indexOf(left);
    const rightIndex = DEFAULT_MENU_ORDER.indexOf(right);

    //if either menu is a known native menu, known menus come before custom ones
    if (leftIndex !== -1 || rightIndex !== -1) {
      return (leftIndex === -1 ? DEFAULT_MENU_ORDER.length : leftIndex)
        - (rightIndex === -1 ? DEFAULT_MENU_ORDER.length : rightIndex);
    }

    //otherwise custom menus sort alphabetically for repeatable output
    return left.localeCompare(right);
  }

  /**
   * Sort stored menu entries by priority, label, then registration order.
   */
  protected sortEntries(entries: StoredContribution[]) {
    return [ ...entries ].sort((left, right) => {
      //priority is the primary sort because app code can use it intentionally
      const priority = (left.item.priority || 0) - (right.item.priority || 0);
      if (priority) {
        return priority;
      }

      //labels make equal priorities readable, then insertion order stays stable
      const label = (left.item.label || '').localeCompare(right.item.label || '');
      return label || left.order - right.order;
    });
  }

  /**
   * Return a contribution with any nested submenu sorted recursively.
   */
  protected sortItem(item: DesktopMenuContribution): DesktopMenuContribution {
    //leaf items can be reused as-is because no nested order needs changing
    if (!item.submenu?.length) {
      return item;
    }

    //nested items use their local submenu index as insertion order
    const submenu = item.submenu
      .map((child, order) => ({ item: child, order }))
      .sort((left, right) => {
        //priority wins within the submenu just like it does at the top level
        const priority = (left.item.priority || 0) - (right.item.priority || 0);
        if (priority) {
          return priority;
        }

        //then label and original submenu order keep output deterministic
        const label = (left.item.label || '').localeCompare(right.item.label || '');
        return label || left.order - right.order;
      })
      .map(entry => this.sortItem(entry.item));

    //return a shallow clone so callers keep the original contribution object
    return { ...item, submenu };
  }

  /**
   * Resolve the display label for a native or custom menu key.
   */
  public static labelForMenu(menu: string) {
    //known native menus receive title labels, custom menus keep their key
    return MENU_LABELS[menu] || menu;
  }
}
