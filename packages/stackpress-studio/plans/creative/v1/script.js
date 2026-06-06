const root = document.getElementById('studio-root');
const initialView = document.body.dataset.view || 'models';
const initialOpen = document.body.dataset.open || '';
const initialTab = document.body.dataset.tab || 'content';

const files = {
  'schema.idea': {
    label: 'schema.idea',
    badge: 'main',
    models: [
      { name: 'Article', key: 'article', desc: 'Manages articles and publishing metadata', relations: ['Article.profile_id -> Profile.id : profile'], locked: false },
      { name: 'Application', key: 'app', desc: 'Locked system application resource', relations: ['Application.profile_id -> Profile.id', 'Application.scope_id -> Scope.id'], locked: true }
    ],
    fieldsets: [],
    enums: [
      { name: 'Visibility', key: 'visibility', values: ['public', 'private', 'hidden'], used: 'Article.visibility, File.visibility' }
    ],
    source: 3
  },
  'ideas/blog.idea': {
    label: 'ideas/blog.idea',
    badge: 'use',
    models: [
      { name: 'Comment', key: 'comment', desc: 'Manages comments and moderation state', relations: ['Comment.article_id -> Article.id'], locked: false },
      { name: 'Author', key: 'author', desc: 'Editorial author profile', relations: ['Article.author_id -> Author.id'], locked: false }
    ],
    fieldsets: [],
    enums: [
      { name: 'Article Status', key: 'article_status', values: ['draft', 'review', 'published', 'archived'], used: 'Article.status' }
    ],
    source: 1
  },
  'ideas/shared.idea': {
    label: 'ideas/shared.idea',
    badge: 'use',
    models: [
      { name: 'File', key: 'file', desc: 'Reusable upload metadata', relations: ['File.owner_id -> Profile.id'], locked: false }
    ],
    fieldsets: [
      { name: 'Address', key: 'address', desc: 'Reusable location fields', fields: ['street', 'city', 'region', 'country'], used: 'Article.address' },
      { name: 'SEO', key: 'seo', desc: 'Search and sharing metadata', fields: ['title', 'description', 'image'], used: 'Article, Page' }
    ],
    enums: [],
    source: 2
  }
};

const fields = [
  { label: 'Title', key: 'article_title', type: 'input', validation: 'required', list: 'none', detail: 'none', flags: ['Searchable'] },
  { label: 'Detail', key: 'article_detail', type: 'markdown', validation: 'required', list: 'hide', detail: 'markdown', flags: [] },
  { label: 'Hero Image', key: 'article_image', type: 'image', validation: 'url', list: 'image', detail: 'image', flags: [] },
  { label: 'Tags', key: 'article_tags', type: 'tags', validation: 'option', list: 'tags', detail: 'tags', flags: [] },
  { label: 'Active', key: 'article_active', type: 'switch', validation: 'boolean', list: 'yesno', detail: 'hide', flags: ['Filterable', 'Sortable'] },
  { label: 'Created', key: 'article_created', type: 'datetime', validation: 'date', list: 'relative', detail: 'date', flags: ['Sortable'] }
];

const state = {
  view: initialView,
  file: 'schema.idea',
  drawer: initialOpen,
  tab: initialTab,
  stack: [],
  motion: initialOpen === 'field' ? 'open' : '',
  theme: 'light',
  toast: ''
};

