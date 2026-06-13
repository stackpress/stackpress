(function () {
  const key = 'stackpressDocsRound3';
  const guides = [
    '000-course-path',
    '001-what-stackpress-is',
    '002-getting-started',
    '100-develop',
    '110-plugins',
    '120-pages',
    '140-views',
    '160-debugging'
  ];

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
      .find((part) => part.startsWith(`${key}=`));
    return found ? parse(decodeURIComponent(found.split('=').slice(1).join('='))) : {};
  }

  function normalize(state) {
    return {
      completed: Array.isArray(state.completed) ? state.completed : []
    };
  }

  function readState() {
    const cookie = normalize(readCookie());
    if (cookie.completed.length) return cookie;
    return normalize(parse(localStorage.getItem(key)));
  }

  function writeState(state) {
    const next = normalize(state);
    const value = encodeURIComponent(JSON.stringify(next));
    document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem(key, JSON.stringify(next));
    return next;
  }

  function apply(state) {
    const complete160 = state.completed.includes('160-debugging');
    document.documentElement.classList.toggle('has-completed-160', complete160);

    document.querySelectorAll('[data-after-160]').forEach((node) => {
      node.hidden = !complete160;
    });
    document.querySelectorAll('[data-before-160]').forEach((node) => {
      node.hidden = complete160;
    });
    document.querySelectorAll('[data-guide-row]').forEach((node) => {
      node.classList.toggle('is-done', state.completed.includes(node.dataset.guideRow));
    });

    const count = guides.filter((id) => state.completed.includes(id)).length;
    document.querySelectorAll('[data-progress-count]').forEach((node) => {
      node.textContent = `${count} of ${guides.length}`;
    });
    document.querySelectorAll('[data-progress-list]').forEach((node) => {
      node.innerHTML = '';
      guides.forEach((id) => {
        const item = document.createElement('li');
        item.textContent = `${state.completed.includes(id) ? 'Done' : 'Open'} - ${labels[id]}`;
        node.appendChild(item);
      });
    });
  }

  function setStarterComplete() {
    apply(writeState({ completed: guides.slice() }));
  }

  function reset() {
    document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`;
    localStorage.removeItem(key);
    apply({ completed: [] });
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-badge-toggle]')) {
      const popover = document.querySelector('[data-badge-popover]');
      if (popover) popover.hidden = !popover.hidden;
    }
    if (event.target.closest('[data-sim-complete]')) {
      setStarterComplete();
    }
    if (event.target.closest('[data-sim-reset]')) {
      reset();
    }
  });

  if (document.body.dataset.demoState === 'completed') {
    setStarterComplete();
  } else {
    apply(readState());
  }
})();
