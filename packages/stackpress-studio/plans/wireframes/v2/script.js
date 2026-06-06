const app = document.getElementById('studio-app');
const drawer = document.getElementById('studio-drawer');
const drawerTitle = document.getElementById('drawer-title');
const drawerSubtitle = document.getElementById('drawer-subtitle');
const drawerBody = document.getElementById('drawer-body');
const drawerFoot = document.getElementById('drawer-foot');
const drawerBack = document.getElementById('drawer-back');
const drawerNav = document.querySelector('.drawer-tabs');
const drawerTabs = Array.from(document.querySelectorAll('[data-tab]'));
const main = document.querySelector('.main');
const notice = document.createElement('div');

let drawerMode = 'model';
let activeTab = 'content';
let activeView = 'models';
let activeFile = 'schema.idea';
let selectedField = 'Title';
let panelStack = [];
let selectedIcon = 'question';
let fieldState = {
  typeOpen: false,
  type: 'Text Field',
  attributeRows: 1,
  validationOpen: false,
  validation: 'Required',
  validationRows: 1,
  listFormatOpen: false,
  listFormat: 'No Filter',
  detailFormatOpen: false,
  detailFormat: 'No Filter'
};

const fieldComponentOptions = [
  'checkbox', 'code', 'color', 'country', 'currency', 'date', 'datelist',
  'datetime', 'datetimelist', 'email', 'file', 'filelist', 'image',
  'imagelist', 'input', 'integer', 'json', 'markdown', 'mask', 'metadata',
  'number', 'numberlist', 'password', 'phone', 'price', 'radio', 'rating',
  'select', 'slider', 'slug', 'small', 'stringlist', 'suggest', 'switch',
  'tags', 'textarea', 'editor', 'textlist', 'time', 'timelist', 'url'
];

const validationOptions = [
  ['required', 'Required'],
  ['ne', 'Not Empty'],
  ['unique', 'Unique'],
  ['eq', 'Equals'],
  ['neq', 'Not Equals'],
  ['option', 'Option'],
  ['regex', 'Regex'],
  ['date', 'Date'],
  ['future', 'Future'],
  ['past', 'Past'],
  ['gt', 'Greater Than'],
  ['ge', 'Greater Than Or Equal'],
  ['lt', 'Less Than'],
  ['le', 'Less Than Or Equal'],
  ['cgt', 'Characters Greater Than'],
  ['cge', 'Characters Greater Than Or Equal'],
  ['clt', 'Characters Less Than'],
  ['cle', 'Characters Less Than Or Equal'],
  ['email', 'Email'],
  ['url', 'URL'],
  ['string', 'String'],
  ['number', 'Number'],
  ['integer', 'Integer'],
  ['object', 'Object']
];

const formatOptions = [
  'capitalize', 'carousel', 'chars', 'code', 'color', 'comma', 'country',
  'currency', 'date', 'email', 'formula', 'html', 'image', 'json', 'film',
  'line', 'link', 'list', 'lowercase', 'markdown', 'metadata', 'number',
  'ol', 'phone', 'price', 'rating', 'rel', 'relative', 'spread', 'tabular',
  'tags', 'time', 'overflow', 'text', 'transform', 'ul', 'uppercase',
  'words', 'yesno', 'hide', 'none'
];

const iconOptions = [
  'address-book', 'address-card', 'adjust', 'align-left', 'align-justify',
  'align-right', 'ambulance', 'anchor', 'angle-double-down',
  'angle-double-left', 'angle-double-right', 'angle-double-up', 'angle-down',
  'angle-left', 'angle-right', 'angle-up', 'archive', 'arrow-alt-circle-down',
  'arrow-alt-circle-left', 'arrow-alt-circle-right', 'arrow-alt-circle-up',
  'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'arrows-alt',
  'arrows-alt-h', 'arrows-alt-v', 'asterisk', 'at', 'ad', 'backward',
  'balance-scale', 'ban', 'barcode', 'bars', 'bath', 'bed', 'bell',
  'bicycle', 'binoculars', 'birthday-cake', 'bold', 'bolt', 'bomb', 'book',
  'bookmark', 'briefcase', 'building', 'bullhorn', 'bullseye', 'bus',
  'calendar', 'camera', 'car', 'chart-bar', 'chart-line', 'check',
  'check-circle', 'chevron-down'
];

const fields = [
  ['Title', 'article_title', 'text', 'none', 'none', ['Searchable']],
  ['Detail', 'article_detail', 'wysiwyg', 'hide', 'none', []],
  ['Address', 'article_address', 'fieldset', 'hide', 'table', []],
  ['Tags', 'article_tags', 'taglist', 'taglist', 'taglist', []],
  ['Active', 'article_active', 'active', 'hide', 'hide', ['Filterable', 'Sortable']],
  ['Created', 'article_created', 'created', 'none', 'none', ['Sortable']],
  ['Updated', 'article_updated', 'updated', 'none', 'none', ['Sortable']]
];

const fileCounts = {
  'schema.idea': { models: 2, fieldsets: 0, enums: 1, source: 3 },
  'ideas/blog.idea': { models: 2, fieldsets: 0, enums: 1, source: 1 },
  'ideas/shared.idea': { models: 2, fieldsets: 2, enums: 0, source: 1 }
};