function currentFile() {
  return files[state.file] || files['schema.idea'];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function counts(file) {
  return {
    models: file.models.length,
    fieldsets: file.fieldsets.length,
    enums: file.enums.length,
    source: file.source
  };
}

function viewHref(view) {
  return {
    models: 'index.html',
    fieldsets: 'fieldsets.html',
    enums: 'enums.html',
    source: 'source.html'
  }[view];
}

function setView(view) {
  state.view = view;
  state.drawer = '';
  state.stack = [];
  render();
}

function setFile(file) {
  state.file = file;
  state.view = 'models';
  state.drawer = '';
  state.stack = [];
  flash(`Active file switched to ${file}.`);
  render();
}

function flash(message) {
  state.toast = message;
  window.clearTimeout(flash.timer);
  flash.timer = window.setTimeout(() => {
    state.toast = '';
    render();
  }, 1600);
}

function openDrawer(drawer, tab = 'content') {
  state.drawer = drawer;
  state.tab = tab;
  state.stack = [];
  state.motion = 'open';
  render();
}

function pushDrawer(drawer, tab = 'content') {
  state.stack.push({ drawer: state.drawer, tab: state.tab });
  state.drawer = drawer;
  state.tab = tab;
  state.motion = 'push';
  render();
}

function drawerBack() {
  const previous = state.stack.pop();
  if (previous) {
    state.drawer = previous.drawer;
    state.tab = previous.tab;
    state.motion = 'pop';
  } else {
    state.drawer = '';
    state.motion = '';
  }
  render();
}

function simulate(message) {
  flash(`${message} simulated for design review.`);
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  flash(`${state.theme === 'light' ? 'Light' : 'Dark'} mode preview enabled.`);
  render();
}

function shell() {
  const file = currentFile();
  const c = counts(file);
  const hasDrawer = Boolean(state.drawer);
  return `
    <div class="app ${hasDrawer ? 'has-drawer' : ''}" data-theme="${state.theme}">
      <header class="topbar">
        <div class="brand">
          <img src="assets/stackpress-logo-icon.png" alt="Stackpress">
          <div class="brand-title"><strong>Stackpress Studio</strong><span>${escapeHtml(state.file)} · visual draft</span></div>
        </div>
        <div class="top-actions">
          <button class="button ghost mode-toggle" data-action="theme"><i class="fa-solid fa-${state.theme === 'light' ? 'moon' : 'sun'}" aria-hidden="true"></i>${state.theme === 'light' ? 'Dark' : 'Light'} Mode</button>
          <button class="button ghost" data-action="toast" data-message="Reload"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i>Reload</button>
          <button class="button primary" data-action="toast" data-message="Save changes"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>Save Changes</button>
        </div>
      </header>
      <aside class="sidebar">
        ${sidebarFiles()}
        <section class="side-section">
          <p class="side-title">Studio</p>
          ${sideView('models', 'Models', c.models)}
          ${sideView('fieldsets', 'Fieldsets', c.fieldsets)}
          ${sideView('enums', 'Enums', c.enums)}
          ${sideView('source', 'Source', c.source)}
        </section>
      </aside>
      <main class="main">
        ${mainContent()}
      </main>
      ${hasDrawer ? drawerContent() : ''}
      ${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ''}
    </div>
  `;
}

function sidebarFiles() {
  return `
    <section class="side-head">
      <p class="side-title">Workspace</p>
      <h2>Idea Files</h2>
    </section>
    <section class="side-section">
      ${Object.keys(files).map(file => `
        <button class="side-link ${state.file === file ? 'active' : ''}" data-action="file" data-file="${escapeHtml(file)}">
          <span class="dot"></span><span>${escapeHtml(file)}</span><small>${escapeHtml(files[file].badge)}</small>
        </button>
      `).join('')}
      <button class="button ghost" data-action="open" data-drawer="file" style="width:calc(100% - 18px);margin:10px 9px 0;"><i class="fa-solid fa-file-circle-plus" aria-hidden="true"></i>Add File</button>
    </section>
  `;
}

function sideView(view, label, count) {
  return `
    <button class="side-link ${state.view === view ? 'active' : ''}" data-action="view" data-view="${view}">
      <span class="dot"></span><span>${label}</span><small>${count}</small>
    </button>
  `;
}

function mainContent() {
  if (state.view === 'fieldsets') return fieldsetsView();
  if (state.view === 'enums') return enumsView();
  if (state.view === 'source') return sourceView();
  return modelsView();
}

function mainChrome(title, actionLabel, drawer, toolbarText) {
  return `
    <div class="main-head">
      <div><p class="eyebrow">${escapeHtml(state.file)}</p><h1>${title}</h1></div>
      <div class="top-actions"><button class="button primary" data-action="open" data-drawer="${drawer}"><i class="fa-solid fa-plus" aria-hidden="true"></i>${escapeHtml(actionLabel.replace('+ ', ''))}</button></div>
    </div>
    <div class="toolbar">
      <div class="searchbox">⌕ ${toolbarText}</div>
      <div class="segmented"><button class="active">Active</button><button>Inactive</button></div>
    </div>
  `;
}

function modelsView() {
  const file = currentFile();
  return `
    ${mainChrome('Models', '+ Add Model', 'add-model', 'Search models, descriptions, relations')}
    <div class="content">
      <section class="panel">
        <div class="panel-head"><h2>Model Index <span class="panel-meta">${escapeHtml(state.file)} scoped · relations shown</span></h2></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Model</th><th>Description</th><th>Relations</th></tr></thead>
            <tbody>
              ${file.models.map((model, index) => `
                <tr class="clickable ${index === 0 ? 'selected' : ''}" data-action="open" data-drawer="${model.locked ? 'locked-model' : 'model'}">
                  <td><span class="resource"><strong>${escapeHtml(model.name)}${model.locked ? '<i class="fa-solid fa-lock lock-icon" aria-hidden="true"></i>' : ''}</strong><small>${escapeHtml(model.key)}</small></span></td>
                  <td>${escapeHtml(model.desc)}</td>
                  <td><div class="chip-row">${model.relations.map(relation => `<span class="chip blue">${escapeHtml(relation.split(' : ')[1] || relation.split(' -> ')[1] || relation)}</span>`).join('')}</div></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function fieldsetsView() {
  const rows = currentFile().fieldsets;
  return `
    ${mainChrome('Fieldsets', '+ Add Fieldset', 'add-fieldset', 'Search fieldsets and shared fields')}
    <div class="content">
      <section class="panel">
        <div class="panel-head"><h2>Fieldset Index</h2><div class="chip-row"><span class="chip green">no model-only controls</span></div></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Fieldset</th><th>Description</th><th>Fields</th></tr></thead>
            <tbody>
              ${rows.length ? rows.map((item, index) => `
                <tr class="clickable ${index === 0 ? 'selected' : ''}" data-action="open" data-drawer="fieldset">
                  <td><span class="resource"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.key)}</small></span></td>
                  <td>${escapeHtml(item.desc)}</td>
                  <td>${item.fields.map(field => `<span class="chip">${escapeHtml(field)}</span>`).join(' ')}</td>
                </tr>
              `).join('') : '<tr><td colspan="3"><div class="empty">No fieldsets in this idea file.</div></td></tr>'}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function enumsView() {
  const rows = currentFile().enums;
  return `
    ${mainChrome('Enums', '+ Add Enum', 'add-enum', 'Search enums, values, usage')}
    <div class="content">
      <section class="panel">
        <div class="panel-head"><h2>Enum Index</h2><div class="chip-row"><span class="chip amber">option sets</span></div></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Enum</th><th>Values</th><th>Used By</th></tr></thead>
            <tbody>
              ${rows.length ? rows.map((item, index) => `
                <tr class="clickable ${index === 0 ? 'selected' : ''}" data-action="open" data-drawer="enum">
                  <td><span class="resource"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.key)}</small></span></td>
                  <td>${item.values.map(value => `<span class="chip">${escapeHtml(value)}</span>`).join(' ')}</td>
                  <td>${escapeHtml(item.used)}</td>
                </tr>
              `).join('') : '<tr><td colspan="3"><div class="empty">No enums in this idea file.</div></td></tr>'}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function sourceView() {
  return `
    <div class="main-head">
      <div><p class="eyebrow">${escapeHtml(state.file)}</p><h1>Source</h1></div>
      <div class="top-actions"><button class="button primary" data-action="open" data-drawer="source-file">Edit Source</button></div>
    </div>
    <div class="toolbar"><div class="searchbox">⌕ Search definitions and imports</div><div class="chip-row"><span class="chip green">canonical source</span><span class="chip amber">2 warnings</span></div></div>
    <div class="content source-layout">
      <section class="panel">
        <div class="panel-head"><h2>Import Graph</h2></div>
        <div class="drawer-body">
          <div class="relation-scroll">
            <div class="relation-line"><strong>schema.idea</strong><span>uses</span><span class="chip blue">ideas/blog.idea</span><span class="chip blue">ideas/shared.idea</span></div>
          </div>
          <div class="notice" style="margin-top:12px;">Visual editing is available for known model, type, enum, and column syntax. Unknown syntax remains editable in Source.</div>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><h2>Active File Snippet</h2></div>
        <div class="drawer-body"><pre class="codebox">use "ideas/blog.idea"
use "ideas/shared.idea"

model Article {
  title String @label("Title") @required @searchable
  detail String @field.markdown @view.markdown
}</pre></div>
      </section>
    </div>
  `;
}

function drawerContent() {
  const content = {
    model: modelDrawer(),
    'locked-model': modelDrawer({ locked: true }),
    'add-model': modelDrawer({ add: true }),
    'add-fieldset': addResourceDrawer('Add Fieldset', 'Reusable type definition', ['Singular Name', 'Plural Name', 'Keyword', 'Description']),
    fieldset: fieldsetDrawer(),
    enum: enumDrawer(),
    'add-enum': addResourceDrawer('Add Enum', 'New option set', ['Enum Name', 'Keyword', 'First Value']),
    field: fieldEditor(),
    'add-field': fieldEditor(true),
    icon: iconPicker(),
    relation: relationEditor(),
    file: fileDrawer(),
    'source-file': sourceDrawer(),
    'enum-option': enumOptionDrawer(),
    copy: confirmDrawer('Copy Article Model', 'Creates a draft copy in the active idea file.', 'Copy Model'),
    remove: confirmDrawer('Remove Article Model', 'This is shown as a destructive confirmation screen.', 'Remove Model')
  }[state.drawer] || modelDrawer();
  const motionClass = state.motion ? `drawer-motion-${state.motion}` : 'drawer-steady';

  return `
    <aside class="drawer ${motionClass}" aria-label="Task drawer">
      <div class="drawer-screen">
        ${content}
      </div>
    </aside>
  `;
}

function drawerHeader(title, subtitle, tabs = []) {
  return `
    <header class="drawer-head">
      <button class="icon-button" data-action="back" aria-label="${state.stack.length ? 'Back' : 'Close panel'}"><i class="fa-solid fa-${state.stack.length ? 'chevron-left' : 'xmark'}" aria-hidden="true"></i></button>
      <div class="drawer-title"><h2>${title}</h2><small>${subtitle}</small></div>
    </header>
    ${tabs.length ? `<nav class="drawer-tabs">${tabs.map(tab => `<button class="drawer-tab ${state.tab === tab.id ? 'active' : ''}" data-action="tab" data-tab="${tab.id}">${tab.label}</button>`).join('')}</nav>` : ''}
  `;
}

function modelDrawer(options = {}) {
  const locked = Boolean(options.locked);
  const add = Boolean(options.add);
  const tabs = [{ id: 'content', label: 'Content' }, { id: 'fields', label: 'Fields' }, { id: 'relations', label: 'Relations' }];
  const body = state.tab === 'fields' ? fieldsTab(locked, add) : state.tab === 'relations' ? relationsTab(locked, add) : modelContent(locked, add);
  const title = add ? 'Add Model' : locked ? 'Inspect Application Model' : 'Update Article Model';
  const subtitle = add ? `New model in ${state.file}` : locked ? 'Locked system model from schema.idea' : 'Editable model from schema.idea';
  return `
    ${drawerHeader(title, subtitle, tabs)}
    <section class="drawer-body">${body}</section>
    <footer class="drawer-foot">
      <div class="drawer-actions">
        <button class="button primary" data-action="toast" data-message="${add ? 'Create model' : locked ? 'Copy locked model' : 'Publish model'}"><i class="fa-solid fa-${add ? 'plus' : locked ? 'copy' : 'cloud-arrow-up'}" aria-hidden="true"></i>${add ? 'Create Model' : locked ? 'Copy' : 'Publish'}</button>
        ${add ? '<button class="button" data-action="back"><i class="fa-solid fa-xmark" aria-hidden="true"></i>Cancel</button>' : '<button class="button" data-action="push" data-drawer="copy"><i class="fa-solid fa-copy" aria-hidden="true"></i>Copy</button>'}
        ${add ? '' : `<button class="button danger" ${locked ? 'disabled' : 'data-action="push" data-drawer="remove"'}><i class="fa-solid fa-trash-can" aria-hidden="true"></i>Remove</button>`}
      </div>
    </footer>
  `;
}

function modelContent(locked, add = false) {
  return `
    ${locked ? '<div class="notice">This model is locked. Mutation controls are unavailable, but the structure can be inspected and copied.</div>' : ''}
    <div class="field-grid">
      ${field('Singular Name', add ? '' : locked ? 'Application' : 'Article')}
      ${field('Plural Name', add ? '' : locked ? 'Applications' : 'Articles')}
      ${field('Keyword', add ? '' : locked ? 'app' : 'article')}
      <div class="field"><label>Icon</label><div class="icon-value"><button class="input" data-action="push" data-drawer="icon">${add ? 'fas fa-cube' : 'fas fa-edit'}</button><div class="icon-preview">${add ? '□' : '✎'}</div></div></div>
      ${area('Description', add ? '' : locked ? 'Locked system application' : 'Manages articles and publishing metadata')}
      ${field('Display', add ? '' : '{{article_title}}')}
      ${area('Query', add ? '' : 'id title detail status active created updated')}
    </div>
  `;
}

function fieldsTab(locked, add = false) {
  return `
    <div class="field-grid">
      <button class="button primary" data-action="push" data-drawer="add-field" ${locked ? 'disabled' : ''}><i class="fa-solid fa-plus" aria-hidden="true"></i>Add Field</button>
      ${add ? '<div class="notice">No fields yet. Create the model shell first, or start drafting fields from this tab.</div>' : ''}
      <div style="overflow:auto;">
        ${add ? '<div class="empty">Fields added here will appear as ordered column rows.</div>' : ''}
        ${fields.map(item => `
          <div class="field-row-grid">
            <span class="drag">↕</span>
            <button class="resource button ghost" data-action="push" data-drawer="field"><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.key)}</small></button>
            <div><span class="stack-label">Format</span><div class="chip-row"><span class="chip">Field ${item.type}</span><span class="chip">List ${item.list}</span><span class="chip">Detail ${item.detail}</span></div></div>
            <div><span class="stack-label">Index</span><div class="chip-row">${item.flags.map(flag => `<span class="chip blue">${flag}</span>`).join('') || '<span class="chip">none</span>'}</div></div>
            <div class="row-actions"><button class="icon-button" data-action="toast" data-message="Copy field" aria-label="Copy field"><i class="fa-solid fa-copy" aria-hidden="true"></i></button><button class="icon-button" data-action="toast" data-message="Remove field" aria-label="Remove field"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function relationsTab(locked, add = false) {
  return `
    <div class="field-grid">
      <button class="button primary" data-action="push" data-drawer="relation" ${locked ? 'disabled' : ''}><i class="fa-solid fa-plus" aria-hidden="true"></i>Add Relation</button>
      ${add ? '<div class="notice">No relations yet. Relation rows can be drafted here once the model has a keyword.</div>' : ''}
      <div class="relation-scroll">
        ${add ? '<div class="empty">Relations added here will stay horizontally scannable inside the drawer.</div>' : '<div class="relation-line"><span class="chip">Article.profile_id</span><strong>-></strong><span class="chip">Profile.id</span><strong>:</strong><span class="chip blue">profile</span></div>'}
      </div>
      <div class="notice">Relation rows stay on one line. Wide mappings scroll horizontally inside the drawer.</div>
    </div>
  `;
}

