(function () {
  const progressKey = 'stackpressDocsCreativeV2';
  const themeKey = 'stackpressDocsCreativeV2Theme';
  const guideGroups = {
    1: { badge: 'Visitor', label: '100 Develop' },
    2: { badge: 'Junior', label: '200 Data' },
    3: { badge: 'Backend', label: '300 Idea' },
    4: { badge: 'Builder', label: '400 Build and Deploy' },
    5: { badge: 'DevOps', label: '500 Project Structure' },
    6: { badge: 'Senior', label: '600 Built-ins' },
    7: { badge: 'Architect', label: '700 Studio' },
    8: { badge: 'Legend', label: '800 AI' }
  };
  const defaultCompleted = ['000-orientation', '100-develop'];

  function parse(value) {
    try {
      return JSON.parse(value || '{}');
    } catch (_) {
      return {};
    }
  }

  function readCookie() {
    const found = document.cookie
      .split('; ')
      .find((part) => part.startsWith(`${progressKey}=`));
    return found ? parse(decodeURIComponent(found.split('=').slice(1).join('='))) : {};
  }

  function normalize(state) {
    const level = Number.isFinite(Number(state.level)) ? Number(state.level) : 1;
    return {
      level: Math.max(0, Math.min(8, level)),
      completed: Array.isArray(state.completed) ? state.completed : defaultCompleted.slice()
    };
  }

  function readState() {
    const cookie = normalize(readCookie());
    if (cookie.completed.length) return cookie;
    return normalize(parse(localStorage.getItem(progressKey)));
  }

  function writeState(state) {
    const next = normalize(state);
    const encoded = encodeURIComponent(JSON.stringify(next));
    document.cookie = `${progressKey}=${encoded}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem(progressKey, JSON.stringify(next));
    return next;
  }

  function applyState(state) {
    const readerLevel = state.level;
    const hasData = readerLevel >= 2;
    document.documentElement.dataset.readerLevel = String(readerLevel);
    document.documentElement.classList.toggle('has-completed-160', hasData);
    if (readerLevel < 4) {
      setTheme('light', { persist: false });
    } else {
      setTheme(localStorage.getItem(themeKey) || 'light', { persist: false });
    }

    document.querySelectorAll('[data-after-160]').forEach((node) => {
      node.hidden = !hasData;
    });
    document.querySelectorAll('[data-before-160]').forEach((node) => {
      node.hidden = hasData;
    });
    document.querySelectorAll('[data-unlock-level]').forEach((node) => {
      const unlockLevel = Number(node.getAttribute('data-unlock-level') || 0);
      node.hidden = unlockLevel > readerLevel;
    });
    document.querySelectorAll('[data-nav-current-level]').forEach((node) => {
      node.classList.toggle('is-current', Number(node.getAttribute('data-nav-current-level')) === readerLevel);
    });
    document.querySelectorAll('[data-guide-row]').forEach((node) => {
      node.classList.toggle('is-done', state.completed.includes(node.dataset.guideRow));
    });
    document.querySelectorAll('[data-badge-label]').forEach((node) => {
      node.textContent = guideGroups[readerLevel].badge;
    });
    document.querySelectorAll('[data-reader-level-label]').forEach((node) => {
      node.textContent = String(readerLevel);
    });
    document.querySelectorAll('[data-current-path]').forEach((node) => {
      node.textContent = guideGroups[readerLevel].label;
    });
    document.querySelectorAll('[data-reading-ahead]').forEach((node) => {
      const pageLevel = Number(node.getAttribute('data-page-level') || 0);
      node.hidden = pageLevel <= readerLevel;
    });
    document.querySelectorAll('[data-era-level]').forEach((node) => {
      node.hidden = Number(node.getAttribute('data-era-level')) !== readerLevel;
    });

    document.querySelectorAll('[data-progress-count]').forEach((node) => {
      node.textContent = guideGroups[readerLevel].badge;
    });
    document.querySelectorAll('[data-level-choice]').forEach((node) => {
      const isCurrent = Number(node.getAttribute('data-sim-level')) === readerLevel;
      node.classList.toggle('is-active', isCurrent);
      node.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    });
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.hidden = readerLevel < 4;
      button.disabled = readerLevel < 4;
    });
    document.querySelectorAll('[data-progress-list]').forEach((node) => {
      node.innerHTML = '';
      Object.entries(guideGroups).forEach(([level, group]) => {
        if (Number(level) > readerLevel) return;
        const item = document.createElement('li');
        item.textContent = `${group.badge} - ${group.label}`;
        node.appendChild(item);
      });
    });
  }

  function buildSimulators() {
    document.querySelectorAll('.simulator').forEach((simulator) => {
      const levels = Object.entries(guideGroups)
        .map(([level, group]) => `<button type="button" data-level-choice data-sim-level="${level}">${group.label.slice(0, 3)} ${group.badge}</button>`)
        .join('');
      simulator.innerHTML = `
        <p class="label">Review-only simulator</p>
        <div class="simulator-levels" role="group" aria-label="Choose reader state">${levels}</div>
        <button type="button" data-sim-reset>Reset</button>
      `;
    });
  }

  function setComplete() {
    applyState(writeState({
      level: 2,
      completed: defaultCompleted.concat(['160-debugging', '200-data'])
    }));
  }

  function reset() {
    document.cookie = `${progressKey}=; path=/; max-age=0; SameSite=Lax`;
    localStorage.removeItem(progressKey);
    applyState({ level: 1, completed: defaultCompleted.slice() });
  }

  function setLevel(level) {
    const completed = Object.keys(guideGroups)
      .map(Number)
      .filter((item) => item <= level)
      .map((item) => `${String(item).padStart(3, '0')}-${guideGroups[item].label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
    applyState(writeState({ level, completed }));
  }

  function setTheme(theme, options = {}) {
    const readerLevel = Number(document.documentElement.dataset.readerLevel || 1);
    const nextTheme = readerLevel < 4 ? 'light' : theme;
    document.documentElement.dataset.theme = nextTheme;
    if (options.persist !== false && readerLevel >= 4) {
      localStorage.setItem(themeKey, nextTheme);
    }
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', nextTheme === 'dark' ? 'true' : 'false');
    });
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-badge-toggle]')) {
      const popover = document.querySelector('[data-badge-popover]');
      if (popover) popover.hidden = !popover.hidden;
    }
    if (event.target.closest('[data-sim-complete]')) {
      setComplete();
    }
    if (event.target.closest('[data-sim-reset]')) {
      reset();
    }
    const levelButton = event.target.closest('[data-sim-level]');
    if (levelButton) {
      setLevel(Number(levelButton.getAttribute('data-sim-level')));
    }
    if (event.target.closest('[data-theme-toggle]')) {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    }
  });

  setTheme(localStorage.getItem(themeKey) || 'light');
  buildSimulators();
  if (document.body.dataset.demoLevel) {
    setLevel(Number(document.body.dataset.demoLevel));
  } else if (document.body.dataset.demoState === 'completed') {
    setComplete();
  } else {
    applyState(readState());
  }
})();