notice.className = 'toast hidden';
document.body.appendChild(notice);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function flash(message) {
  notice.textContent = message;
  notice.classList.remove('hidden');
  window.clearTimeout(flash.timeout);
  flash.timeout = window.setTimeout(() => notice.classList.add('hidden'), 1500);
}

function setSideActive(view) {
  document.querySelectorAll('[data-view]').forEach(link => {
    link.classList.toggle('active', link.dataset.view === view);
  });
  document.querySelectorAll('[data-file-link]').forEach(link => {
    link.classList.toggle('active', link.dataset.file === activeFile);
  });
  const counts = fileCounts[activeFile] || fileCounts['schema.idea'];
  Object.entries(counts).forEach(([key, value]) => {
    const target = document.querySelector(`[data-count="${key}"]`);
    if (target) target.textContent = value;
  });
}

function modelRowsTemplate() {
  const rows = {
    'schema.idea': [
      ['Article', 'article', 'Manages Articles', '<span class="relation-chip">1:1 profile</span>', 'open-model', false],
      ['Application', 'app', 'Locked system application', '<span class="relation-chip">1:1 profile</span> <span class="relation-chip">1:N scope</span>', 'open-locked-model', true]
    ],
    'ideas/blog.idea': [
      ['Comment', 'comment', 'Manages comments', '<span class="relation-chip">N:1 article</span>', 'open-model', false],
      ['Article', 'article', 'Blog article extension', '<span class="relation-chip">1:N comment</span>', 'open-model', false]
    ],
    'ideas/shared.idea': [
      ['File', 'file', 'Manages uploads', '<span class="relation-chip">N:1 article</span>', 'open-model', false],
      ['Image', 'image', 'Shared image metadata', '<span class="relation-chip">N:1 file</span>', 'open-model', false]
    ]
  }[activeFile] || [];
  return rows.map(([name, keyword, description, relations, action, locked], index) => {
    const icon = locked ? '<i class="fa-solid fa-lock lock-icon" aria-hidden="true"></i>' : '';
    return `<tr class="${index === 0 ? 'selected' : ''}" data-action="${action}"><td><span class="resource-name clickable"><strong>${icon}${name}</strong><small>${keyword}</small></span></td><td>${description}</td><td>${relations}</td></tr>`;
  }).join('');
}

function fieldsetRowsTemplate() {
  const rows = {
    'schema.idea': [],
    'ideas/blog.idea': [],
    'ideas/shared.idea': [
      ['Address', 'address', 'Reusable address fields', 'street, city, country', 'open-type'],
      ['Media', 'media', 'Reusable media metadata', 'url, caption, alt', 'open-type']
    ]
  }[activeFile] || [];
  if (!rows.length) {
    return '<tr><td colspan="3"><span class="empty-row">No fieldsets in this file</span></td></tr>';
  }
  return rows.map(([name, keyword, description, fields, action], index) => (
    `<tr class="${index === 0 ? 'selected' : ''}" data-action="${action}"><td><span class="resource-name clickable"><strong>${name}</strong><small>${keyword}</small></span></td><td>${description}</td><td>${fields}</td></tr>`
  )).join('');
}

function enumRowsTemplate() {
  const rows = {
    'schema.idea': [
      ['Visibility', 'visibility', 'public, private, hidden', 'Page.visibility, File.visibility', 'open-enum']
    ],
    'ideas/blog.idea': [
      ['Article Status', 'article_status', 'draft, review, published, archived', 'Article.status', 'open-enum']
    ],
    'ideas/shared.idea': []
  }[activeFile] || [];
  if (!rows.length) {
    return '<tr><td colspan="3"><span class="empty-row">No enums in this file</span></td></tr>';
  }
  return rows.map(([name, keyword, values, usedBy, action], index) => (
    `<tr class="${index === 0 ? 'selected' : ''}" data-action="${action}"><td><span class="resource-name clickable"><strong>${name}</strong><small>${keyword}</small></span></td><td>${values}</td><td>${usedBy}</td></tr>`
  )).join('');
}

function setTabs(tab) {
  const typeMode = drawerMode === 'type' || drawerMode === 'add-type';
  const tablessMode = [
    'add-enum',
    'enum',
    'enum-option',
    'field',
    'type-field',
    'add-field',
    'relation',
    'icon-picker',
    'idea-file',
    'source-file',
    'copy-resource',
    'remove-resource'
  ].includes(drawerMode);
  activeTab = typeMode && tab === 'relations' ? 'content' : tab;
  drawerNav.classList.toggle('hidden', tablessMode);
  drawerTabs.forEach(item => {
    item.classList.toggle('active', item.dataset.tab === activeTab);
    item.classList.toggle('hidden', typeMode && item.dataset.tab === 'relations');
  });
}

function panelState() {
  return {
    title: drawerTitle.textContent,
    subtitle: drawerSubtitle.textContent,
    body: drawerBody.innerHTML,
    foot: drawerFoot.innerHTML,
    tab: activeTab,
    mode: drawerMode
  };
}

function panelStateKey(state) {
  return [state.title, state.subtitle, state.tab, state.mode].join('|');
}