function fieldsetDrawer() {
  const tabs = [{ id: 'content', label: 'Content' }, { id: 'fields', label: 'Fields' }, { id: 'source', label: 'Source' }];
  const body = state.tab === 'fields' ? fieldsTab(false) : state.tab === 'source' ? fieldsetSource() : fieldsetContent();
  return `
    ${drawerHeader('Update Address Fieldset', 'Shared type from ideas/shared.idea', tabs)}
    <section class="drawer-body">${body}</section>
    <footer class="drawer-foot"><div class="drawer-actions"><button class="button primary" data-action="toast" data-message="Publish fieldset"><i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>Publish</button><button class="button"><i class="fa-solid fa-copy" aria-hidden="true"></i>Copy</button><button class="button danger"><i class="fa-solid fa-trash-can" aria-hidden="true"></i>Remove</button></div></footer>
  `;
}

function fieldsetContent() {
  return `
    <div class="notice">Fieldsets share field editing but hide model-only database and relation controls.</div>
    <div class="field-grid">
      ${field('Singular Name', 'Address')}
      ${field('Plural Name', 'Addresses')}
      ${field('Keyword', 'address')}
      ${area('Description', 'Reusable location fields for article and profile records.')}
    </div>
  `;
}

function fieldsetSource() {
  return `
    <div class="field-grid">
      <pre class="codebox">type Address {
  street String @label("Street")
  city String @label("City")
  region String @label("Region")
  country String @label("Country")
}</pre>
      <div class="notice">Source preview stays read-only here because fieldset edits should happen in Content or Fields.</div>
    </div>
  `;
}

