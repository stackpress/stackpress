(function docsInteractions() {
  const expKey = 'spExp';
  const historyKey = 'spHistory';
  const levelKey = 'spLevel';
  const themeKey = 'stackpress-docs-theme';
  const expPerGuide = 10;
  const requiredDwellMs = 120000;
  const mermaidSource = '/scripts/docs-diagrams.js?v=10.9.6';
  let activeVisit = null;
  let mermaidLoading = false;
  let mermaidRendered = false;
  let scrollTrackingReady = false;
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

  function parse(value, fallback) {
    try {
      return JSON.parse(value || '');
    } catch (_error) {
      return fallback;
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

  function clampLevel(level) {
    return Math.max(1, Math.min(8, Number(level) || 1));
  }

  function readLevel() {
    return clampLevel(readStorage(levelKey));
  }

  function writeLevel(level) {
    const next = clampLevel(level);
    writeStorage(levelKey, String(next));
    return next;
  }

  function normalizeHistory(input) {
    return input && typeof input === 'object' && !Array.isArray(input)
      ? input
      : {};
  }

  function readHistory() {
    return normalizeHistory(parse(readStorage(historyKey), {}));
  }

  function writeHistory(history) {
    const next = normalizeHistory(history);
    writeStorage(historyKey, JSON.stringify(next));
    return next;
  }

  function getGuideMeta() {
    const article = document.querySelector('[data-guide-level][data-guide-path]');
    if (!article) return null;
    return {
      count: Number(article.getAttribute('data-guide-count') || 0),
      level: clampLevel(article.getAttribute('data-guide-level') || 1),
      path: article.getAttribute('data-guide-path') || location.pathname
    };
  }

  function getGuideCount() {
    const counts = Array.from(document.querySelectorAll('[data-guide-count]'))
      .map(node => Number(node.getAttribute('data-guide-count') || 0))
      .filter(Boolean);
    if (counts.length) return Math.max(...counts);

    const guideItems = readGuideJourneyData();
    if (guideItems.length) return guideItems.length;

    const links = new Set(Array.from(document.querySelectorAll('a[href^="/guides/"]'))
      .map(link => link.getAttribute('href'))
      .filter(Boolean));
    return Math.max(links.size, Object.keys(readHistory()).length);
  }

  function computeExp(history) {
    return Object.values(history)
      .filter(record => record && record.expAwarded)
      .length * expPerGuide;
  }

  function syncExpCache(history) {
    const exp = computeExp(history);
    if (String(exp) !== readStorage(expKey)) {
      writeStorage(expKey, String(exp));
    }
    return exp;
  }

  function upgradeLevelForCurrentGuide() {
    const meta = getGuideMeta();
    const current = readLevel();
    if (!meta || meta.level <= current) return current;
    return writeLevel(meta.level);
  }

  function getHistoryRecord(history, meta) {
    const existing = history[meta.path] || {};
    return {
      bottomReached: Boolean(existing.bottomReached),
      completedAt: existing.completedAt,
      dwellMs: Number(existing.dwellMs) || 0,
      expAwarded: Boolean(existing.expAwarded),
      firstSeen: existing.firstSeen || new Date().toISOString(),
      level: meta.level,
      path: meta.path
    };
  }

  function startGuideVisit() {
    const meta = getGuideMeta();
    if (!meta) return;
    if (activeVisit?.path === meta.path) return;

    // preserve time from a previous guide if navigation swaps content in-place
    persistVisitTime();

    const history = readHistory();
    const record = getHistoryRecord(history, meta);
    history[meta.path] = record;
    writeHistory(history);

    activeVisit = {
      path: meta.path,
      startedAt: Date.now()
    };
    checkBottomReached();
  }

  function persistVisitTime() {
    if (!activeVisit) return readHistory();

    const history = readHistory();
    const record = history[activeVisit.path];
    if (!record) return history;

    const now = Date.now();
    const elapsed = Math.max(0, now - activeVisit.startedAt);
    activeVisit.startedAt = now;
    record.dwellMs = (Number(record.dwellMs) || 0) + elapsed;
    history[activeVisit.path] = record;
    return writeHistory(history);
  }

  function awardExpIfReady() {
    const meta = getGuideMeta();
    if (!meta || !activeVisit) return;

    const history = persistVisitTime();
    const record = history[meta.path];
    if (!record || record.expAwarded) {
      syncExpCache(history);
      return;
    }

    if (!record.bottomReached || Number(record.dwellMs) < requiredDwellMs) {
      syncExpCache(history);
      return;
    }

    record.completedAt = new Date().toISOString();
    record.expAwarded = true;
    history[meta.path] = record;
    syncExpCache(writeHistory(history));
  }

  function checkBottomReached() {
    const meta = getGuideMeta();
    if (!meta) return;

    const scrollBottom = window.scrollY + window.innerHeight;
    const pageHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    if (pageHeight - scrollBottom > 80) return;

    const history = persistVisitTime();
    const record = getHistoryRecord(history, meta);
    record.bottomReached = true;
    history[meta.path] = record;
    writeHistory(history);
    awardExpIfReady();
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

  function applyProgress(level) {
    const root = getRoot();
    const readerLevel = clampLevel(level);
    root.dataset.readerLevel = String(readerLevel);
    for (let level = 1; level <= 8; level += 1) {
      root.classList.remove('docs-level-' + level);
    }
    root.classList.add('docs-level-' + readerLevel);

    if (readerLevel < 4) {
      setTheme('light', { persist: false });
    } else {
      const saved = getSavedTheme();
      setTheme(saved === 'dark' || saved === 'light' ? saved : 'light', {
        persist: false
      });
    }

    document.querySelectorAll('[data-unlock-level]').forEach(node => {
      const level = Number(node.getAttribute('data-unlock-level') || 1);
      node.hidden = level > readerLevel;
    });
    orderGuideNav(readerLevel);
    renderBadge(readerLevel);

    document.querySelectorAll('.docs-theme-switch').forEach(button => {
      button.hidden = readerLevel < 4;
      button.disabled = readerLevel < 4;
    });
  }

  function readGuideJourneyData() {
    const node = document.getElementById('docs-guide-journey-data');
    const items = parse(node?.textContent, []);
    if (!Array.isArray(items)) return [];

    const unique = new Map();
    items.forEach(item => {
      const href = typeof item?.href === 'string' ? item.href : '';
      const label = typeof item?.label === 'string' ? item.label : '';
      if (!href || !label || unique.has(href)) return;
      unique.set(href, {
        href,
        label,
        level: clampLevel(item.level || 1)
      });
    });
    return Array.from(unique.values());
  }

  function getVisibleJourneyLinks(readerLevel) {
    const sections = Array.from(document.querySelectorAll(
      `.docs-sidebar [data-unlock-level="${readerLevel}"]`
    ));
    const links = sections.flatMap(section => Array.from(
      section.querySelectorAll('a[href^="/guides/"]')
    ));

    if (links.length) return links;
    return Array.from(document.querySelectorAll(
        `a[data-unlock-level="${readerLevel}"][href^="/guides/"]`
    ));
  }

  function normalizeJourneyLink(item, history) {
    return {
      completed: Boolean(history[item.href]?.expAwarded),
      href: item.href,
      label: item.label
    };
  }

  function getJourneyLinks(readerLevel, history) {
    const manifestItems = readGuideJourneyData()
      .filter(item => item.level === readerLevel)
      .map(item => normalizeJourneyLink(item, history));
    if (manifestItems.length) return manifestItems;

    const links = getVisibleJourneyLinks(readerLevel);
    const unique = new Map();
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !unique.has(href)) {
        unique.set(href, {
          completed: Boolean(history[href]?.expAwarded),
          href,
          label: link.getAttribute('data-journey-label') || link.textContent.trim()
        });
      }
    });
    return Array.from(unique.values());
  }

  function renderJourney(readerLevel, history) {
    const items = getJourneyLinks(readerLevel, history);
    const next = items.find(item => !item.completed);
    const completed = items
      .filter(item => item.completed && item.href !== next?.href)
      .reverse();
    return [
      ...(next ? [{ ...next, next: true }] : []),
      ...completed
    ].slice(0, 7);
  }

  function renderBadge(readerLevel) {
    const history = readHistory();
    const exp = syncExpCache(history);
    const maxExp = Math.max(expPerGuide, getGuideCount() * expPerGuide);
    const percent = Math.max(0, Math.min(100, Math.round((exp / maxExp) * 100)));

    document.querySelectorAll('[data-progress-count], [data-badge-label]')
      .forEach(node => {
        node.textContent = guideGroups[readerLevel].badge;
      });

    document.querySelectorAll('[data-exp-fill]').forEach(node => {
      node.style.width = percent + '%';
    });

    document.querySelectorAll('[data-exp-meter]').forEach(node => {
      node.setAttribute('aria-valuenow', String(percent));
    });

    document.querySelectorAll('[data-exp-value]').forEach(node => {
      node.textContent = exp.toLocaleString();
    });

    document.querySelectorAll('[data-progress-list]').forEach(node => {
      node.innerHTML = '';
      renderJourney(readerLevel, history).forEach(item => {
        const row = document.createElement('li');
        const icon = document.createElement('i');
        const link = document.createElement('a');

        row.className = item.next ? 'is-next' : 'is-complete';
        icon.className = item.next
          ? 'fa-solid fa-arrow-right'
          : 'fa-solid fa-check';
        icon.setAttribute('aria-hidden', 'true');
        link.href = item.href;
        link.textContent = item.label;

        row.appendChild(icon);
        row.appendChild(link);
        node.appendChild(row);
      });
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

  function positionBadgePopover(button, popover) {
    const gap = 10;
    const margin = 18;
    const rect = button.getBoundingClientRect();
    popover.style.left = '';
    popover.style.right = '';
    popover.style.top = rect.bottom + gap + 'px';

    const width = popover.offsetWidth || Math.min(420, window.innerWidth - margin * 2);
    const left = Math.max(
      margin,
      Math.min(rect.right - width, window.innerWidth - width - margin)
    );
    popover.style.left = left + 'px';
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
        const shouldOpen = popover.hidden;
        popover.hidden = !shouldOpen;
        badgeButton.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        if (shouldOpen) {
          positionBadgePopover(badgeButton, popover);
        }
      }
      return;
    }

    const toggle = target.closest('[data-panel-toggle]');
    if (toggle) {
      togglePanel(toggle);
    }
  }

  function registerEngagementTracking() {
    if (scrollTrackingReady) return;
    scrollTrackingReady = true;
    window.addEventListener('scroll', checkBottomReached, { passive: true });
    window.addEventListener('beforeunload', () => {
      awardExpIfReady();
      persistVisitTime();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        awardExpIfReady();
      } else if (activeVisit) {
        activeVisit.startedAt = Date.now();
      }
    });
    window.setInterval(awardExpIfReady, 15000);
  }

  function initialize(options) {
    hideUntilReady();
    const level = upgradeLevelForCurrentGuide();
    startGuideVisit();
    applyProgress(level);
    updateThemeButtons();
    registerEngagementTracking();
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