function updatePanelBack() {
  const nested = panelStack.length > 0;
  drawer.classList.toggle('nested', nested);
  drawer.dataset.depth = String(panelStack.length + 1);
  drawerBack.textContent = nested ? '‹' : '×';
  drawerBack.setAttribute('aria-label', nested ? 'Back' : 'Close panel');
  drawerBack.setAttribute('title', nested ? 'Back' : 'Close panel');
}

function pushPanelState() {
  if (!drawer.classList.contains('hidden')) {
    const current = panelState();
    const previous = panelStack[panelStack.length - 1];
    if (!previous || panelStateKey(previous) !== panelStateKey(current)) {
      panelStack.push(current);
    }
  }
}

function panelBack() {
  const current = panelState();
  let previous = panelStack.pop();
  while (previous && panelStateKey(previous) === panelStateKey(current)) {
    previous = panelStack.pop();
  }
  if (!previous) {
    closeDrawer();
    return;
  }
  drawerMode = previous.mode;
  drawerTitle.textContent = previous.title;
  drawerSubtitle.textContent = previous.subtitle;
  drawerBody.innerHTML = previous.body;
  drawerFoot.innerHTML = previous.foot;
  setTabs(previous.tab);
  updatePanelBack();
}

function showDrawer(title, subtitle, template, tab = 'content', mode = drawerMode, options = {}) {
  if (options.push) {
    pushPanelState();
  } else {
    panelStack = [];
  }
  drawerMode = mode;
  app.classList.add('drawer-open');
  drawer.classList.remove('hidden');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  drawerTitle.textContent = title;
  drawerSubtitle.textContent = subtitle;
  drawerBody.innerHTML = template;
  drawerFoot.innerHTML = footerTemplate(mode);
  setTabs(tab);
  updatePanelBack();
}

function closeDrawer() {
  panelStack = [];
  app.classList.remove('drawer-open');
  drawer.classList.add('hidden');
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  updatePanelBack();
}

function footerTemplate(mode) {
  if (mode === 'locked') {
    return '<div class="footer-actions"><button class="button" data-action="close-drawer">Close</button></div>';
  }
  if (mode === 'remove-resource') {
    return '<div class="footer-actions"><button class="button" data-action="return-parent">Cancel</button><button class="button danger" data-action="return-parent">Remove</button></div>';
  }
  if (mode === 'add' || mode === 'add-type' || mode === 'add-enum') {
    return '<div class="footer-actions"><button class="button primary" data-action="publish">Publish</button></div>';
  }
  if (mode === 'field' || mode === 'add-field' || mode === 'idea-file' || mode === 'source-file' || mode === 'enum-option' || mode === 'relation' || mode === 'icon-picker' || mode === 'copy-resource') {
    return '<div class="footer-actions"><button class="button" data-action="return-parent">Cancel</button><button class="button primary" data-action="return-parent">Save</button></div>';
  }
  return '<div class="footer-actions"><button class="button primary" data-action="publish">Publish</button><button class="button" data-action="copy-resource">Copy</button><button class="button danger" data-action="remove-resource">Remove</button></div>';
}

function renderModels() {
  activeView = 'models';
  setSideActive('models');
  main.innerHTML = `
    <div class="main-head">
      <div><p class="eyebrow">${activeFile}</p><h1>Models</h1></div>
      <div class="top-actions"><button class="button" data-action="open-add-schema">+ Add Model</button></div>
    </div>
    <div class="toolbar">
      <div class="searchbox">Search models, labels, relations</div>
      <div class="top-actions"><span class="pill">Active</span><span class="pill">Inactive</span></div>
    </div>
    <div class="content">
      <section class="panel">
        <div class="panel-head"><h2>Model Index</h2></div>
        <div class="table-wrap">
          <table class="table index-table">
            <thead><tr><th>Model</th><th>Description</th><th>Relations</th></tr></thead>
            <tbody>
              ${modelRowsTemplate()}
            </tbody>
          </table>
        </div>
      </section>
    </div>`;
}

function renderFieldsets() {
  activeView = 'fieldsets';
  setSideActive('fieldsets');
  main.innerHTML = `
    <div class="main-head"><div><p class="eyebrow">${activeFile}</p><h1>Fieldsets</h1></div><button class="button" data-action="open-add-type">+ Add Fieldset</button></div>
    <div class="toolbar"><div class="searchbox">Search fieldsets and reusable types</div><div class="top-actions"><span class="pill">Active</span><span class="pill">Inactive</span></div></div>
    <div class="content"><section class="panel"><div class="panel-head"><h2>Fieldset Index</h2></div><div class="table-wrap"><table class="table index-table">
      <thead><tr><th>Fieldset</th><th>Description</th><th>Fields</th></tr></thead>
      <tbody>
        ${fieldsetRowsTemplate()}
      </tbody>
    </table></div></section></div>`;
}