function enumDrawer() {
  const body = state.tab === 'source' ? enumSource() : enumOptions();
  return `
    ${drawerHeader('Update Article Status Enum', 'Option set from ideas/blog.idea', [{ id: 'options', label: 'Options' }, { id: 'source', label: 'Source' }])}
    <section class="drawer-body">${body}</section>
    <footer class="drawer-foot"><div class="drawer-actions"><button class="button primary" data-action="toast" data-message="Publish enum"><i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>Publish</button><button class="button danger"><i class="fa-solid fa-trash-can" aria-hidden="true"></i>Remove</button></div></footer>
  `;
}

function enumOptions() {
  return `
    <div class="field-grid">
      ${['draft', 'review', 'published', 'archived'].map(value => `<div class="relation-line"><span class="drag">↕</span><span class="chip blue">${value}</span><span style="flex:1;"></span><button class="button" data-action="push" data-drawer="enum-option">Edit</button></div>`).join('')}
      <button class="button primary" data-action="push" data-drawer="enum-option"><i class="fa-solid fa-plus" aria-hidden="true"></i>Add Option</button>
    </div>
  `;
}

function enumSource() {
  return `
    <div class="field-grid">
      <pre class="codebox">enum ArticleStatus {
  draft
  review
  published
  archived
}</pre>
      <div class="notice">Enum source preview mirrors the ordered option list and keeps unknown annotations visible.</div>
    </div>
  `;
}

