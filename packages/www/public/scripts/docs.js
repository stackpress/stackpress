(function docsInteractions() {
  const root = document.documentElement;
  let storage = null;

  try {
    storage = typeof window.localStorage === 'undefined'
      ? null
      : window.localStorage;
  } catch (_error) {
    storage = null;
  }
  const saved = storage ? storage.getItem('stackpress-docs-theme') : null;
  if (saved === 'dark' || saved === 'light') {
    root.dataset.theme = saved;
  }

  function updateThemeButtons() {
    const dark = root.dataset.theme === 'dark';
    document.querySelectorAll('.docs-theme-switch').forEach(button => {
      button.setAttribute('aria-pressed', dark ? 'true' : 'false');
    });
  }

  function toggleTheme() {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    if (storage) {
      storage.setItem('stackpress-docs-theme', next);
    }
    updateThemeButtons();
  }

  function togglePanel(toggle) {
    const id = toggle.getAttribute('data-panel-toggle');
    if (!id) return;
    const panel = document.getElementById(id);
    if (!panel) return;

    const open = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function handleClick(event) {
    const target = event.target;
    if (!target || typeof target.closest !== 'function') return;

    const themeButton = target.closest('.docs-theme-switch');
    if (themeButton) {
      toggleTheme();
      return;
    }

    const toggle = target.closest('[data-panel-toggle]');
    if (toggle) {
      togglePanel(toggle);
    }
  }

  document.addEventListener('click', handleClick, true);

  updateThemeButtons();
})();