function renderEnums() {
  activeView = 'enums';
  setSideActive('enums');
  main.innerHTML = `
    <div class="main-head"><div><p class="eyebrow">${activeFile}</p><h1>Enums</h1></div><button class="button" data-action="open-add-enum">+ Add Enum</button></div>
    <div class="toolbar"><div class="searchbox">Search enums and option values</div><span class="pill">3 enums</span></div>
    <div class="content"><section class="panel"><div class="panel-head"><h2>Enum Index</h2></div><div class="table-wrap"><table class="table index-table">
      <thead><tr><th>Enum</th><th>Values</th><th>Used By</th></tr></thead>
      <tbody>
        ${enumRowsTemplate()}
      </tbody>
    </table></div></section></div>`;
}

function renderSource() {
  activeView = 'source';
  setSideActive('source');
  main.innerHTML = `
    <div class="main-head"><div><p class="eyebrow">${activeFile}</p><h1>Source</h1></div><button class="button" data-action="open-new-idea-file">+ Add File</button></div>
    <div class="toolbar"><div class="searchbox">Search idea source, imports, definitions</div></div>
    <div class="content"><section class="panel"><div class="panel-head"><h2>Import Graph</h2><button class="button" data-action="open-new-idea-file">+ Add File</button></div><div class="table-wrap source-list">
      <div class="key-value-row source-row"><div><strong>schema.idea</strong><small>main file</small></div><div class="source-box">use ideas/blog.idea
use ideas/shared.idea

model Article {
  @query id title detail tags active created updated
}</div><button class="button" data-action="open-source-file" data-file="schema.idea">Edit</button></div>
      <div class="key-value-row source-row"><div><strong>ideas/blog.idea</strong><small>used by schema.idea</small></div><div class="source-box">model Comment
enum ArticleStatus</div><button class="button" data-action="open-source-file" data-file="ideas/blog.idea">Edit</button></div>
      <div class="key-value-row source-row"><div><strong>ideas/shared.idea</strong><small>used by schema.idea</small></div><div class="source-box">type Address
type Media</div><button class="button" data-action="open-source-file" data-file="ideas/shared.idea">Edit</button></div></div>
    </section></div>`;
}

function modelContentTemplate(mode = 'edit') {
  const add = mode === 'add';
  return `
    <div class="field-grid">
      <div class="field"><label>Singular Name</label><div class="input">${add ? 'Enter the singular name' : 'Article'}</div></div>
      <div class="field"><label>Plural Name</label><div class="input">${add ? 'Enter the plural name' : 'Articles'}</div></div>
      <div class="field"><label>Keyword</label><div class="input">${add ? 'Enter a unique keyword' : 'article'}</div></div>
      <div class="field icon-field"><label>Icon</label><button class="icon-input" data-action="open-icon-picker"><span>fas fa-${add ? selectedIcon : 'edit'}</span><span class="icon-preview-tile"><i class="fas fa-${add ? selectedIcon : 'edit'}"></i></span></button></div>
      <div class="field"><label>Description</label><div class="textarea">${add ? 'What does this model do?' : 'Manages Articles'}</div></div>
      <div class="field"><label>Display</label><div class="input">${add ? '{{keyword_field}}' : '{{article_name}}'}</div></div>
      <div class="field"><label>Query</label><div class="textarea">${add ? '' : 'id title detail tags active created updated'}</div></div>
    </div>`;
}

function lockedModelTemplate() {
  return '<div class="callout">Application is a locked system schema. You can inspect content, fields, and relations, but editing controls are disabled.</div>' + modelContentTemplate('edit');
}

function fieldsTemplate(typeMode = false) {
  return `
    <div class="drawer-subhead"><h3>${typeMode ? 'Fieldset Fields' : 'Fields'}</h3><button class="button" data-action="open-add-field">Add Field</button></div>
    <div class="field-table">
      ${fields.map(row => fieldRowTemplate(row, typeMode)).join('')}
    </div>`;
}

function fieldRowTemplate(row, typeMode) {
  const [label, keyword, fieldType, list, detail, indexes] = row;
  const indexText = typeMode ? '' : indexes.map(index => `<span class="index-chip">${index}</span>`).join(' ');
  return `<button class="field-row ${label === selectedField ? 'active' : ''}" data-action="open-field-editor" data-field="${escapeHtml(label)}"><span class="mini" data-action="move-field-down">=</span><span class="resource-name"><strong>${label}</strong><small>${keyword}</small></span><span class="format-stack"><small>Field ${fieldType}</small><small>List ${list}</small><small>Detail ${detail}</small></span><span>${indexText}</span><span class="row-actions"><span class="mini" data-action="copy-field">C</span><span class="mini" data-action="remove-field">X</span></span></button>`;
}

function relationsTemplate() {
  return `
    <div class="drawer-subhead"><h3>Relations</h3><button class="button" data-action="open-add-relation">Add Relation</button></div>
    <div class="relation-scroll">
      <div class="relation-row active" data-action="open-relation"><div class="select">Article</div><span>.</span><div class="input">profile_id</div><span>-></span><div class="input">Profile</div><span>.</span><div class="input">id</div><span>:</span><div class="input">profile</div><span class="mini">X</span></div>
      <div class="relation-row" data-action="open-relation"><div class="select">Article</div><span>.</span><div class="input">category_id</div><span>-></span><div class="input">Category</div><span>.</span><div class="input">id</div><span>:</span><div class="input">category</div><span class="mini">X</span></div>
    </div>`;
}