function fieldEditor(add = false) {
  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'validation', label: 'Validation' },
    { id: 'list', label: 'List' },
    { id: 'detail', label: 'Detail' },
    { id: 'index', label: 'Index' }
  ];
  const body = fieldEditorBody(add);
  return `
    ${drawerHeader(add ? 'Add Field' : 'Update Field: Title', add ? 'New field for Article' : 'Nested editor from Fields tab', tabs)}
    <section class="drawer-body">${body}</section>
    <footer class="drawer-foot"><button class="button primary" style="width:100%;" data-action="back-toast" data-message="Save field"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>Save</button></footer>
  `;
}

function fieldEditorBody(add) {
  if (state.tab === 'validation') {
    return `<div class="mobile-screen">${selectLike('Validation', 'Characters Greater Than', ['Required', 'Unique', 'Email', 'Characters Greater Than', 'Valid URL'])}${field('Validation Value', '3')}${field('Validation Message', 'Title must be longer than 3 characters')}<button class="button" data-action="toast" data-message="Add validation"><i class="fa-solid fa-plus" aria-hidden="true"></i>Add Rule</button></div>`;
  }
  if (state.tab === 'list') {
    return `<div class="mobile-screen">${selectLike('List Format', 'Image Carousel', ['No Filter', 'Tag List', 'Image', 'Image Carousel', 'Do Not Show'])}${field('Carousel Width', '320')}${field('Carousel Height', '180')}${selectLike('List Filter', 'Searchable text', ['No Filter', 'Searchable text', 'Tag filter', 'Range filter'])}</div>`;
  }
  if (state.tab === 'detail') {
    return `<div class="mobile-screen">${selectLike('Detail Format', 'Markdown', ['No Filter', 'Markdown', 'Table', 'JSON Pretty', 'Image Preview'])}${field('Detail Label', add ? '' : 'Article Title')}${area('Help Text', 'Shown near the detail editor when the field needs author guidance.')}</div>`;
  }
  if (state.tab === 'index') {
    return `<div class="mobile-screen"><div class="choice-row"><span>Searchable</span><span class="chip blue">on</span></div><div class="choice-row"><span>Filterable</span><span class="chip">off</span></div><div class="choice-row"><span>Sortable</span><span class="chip">off</span></div>${field('Default', '')}</div>`;
  }
  return `
    <div class="mobile-screen">
      ${field('Label', add ? '' : 'Title')}
      ${field('Keyword', add ? '' : 'title')}
      ${selectLike('Type', 'Text Field', ['Input Field', 'Text Field', 'Markdown Field', 'Image Field', 'Date Field', 'Active'])}
      <button class="button" data-action="toast" data-message="Add attribute"><i class="fa-solid fa-plus" aria-hidden="true"></i>Add Attribute</button>
      <div class="chip-row"><span class="chip blue">Searchable</span><span class="chip">Filterable</span><span class="chip">Sortable</span></div>
    </div>
  `;
}

