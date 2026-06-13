(function docsInteractions() {
  const progressKey = 'stackpressDocsProgress';
  const themeKey = 'stackpress-docs-theme';
  const mermaidSource = '/scripts/docs-diagrams.js?v=10.9.6';
  let mermaidLoading = false;
  let mermaidRendered = false;
  const guideGroups = {
    1: { badge: 'Visitor', label: '100 Develop' },
    2: { badge: 'Junior', label: '200 Data' },
    3: { badge: 'Backend', label: '300 Idea' },
    4: { badge: 'Builder', label: '400 Build' },
    5: { badge: 'DevOps', label: '500 Structure' },
    6: { badge: 'Senior', label: '600 Built-ins' },
    7: { badge: 'Architect', label: '700 Studio' },
    8: { badge: 'Legend', label: '800 AI' }
  };

  function hideUntilReady() {
    const root = getRoot();
    root.classList.remove('is-ready');
  }

  function parse(value) {
    try {
      return JSON.parse(value || '{}');
    } catch (_error) {
      return {};
    }
  }

  function getRoot() {
    return document.querySelector('.docs-site') || document.documentElement;
  }

  function readStorage(name) {
    try {
      return window.localStorage.getItem(name) || '';
    } catch (_error) {
      return '';
    }
  }

  function writeStorage(name, value) {
    try {
      window.localStorage.setItem(name, value);
    } catch (_error) {
      return;
    }
  }

  function readProgressStorage() {
    return parse(readStorage(progressKey));
  }

  function normalize(state) {
    const level = Number.isFinite(Number(state.level)) ? Number(state.level) : 1;
    return {
      level: Math.max(1, Math.min(8, level)),
      completed: Array.isArray(state.completed) ? state.completed : [],
      updated: state.updated || new Date().toISOString()
    };
  }

  function readProgress() {
    return normalize(readProgressStorage());
  }

  function writeProgress(state) {
    const next = normalize({ ...state, updated: new Date().toISOString() });
    writeStorage(progressKey, JSON.stringify(next));
    return next;
  }

  function upgradeProgressForCurrentGuide() {
    const article = document.querySelector('[data-guide-level][data-guide-path]');
    if (!article) return readProgress();

    const pageLevel = Number(article.getAttribute('data-guide-level') || 1);
    const path = article.getAttribute('data-guide-path') || location.pathname;
    const progress = readProgress();
    if (pageLevel <= progress.level) return progress;

    const completed = Array.from(new Set([...(progress.completed || []), path]));
    return writeProgress({ ...progress, level: pageLevel, completed });
  }

  function getSavedTheme() {
    return readStorage(themeKey);
  }

  function setTheme(theme, options) {
    const root = getRoot();
    const readerLevel = Number(root.dataset.readerLevel || 1);
    const next = readerLevel < 4 ? 'light' : theme;
    root.dataset.theme = next;
    root.classList.remove('docs-theme-light', 'docs-theme-dark');
    root.classList.add('docs-theme-' + next);
    if ((!options || options.persist !== false) && readerLevel >= 4) {
      writeStorage(themeKey, next);
    }
    updateThemeButtons();
  }

  function applyProgress(state) {
    const root = getRoot();
    const progress = normalize(state);
    const readerLevel = progress.level;
    root.dataset.readerLevel = String(readerLevel);
    for (let level = 1; level <= 8; level += 1) {
      root.classList.remove('docs-level-' + level);
    }
    root.classList.add('docs-level-' + readerLevel);

    if (readerLevel < 4) {
      setTheme('light', { persist: false });
    } else {
      const saved = getSavedTheme();
      setTheme(saved === 'dark' || saved === 'light' ? saved : 'light', { persist: false });
    }

    document.querySelectorAll('[data-unlock-level]').forEach(node => {
      const level = Number(node.getAttribute('data-unlock-level') || 1);
      node.hidden = level > readerLevel;
    });
    orderGuideNav(readerLevel);

    document.querySelectorAll('[data-progress-count], [data-badge-label]').forEach(node => {
      node.textContent = guideGroups[readerLevel].badge;
    });

    document.querySelectorAll('[data-current-path]').forEach(node => {
      node.textContent = guideGroups[readerLevel].label;
    });

    document.querySelectorAll('[data-progress-list]').forEach(node => {
      node.innerHTML = '';
      Object.entries(guideGroups).forEach(([level, group]) => {
        if (Number(level) > readerLevel) return;
        const item = document.createElement('li');
        item.textContent = group.badge + ' - ' + group.label;
        node.appendChild(item);
      });
    });

    document.querySelectorAll('.docs-theme-switch').forEach(button => {
      button.hidden = readerLevel < 4;
      button.disabled = readerLevel < 4;
    });
  }

  function orderGuideNav(readerLevel) {
    document.querySelectorAll('.docs-sidebar').forEach(sidebar => {
      const sections = Array.from(sidebar.children)
        .filter(node => node.matches('[data-unlock-level]'));
      sections
        .sort((a, b) => {
          const aLevel = Number(a.getAttribute('data-unlock-level') || 1);
          const bLevel = Number(b.getAttribute('data-unlock-level') || 1);
          if (readerLevel === 1) {
            const aNumber = parseInt(a.querySelector('p')?.textContent || String(aLevel), 10);
            const bNumber = parseInt(b.querySelector('p')?.textContent || String(bLevel), 10);
            return aNumber - bNumber;
          }
          return bLevel - aLevel;
        })
        .forEach(section => sidebar.appendChild(section));
      sections
        .filter(section => !section.hidden)
        .forEach((section, index) => {
          section.classList.toggle('has-section-gap', index > 0);
        });
    });
  }

  function updateThemeButtons() {
    const root = getRoot();
    const dark = root.dataset.theme === 'dark';
    document.querySelectorAll('.docs-theme-switch').forEach(button => {
      button.setAttribute('aria-pressed', dark ? 'true' : 'false');
    });
  }

  function toggleTheme() {
    const root = getRoot();
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  function togglePanel(toggle) {
    const id = toggle.getAttribute('data-panel-toggle');
    if (!id) return;
    const panel = document.getElementById(id);
    if (!panel) return;

    const open = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function loadMermaid() {
    if (mermaidLoading) {
      return;
    }
    mermaidLoading = true;
    const script = document.createElement('script');
    script.src = mermaidSource;
    script.onload = () => {
      mermaidLoading = false;
      renderMermaid();
    };
    script.onerror = () => {
      mermaidLoading = false;
    };
    document.head.appendChild(script);
  }

  function renderMermaid() {
    if (mermaidRendered || !document.querySelector('.mermaid')) {
      return;
    }
    if (!window.mermaid) {
      loadMermaid();
      return;
    }
    window.mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
    mermaidRendered = true;
    const result = window.mermaid.run({ querySelector: '.mermaid' });
    if (result && typeof result.catch === 'function') {
      result.catch(() => {
        mermaidRendered = false;
      });
    }
  }

  function handleClick(event) {
    const target = event.target;
    if (!target || typeof target.closest !== 'function') return;

    const themeButton = target.closest('.docs-theme-switch');
    if (themeButton) {
      toggleTheme();
      return;
    }

    const badgeButton = target.closest('[data-badge-toggle]');
    if (badgeButton) {
      const popover = document.querySelector('[data-badge-popover]');
      if (popover) {
        popover.hidden = !popover.hidden;
      }
      return;
    }

    const toggle = target.closest('[data-panel-toggle]');
    if (toggle) {
      togglePanel(toggle);
    }
  }

  function initialize(options) {
    hideUntilReady();
    applyProgress(upgradeProgressForCurrentGuide());
    updateThemeButtons();
    if (window.hljs) {
      window.hljs.highlightAll();
    }
    renderMermaid();
    if (!options || options.reveal !== false) {
      getRoot().classList.add('is-ready');
    }
  }

  document.addEventListener('click', handleClick, true);
  initialize({ reveal: false });
  window.addEventListener('load', initialize);
  window.addEventListener('load', renderMermaid);
  const stabilize = window.setInterval(initialize, 50);
  window.setTimeout(() => window.clearInterval(stabilize), 2000);
  const stabilizeMermaid = window.setInterval(renderMermaid, 250);
  window.setTimeout(() => window.clearInterval(stabilizeMermaid), 10000);
})();