function typeContentTemplate(add = false) {
  return `
    <div class="field-grid">
      <div class="field"><label>Singular Name</label><div class="input">${add ? 'Enter the singular name' : 'Address'}</div></div>
      <div class="field"><label>Plural Name</label><div class="input">${add ? 'Enter the plural name' : 'Addresses'}</div></div>
      <div class="field"><label>Keyword</label><div class="input">${add ? 'unique_type_keyword' : 'address'}</div></div>
    </div>`;
}

function enumTemplate(add = false) {
  return `
    <div class="field-grid">
      <div class="field"><label>Name</label><div class="input">${add ? 'Enter enum name' : 'Article Status'}</div></div>
      <div class="field"><label>Keyword</label><div class="input">${add ? 'enum_keyword' : 'article_status'}</div></div>
      <div class="field"><label>File</label><div class="select">${add ? 'schema.idea' : 'ideas/blog.idea'}</div></div>
      <p class="section-label">Options</p>
      <div class="field-table">
        <button class="enum-row active" data-action="open-enum-option"><span class="mini">=</span><span class="resource-name"><strong>${add ? 'Option Label' : 'Draft'}</strong><small>${add ? 'option_value' : 'draft'}</small></span><span>${add ? 'Description' : 'Default'}</span><span class="row-actions"><span class="mini" data-action="copy-enum-option">C</span><span class="mini" data-action="remove-enum-option">X</span></span></button>
        ${add ? '' : '<button class="enum-row" data-action="open-enum-option"><span class="mini">=</span><span class="resource-name"><strong>Published</strong><small>published</small></span><span>Visible publicly</span><span class="row-actions"><span class="mini" data-action="copy-enum-option">C</span><span class="mini" data-action="remove-enum-option">X</span></span></button>'}
      </div>
      <button class="button" data-action="open-enum-option">Add Option</button>
    </div>`;
}

function getFieldEditorTemplate(typeMode = false) {
  const hasValidationValue = fieldState.validation === 'Characters Greater Than';
  const hasListFormatValues = fieldState.listFormat === 'Image Carousel';
  const hasDetailFormatValues = fieldState.detailFormat === 'Image Carousel';
  const attributeRows = Array.from({ length: fieldState.attributeRows }, (_, index) => {
    const key = index === 0 ? 'placeholder' : 'data-key';
    const value = index === 0 ? `Enter ${selectedField}` : 'component prop value';
    return `<div class="key-value-row"><div class="input">${key}</div><div class="input">${value}</div><span class="mini">X</span></div>`;
  }).join('');
  const validationRows = Array.from({ length: fieldState.validationRows }, (_, index) => {
    if (index === 0) {
      return `<div class="validation-row"><button class="select" data-action="toggle-validation-list">${fieldState.validation}</button><div class="input">${selectedField} is required</div><span class="mini">X</span></div>`;
    }
    return '<div class="validation-row"><button class="select" data-action="toggle-validation-list">Unique</button><div class="input">Value must be unique</div><span class="mini">X</span></div>';
  }).join('');
  return `
    <div class="field-grid">
      <div class="field"><label>Label</label><div class="input">${selectedField}</div></div>
      <div class="field"><label>Keyword</label><div class="input">${selectedField.toLowerCase().replaceAll(' ', '_')}</div></div>
      <div class="field"><label>Type</label><button class="select" data-action="toggle-type-list">${fieldState.type}</button>${fieldState.typeOpen ? typeOptionsTemplate() : ''}</div>
    </div>
    <p class="section-label">Attributes</p>${attributeRows}<button class="button" data-action="add-attribute">Add Attribute</button>
    <p class="section-label">Validation</p>${validationRows}${fieldState.validationOpen ? validationOptionsTemplate() : ''}${hasValidationValue ? '<div class="key-value-row"><div class="field"><label>Value</label><div class="input">120</div></div><div class="field"><label>Message</label><div class="input">Title must be longer than 120 characters</div></div><span class="mini">X</span></div>' : ''}<button class="button danger" data-action="add-validation">Add Validation</button>
    <p class="section-label">Formats</p><div class="two-col"><div class="field"><label>List Format</label><button class="select" data-action="toggle-list-format">${fieldState.listFormat}</button>${fieldState.listFormatOpen ? formatOptionsTemplate('choose-list-format') : ''}</div><div class="field"><label>Detail Format</label><button class="select" data-action="toggle-detail-format">${fieldState.detailFormat}</button>${fieldState.detailFormatOpen ? formatOptionsTemplate('choose-detail-format') : ''}</div></div>
    ${hasListFormatValues ? '<div class="key-value-row"><div class="field"><label>List Image Field</label><div class="input">image</div></div><div class="field"><label>List Caption Field</label><div class="input">title</div></div><span class="mini">X</span></div>' : ''}
    ${hasDetailFormatValues ? '<div class="key-value-row"><div class="field"><label>Detail Image Field</label><div class="input">image</div></div><div class="field"><label>Detail Caption Field</label><div class="input">title</div></div><span class="mini">X</span></div>' : ''}
    <p class="section-label">${typeMode ? 'Defaults' : 'Options'}</p><div class="two-col"><div class="field"><label>Default</label><div class="input">Default Value</div></div>${typeMode ? '' : '<div class="check-list"><label><span class="box checked"></span>Searchable</label><label><span class="box"></span>Filterable</label><label><span class="box"></span>Sortable</label></div>'}</div>`;
}