function iconPicker() {
  const icons = ['edit', 'book', 'file', 'image', 'tag', 'lock', 'database', 'bolt', 'code', 'link', 'search', 'check'];
  return `
    ${drawerHeader('Select Icon', 'Font Awesome Free picker')}
    <section class="drawer-body">
      <div class="field-grid">
        ${field('Current Value', 'fas fa-edit')}
        <div class="option-grid">${icons.map(icon => `<button class="option ${icon === 'edit' ? 'active' : ''}" data-action="back-toast" data-message="Select icon"><span>fas fa-${icon}</span><i class="fa-solid fa-${icon}" aria-hidden="true"></i></button>`).join('')}</div>
      </div>
    </section>
    <footer class="drawer-foot"><button class="button primary" style="width:100%;" data-action="back-toast" data-message="Save icon"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>Save</button></footer>
  `;
}

function relationEditor() {
  const tabs = [{ id: 'content', label: 'Content' }, { id: 'preview', label: 'Preview' }, { id: 'source', label: 'Source' }];
  const body = state.tab === 'preview' ? relationPreview() : state.tab === 'source' ? relationSource() : relationContent();
  return `
    ${drawerHeader('Update Relation', 'Idea relation semantics', tabs)}
    <section class="drawer-body">${body}</section>
    <footer class="drawer-foot"><button class="button primary" style="width:100%;" data-action="back-toast" data-message="Save relation"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>Save</button></footer>
  `;
}

