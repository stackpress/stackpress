const switchControl = document.querySelector('.theme-switch');

switchControl?.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
  switchControl.setAttribute('aria-pressed', String(!isDark));
});

document.querySelectorAll('[data-panel-toggle]').forEach(button => {
  button.addEventListener('click', () => {
    const panel = document.getElementById(button.dataset.panelToggle);
    if (!panel) return;
    const isOpen = panel.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});