function typeOptionsTemplate() {
  const options = ['none', ...fieldComponentOptions, 'type.Address', 'type.Media', 'enum.ArticleStatus'];
  return `<div class="option-list tall">${options.map(option => `<button data-action="choose-type">${option}</button>`).join('')}</div>`;
}

function validationOptionsTemplate() {
  return `<div class="option-list tall">${validationOptions.map(([value, label]) => `<button data-action="choose-validation" data-value="${label}">${label}<small>${value}</small></button>`).join('')}</div>`;
}

function formatOptionsTemplate(action) {
  const labels = new Map([
    ['carousel', 'Image Carousel'],
    ['tabular', 'Table'],
    ['hide', 'Hide'],
    ['none', 'No Filter']
  ]);
  return `<div class="option-list tall">${formatOptions.map(option => {
    const label = labels.get(option) || option;
    return `<button data-action="${action}" data-value="${label}">${label}<small>${option}</small></button>`;
  }).join('')}</div>`;
}

function addFieldTemplate() {
  return getFieldEditorTemplate(activeView === 'fieldsets');
}

function copyResourceTemplate() {
  const typeMode = drawerMode === 'type';
  const enumMode = drawerMode === 'enum';
  const keyword = enumMode ? 'article_status_copy' : typeMode ? 'address_copy' : 'article_copy';
  const label = enumMode ? 'Article Status Copy' : typeMode ? 'Address Copy / Address Copies' : 'Article Copy / Article Copies';
  const source = enumMode ? 'Copies enum options from Article Status.' : typeMode ? 'Copies fields and labels from Address.' : 'Copies fields, relations, display, icon, and query from Article.';
  return `<div class="field-grid"><div class="field"><label>New Keyword</label><div class="input">${keyword}</div></div><div class="field"><label>New Labels</label><div class="input">${label}</div></div><div class="field"><label>Source</label><div class="textarea">${source}</div></div></div>`;
}

function removeResourceTemplate() {
  const typeMode = drawerMode === 'type';
  const enumMode = drawerMode === 'enum';
  const resource = enumMode ? 'Article Status' : typeMode ? 'Address' : 'Article';
  const definition = enumMode ? 'enum ArticleStatus' : typeMode ? 'type Address' : 'model Article';
  const file = enumMode ? 'ideas/blog.idea' : typeMode ? 'ideas/shared.idea' : 'schema.idea';
  return `<div class="field-grid"><div class="field"><label>Resource</label><div class="input">${resource}</div></div><div class="field"><label>Idea File Change</label><div class="textarea">Remove ${definition} from ${file} after confirmation.</div></div></div>`;
}

function relationEditorTemplate() {
  return '<div class="field-grid"><div class="field"><label>Local Model</label><div class="input">Article</div></div><div class="field"><label>Local Column</label><div class="input">profile_id</div></div><div class="field"><label>Foreign Model</label><div class="input">Profile</div></div><div class="field"><label>Foreign Column</label><div class="input">id</div></div><div class="field"><label>Relation Name</label><div class="input">profile</div></div></div>';
}

function ideaFileTemplate() {
  return '<div class="field-grid"><div class="field"><label>File Path</label><div class="input">ideas/new.idea</div></div><div class="field"><label>Use In Main File</label><div class="check-list"><label><span class="box checked"></span>Add use statement to schema.idea</label></div></div><div class="field"><label>Main File Patch</label><div class="textarea">schema.idea will add: use ideas/new.idea</div></div><div class="field"><label>Initial Content</label><div class="textarea">type SharedShape {}</div></div></div>';
}

function sourceFileTemplate(file = 'schema.idea') {
  const main = file === 'schema.idea';
  const content = main
    ? 'use ideas/blog.idea\nuse ideas/shared.idea\n\nmodel Article {\n  @query id title detail tags active created updated\n}'
    : file === 'ideas/blog.idea'
      ? 'model Comment {}\n\nenum ArticleStatus {\n  draft\n  review\n  published\n  archived\n}'
      : 'type Address {}\n\ntype Media {}';
  return `<div class="field-grid"><div class="field"><label>File Path</label><div class="input">${file}</div></div><div class="field"><label>${main ? 'Uses' : 'Used By'}</label><div class="textarea">${main ? 'ideas/blog.idea\nideas/shared.idea' : 'schema.idea'}</div></div><div class="field"><label>Source</label><div class="source-box compact">${content}</div></div>${main ? '' : '<div class="field"><label>Main File Patch</label><div class="textarea">Removing this file would also remove its use line from schema.idea.</div></div>'}</div>`;
}

function enumOptionTemplate() {
  return '<div class="field-grid"><div class="field"><label>Label</label><div class="input">Draft</div></div><div class="field"><label>Value</label><div class="input">draft</div></div><div class="field"><label>Description</label><div class="textarea">Visible option text and generated enum value.</div></div></div>';
}