function relationContent() {
  return `<div class="field-grid">${field('Local Model', 'Article')}${field('Local Column', 'profile_id')}${field('Foreign Model', 'Profile')}${field('Foreign Column', 'id')}${field('Relation Name', 'profile')}</div>`;
}

function relationPreview() {
  return `
    <div class="field-grid">
      <div class="relation-line"><span class="chip">Article.profile_id</span><strong>-></strong><span class="chip">Profile.id</span><strong>:</strong><span class="chip blue">profile</span></div>
      <div class="status-grid">
        <div><strong>Cardinality</strong><span>many-to-one</span></div>
        <div><strong>Drawer impact</strong><span>Profile selector shown on Article</span></div>
        <div><strong>Generated API</strong><span>article.profile</span></div>
      </div>
    </div>
  `;
}

function relationSource() {
  return `<pre class="codebox">relation Article.profile_id -> Profile.id : profile</pre>`;
}

function fileDrawer() {
  const tabs = [{ id: 'content', label: 'Create' }, { id: 'preview', label: 'Preview' }];
  const body = state.tab === 'preview' ? filePreview() : fileCreate();
  return `
    ${drawerHeader('Add Idea File', 'Create a new idea file', tabs)}
    <section class="drawer-body">${body}</section>
    <footer class="drawer-foot"><button class="button primary" style="width:100%;" data-action="toast" data-message="Create idea file"><i class="fa-solid fa-file-circle-plus" aria-hidden="true"></i>Create File</button></footer>
  `;
}

function fileCreate() {
  return `<div class="field-grid">${field('New File Path', 'ideas/catalog.idea')}${field('Template', 'Empty idea file')}<div class="notice">Studio creates the file only. Import wiring is handled outside this Add File flow.</div></div>`;
}

function filePreview() {
  return `<pre class="codebox">model CatalogItem {
  name String @label("Name")
}</pre>`;
}

function sourceDrawer() {
  const tabs = [{ id: 'content', label: 'Source' }, { id: 'diagnostics', label: 'Diagnostics' }, { id: 'imports', label: 'Imports' }];
  const body = state.tab === 'diagnostics' ? sourceDiagnostics() : state.tab === 'imports' ? sourceImports() : sourceEditor();
  return `
    ${drawerHeader('Edit Source File', state.file, tabs)}
    <section class="drawer-body">${body}</section>
    <footer class="drawer-foot"><button class="button primary" style="width:100%;" data-action="toast" data-message="Save source"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>Save Source</button></footer>
  `;
}

