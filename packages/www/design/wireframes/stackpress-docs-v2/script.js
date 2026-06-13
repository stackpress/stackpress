(function () {
  const key = 'stackpressDocsWireframe';
  const starterGuides = [
    '000-course-path',
    '001-what-stackpress-is',
    '002-getting-started',
    '100-develop',
    '110-plugins',
    '120-pages',
    '140-views',
    '160-debugging'
  ];

  function readCookie() {
    const cookie = document.cookie
      .split('; ')
      .find((part) => part.startsWith(`${key}=`));
    if (!cookie) return null;
    try {
      return JSON.parse(decodeURIComponent(cookie.split('=').slice(1).join('=')));
    } catch (_) {
      return null;
    }
  }

  function readState() {
    const fromCookie = readCookie();
    if (fromCookie) return normalize(fromCookie);
    try {
      return normalize(JSON.parse(localStorage.getItem(key) || '{}'));
    } catch (_) {
      return normalize({});
    }
  }

  function writeState(state) {
    const next = normalize(state);
    const value = encodeURIComponent(JSON.stringify(next));
    document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem(key, JSON.stringify(next));
    return next;
  }

  function normalize(state) {
    return {
      completed: Array.isArray(state.completed) ? state.completed : [],
      updated: state.updated || null
    };
  }

  function hasFinishedStarterPath(state) {
    return state.completed.includes('160-debugging');
  }

  function labelForGuide(id) {
    const labels = {
      '000-course-path': '000 Course Path',
      '001-what-stackpress-is': '001 What Stackpress Is',
      '002-getting-started': '002 Getting Started',
      '100-develop': '100 Develop',
      '110-plugins': '110 Plugins',
      '120-pages': '120 Pages',
      '140-views': '140 Views',
      '160-debugging': '160 Debugging'
    };
    return labels[id] || id;
  }

  function applyState(state) {
    const finished = hasFinishedStarterPath(state);
    document.documentElement.classList.toggle('has-next-guides', finished);

    document.querySelectorAll('[data-complete-guide]').forEach((button) => {
      const id = button.getAttribute('data-complete-guide');
      const done = state.completed.includes(id);
      button.textContent = done ? 'Completed' : 'Mark complete';
      button.disabled = done;
    });

    document.querySelectorAll('[data-guide-row]').forEach((row) => {
      row.classList.toggle(
        'is-complete',
        state.completed.includes(row.getAttribute('data-guide-row'))
      );
    });

    document.querySelectorAll('[data-hidden-until-complete]').forEach((node) => {
      node.hidden = !finished;
    });

    document.querySelectorAll('[data-before-complete]').forEach((node) => {
      node.hidden = finished;
    });

    const count = starterGuides.filter((id) => state.completed.includes(id)).length;
    document.querySelectorAll('[data-progress-count]').forEach((node) => {
      node.textContent = `${count} of ${starterGuides.length}`;
    });

    document.querySelectorAll('[data-progress-list]').forEach((node) => {
      node.innerHTML = '';
      starterGuides.forEach((id) => {
        const item = document.createElement('li');
        item.textContent = `${state.completed.includes(id) ? 'Done' : 'Open'} - ${labelForGuide(id)}`;
        node.appendChild(item);
      });
    });
  }

  function completeGuide(id) {
    const state = readState();
    if (!state.completed.includes(id)) {
      state.completed.push(id);
      state.updated = new Date().toISOString();
    }
    applyState(writeState(state));
  }

  function resetProgress() {
    document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`;
    localStorage.removeItem(key);
    applyState(writeState({ completed: [], updated: new Date().toISOString() }));
  }

  document.addEventListener('click', (event) => {
    const badge = event.target.closest('[data-badge-toggle]');
    if (badge) {
      const popup = document.querySelector('[data-badge-popover]');
      if (popup) popup.hidden = !popup.hidden;
      return;
    }

    const complete = event.target.closest('[data-complete-guide]');
    if (complete) {
      completeGuide(complete.getAttribute('data-complete-guide'));
      return;
    }

    const reset = event.target.closest('[data-reset-progress]');
    if (reset) {
      resetProgress();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('[data-badge-popover]').forEach((node) => {
        node.hidden = true;
      });
    }
  });

  applyState(readState());
})();