function iconPickerTemplate() {
  return `
    <div class="field-grid">
      <div class="field"><label>Icon</label><div class="icon-picker">
        <div class="icon-picker-head"><span>fas fa-map-marker-alt</span><span class="icon-preview"><i class="fas fa-map-marker-alt"></i></span></div>
        <div class="icon-grid">
          ${iconOptions.map(name => `<button class="${name === 'ad' ? 'selected' : ''}" data-action="choose-icon" data-value="${name}" title="fas fa-${name}"><i class="fas fa-${name}"></i></button>`).join('')}
        </div>
      </div></div>
    </div>`;
}

function showFieldEditor(label = selectedField) {
  pushPanelState();
  selectedField = label;
  drawerMode = activeView === 'fieldsets' ? 'type-field' : 'field';
  fieldState = { typeOpen: false, type: 'Text Field', attributeRows: 1, validationOpen: false, validation: 'Required', validationRows: 1, listFormatOpen: false, listFormat: 'No Filter', detailFormatOpen: false, detailFormat: 'No Filter' };
  drawerTitle.textContent = 'Update Field';
  drawerSubtitle.textContent = `${selectedField} / ${selectedField.toLowerCase()}`;
  drawerBody.innerHTML = getFieldEditorTemplate(activeView === 'fieldsets');
  drawerFoot.innerHTML = footerTemplate('field');
  updatePanelBack();
}

function showAddField() {
  pushPanelState();
  drawerMode = 'add-field';
  selectedField = 'Field Title';
  fieldState = { typeOpen: false, type: 'No Field', attributeRows: 0, validationOpen: false, validation: 'Required', validationRows: 0, listFormatOpen: false, listFormat: 'No Filter', detailFormatOpen: false, detailFormat: 'No Filter' };
  drawerTitle.textContent = 'Add Field';
  drawerSubtitle.textContent = activeView === 'fieldsets' ? 'New fieldset field' : 'New Article column';
  drawerBody.innerHTML = addFieldTemplate();
  drawerFoot.innerHTML = footerTemplate('add-field');
  updatePanelBack();
}

function returnParent() {
  if (drawerMode === 'icon-picker') {
    const parent = panelStack[panelStack.length - 1];
    if (parent) {
      parent.body = parent.body.replace(
        /<button class="icon-input" data-action="open-icon-picker"><span>[^<]+<\/span><span class="icon-preview-tile"><i class="[^"]+"><\/i><\/span><\/button>/,
        `<button class="icon-input" data-action="open-icon-picker"><span>fas fa-${selectedIcon}</span><span class="icon-preview-tile"><i class="fas fa-${selectedIcon}"></i></span></button>`
      );
    }
  }
  panelBack();
}

function refreshFieldEditor() {
  drawerBody.innerHTML = getFieldEditorTemplate(activeView === 'fieldsets');
}

function handleTab(tab) {
  if (drawerMode === 'add') showDrawer('Add Model', `New model in ${activeFile}`, tab === 'fields' ? fieldsTemplate(false) : tab === 'relations' ? relationsTemplate() : modelContentTemplate('add'), tab, 'add');
  else if (drawerMode === 'add-type') showDrawer('Add Fieldset', tab === 'fields' ? 'New fieldset fields' : 'New idea type', tab === 'fields' ? fieldsTemplate(true) : typeContentTemplate(true), tab, 'add-type');
  else if (drawerMode === 'locked') showDrawer('Application Schema', 'Locked system schema', tab === 'fields' ? fieldsTemplate(false) : tab === 'relations' ? relationsTemplate() : lockedModelTemplate(), tab, 'locked');
  else if (drawerMode === 'type') showDrawer('Update Address Fieldset', tab === 'fields' ? 'Fields tab' : 'Content tab', tab === 'fields' ? fieldsTemplate(true) : typeContentTemplate(), tab, 'type');
  else showDrawer('Update Article Schema', tab === 'fields' ? 'Fields tab' : tab === 'relations' ? 'Relations tab' : 'Editable model from schema.idea', tab === 'fields' ? fieldsTemplate(false) : tab === 'relations' ? relationsTemplate() : modelContentTemplate(), tab, 'model');
}