function sourceEditor() {
  return `<pre class="codebox">model Article {
  title String @label("Title") @required @searchable
  detail String @field.markdown @view.markdown
  status ArticleStatus @default("draft")
}</pre>`;
}

function sourceDiagnostics() {
  return `
    <div class="field-grid">
      <div class="status-grid">
        <div><strong>Parsed models</strong><span>2</span></div>
        <div><strong>Parsed enums</strong><span>1</span></div>
        <div><strong>Warnings</strong><span>2</span></div>
      </div>
      <div class="mini-table"><div><strong>Line 7</strong><span>Unknown annotation kept in source mode.</span></div><div><strong>Line 11</strong><span>Import points to a file with no fieldsets.</span></div></div>
    </div>
  `;
}

function sourceImports() {
  return `<div class="field-grid"><div class="relation-line"><strong>schema.idea</strong><span>uses</span><span class="chip blue">ideas/blog.idea</span></div><div class="relation-line"><strong>schema.idea</strong><span>uses</span><span class="chip blue">ideas/shared.idea</span></div><div class="notice">Imports are shown for source awareness only in this draft.</div></div>`;
}

function enumOptionDrawer() {
  return `
    ${drawerHeader('Update Enum Option', 'Nested option editor')}
    <section class="drawer-body"><div class="field-grid">${field('Label', 'Published')}${field('Value', 'published')}${field('Description', 'Visible in public views')}</div></section>
    <footer class="drawer-foot"><button class="button primary" style="width:100%;" data-action="back-toast" data-message="Save option"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>Save</button></footer>
  `;
}

function addResourceDrawer(title, subtitle, labels) {
  return `
    ${drawerHeader(title, subtitle)}
    <section class="drawer-body"><div class="field-grid">${labels.map(label => field(label, '')).join('')}</div></section>
    <footer class="drawer-foot"><button class="button primary" style="width:100%;" data-action="toast" data-message="${title}"><i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>Publish</button></footer>
  `;
}

function confirmDrawer(title, message, action) {
  return `
    ${drawerHeader(title, 'Focused confirmation screen')}
    <section class="drawer-body"><div class="notice">${message}</div></section>
    <footer class="drawer-foot"><button class="button primary" style="width:100%;" data-action="back-toast" data-message="${action}">${action}</button></footer>
  `;
}

function field(label, value) {
  return `<div class="field"><label>${label}</label><div class="input">${escapeHtml(value || 'Enter value')}</div></div>`;
}

function area(label, value) {
  return `<div class="field"><label>${label}</label><div class="textarea">${escapeHtml(value)}</div></div>`;
}

function selectLike(label, value, options) {
  return `
    <div class="field">
      <label>${label}</label>
      <div class="select"><span>${escapeHtml(value)}</span><span>⌄</span></div>
      <div class="option-grid" style="margin-top:8px;">${options.map(option => `<button class="option ${option === value ? 'active' : ''}" data-action="toast" data-message="Select ${label}"><span>${escapeHtml(option)}</span></button>`).join('')}</div>
    </div>
  `;
}

function bind() {
  root.querySelectorAll('[data-action]').forEach(element => {
    element.addEventListener('click', event => {
      event.preventDefault();
      const action = element.dataset.action;
      if (element.disabled) return;
      if (action === 'view') setView(element.dataset.view);
      if (action === 'file') setFile(element.dataset.file);
      if (action === 'open') openDrawer(element.dataset.drawer, element.dataset.drawer === 'fieldset' ? 'content' : element.dataset.drawer === 'enum' ? 'options' : 'content');
      if (action === 'push') pushDrawer(element.dataset.drawer, element.dataset.tab || 'content');
      if (action === 'back') drawerBack();
      if (action === 'theme') toggleTheme();
      if (action === 'tab') {
        state.tab = element.dataset.tab;
        state.motion = 'tab';
        render();
      }
      if (action === 'toast') simulate(element.dataset.message || 'Action');
      if (action === 'back-toast') {
        simulate(element.dataset.message || 'Action');
        drawerBack();
      }
    });
  });
}

function render() {
  root.innerHTML = shell();
  bind();
  if (state.motion) {
    window.clearTimeout(render.motionTimer);
    render.motionTimer = window.setTimeout(() => {
      state.motion = '';
    }, 1050);
  }
}

render();