document.addEventListener('click', event => {
  const target = event.target.closest('[data-action], [data-tab], [data-view]');
  if (!target) return;
  const action = target.dataset.action;

  if (target.dataset.view) {
    event.preventDefault();
    closeDrawer();
    if (target.dataset.view === 'models') renderModels();
    if (target.dataset.view === 'fieldsets') renderFieldsets();
    if (target.dataset.view === 'enums') renderEnums();
    if (target.dataset.view === 'source') renderSource();
    return;
  }

  if (target.dataset.tab) {
    event.preventDefault();
    handleTab(target.dataset.tab);
    return;
  }

  if (!action) return;
  event.preventDefault();
  if (action === 'set-active-file') {
    activeFile = target.dataset.file || 'schema.idea';
    closeDrawer();
    renderModels();
  }
  if (action === 'open-model') showDrawer('Update Article Schema', 'Editable model from schema.idea', modelContentTemplate(), 'content', 'model');
  if (action === 'open-locked-model') showDrawer('Application Schema', 'Locked system schema', lockedModelTemplate(), 'content', 'locked');
  if (action === 'open-add-schema') showDrawer('Add Model', `New model in ${activeFile}`, modelContentTemplate('add'), 'content', 'add');
  if (action === 'open-type') showDrawer('Update Address Fieldset', 'Reusable type from ideas/shared.idea', typeContentTemplate(), 'content', 'type');
  if (action === 'open-add-type') showDrawer('Add Fieldset', 'New idea type', typeContentTemplate(true), 'content', 'add-type');
  if (action === 'open-enum') showDrawer('Update Article Status Enum', 'Options', enumTemplate(), 'content', 'enum');
  if (action === 'open-add-enum') showDrawer('Add Enum', 'New option set', enumTemplate(true), 'content', 'add-enum');
  if (action === 'open-new-idea-file') showDrawer('Create + Use Idea File', 'Adds use line to schema.idea', ideaFileTemplate(), 'content', 'idea-file', { push: !drawer.classList.contains('hidden') });
  if (action === 'open-source-file') {
    const file = target.dataset.file || 'schema.idea';
    showDrawer(`Edit ${file}`, file === 'schema.idea' ? 'Main idea file' : 'Imported idea file', sourceFileTemplate(file), 'content', 'source-file', { push: !drawer.classList.contains('hidden') });
  }
  if (action === 'open-icon-picker') showDrawer('Select Icon', 'Font Awesome Free icon picker', iconPickerTemplate(), 'content', 'icon-picker', { push: true });
  if (action === 'close-drawer') closeDrawer();
  if (action === 'panel-back') panelBack();
  if (action === 'open-field-editor') showFieldEditor(target.dataset.field || 'Title');
  if (action === 'open-add-field') showAddField();
  if (action === 'open-relation' || action === 'open-add-relation') showDrawer(action === 'open-add-relation' ? 'Add Relation' : 'Update Relation', 'Idea relation definition', relationEditorTemplate(), 'relations', 'relation', { push: true });
  if (action === 'open-enum-option') showDrawer('Update Enum Option', 'Article Status', enumOptionTemplate(), 'content', 'enum-option', { push: true });
  if (action === 'copy-resource') showDrawer('Copy Resource', 'Creates a new idea definition from the current one', copyResourceTemplate(), activeTab, 'copy-resource', { push: true });
  if (action === 'remove-resource') showDrawer('Remove Resource', 'Confirm idea definition removal', removeResourceTemplate(), activeTab, 'remove-resource', { push: true });
  if (action === 'return-parent') returnParent();
  if (action === 'toggle-type-list') {
    fieldState.typeOpen = !fieldState.typeOpen;
    refreshFieldEditor();
  }
  if (action === 'toggle-validation-list') {
    fieldState.validationOpen = !fieldState.validationOpen;
    refreshFieldEditor();
  }
  if (action === 'toggle-list-format') {
    fieldState.listFormatOpen = !fieldState.listFormatOpen;
    refreshFieldEditor();
  }
  if (action === 'toggle-detail-format') {
    fieldState.detailFormatOpen = !fieldState.detailFormatOpen;
    refreshFieldEditor();
  }
  if (action === 'choose-validation') {
    fieldState.validation = target.dataset.value || 'Characters Greater Than';
    fieldState.validationOpen = false;
    refreshFieldEditor();
  }
  if (action === 'choose-list-format') {
    fieldState.listFormat = target.dataset.value || 'Image Carousel';
    fieldState.listFormatOpen = false;
    refreshFieldEditor();
  }
  if (action === 'choose-detail-format') {
    fieldState.detailFormat = target.dataset.value || 'Image Carousel';
    fieldState.detailFormatOpen = false;
    refreshFieldEditor();
  }
  if (action === 'choose-type') {
    fieldState.type = target.textContent.trim();
    fieldState.typeOpen = false;
    flash(`${target.textContent.trim()} selected`);
    refreshFieldEditor();
  }
  if (action === 'choose-icon') {
    const value = target.dataset.value || 'edit';
    selectedIcon = value;
    document.querySelectorAll('.icon-grid button').forEach(button => {
      button.classList.toggle('selected', button === target);
    });
    const label = `fas fa-${value}`;
    const head = document.querySelector('.icon-picker-head span:first-child');
    const preview = document.querySelector('.icon-preview');
    if (head) head.textContent = label;
    if (preview) preview.innerHTML = `<i class="fas fa-${value}"></i>`;
    flash(`${label} selected`);
  }
  if (action === 'move-field-down') flash('Field row moved below the next row');
  if (action === 'copy-field') flash('Field copied in the drawer list');
  if (action === 'remove-field') flash('Field removed from the drawer list');
  if (action === 'copy-enum-option') flash('Enum option copied in the drawer list');
  if (action === 'remove-enum-option') flash('Enum option removed from the drawer list');
  if (action === 'add-attribute') {
    fieldState.attributeRows += 1;
    refreshFieldEditor();
    flash('Attribute key/value row added');
  }
  if (action === 'add-validation') {
    fieldState.validationRows += 1;
    refreshFieldEditor();
    flash('Validation row added');
  }
  if (action === 'publish') flash('Changes published to the idea file');
});

renderModels();
