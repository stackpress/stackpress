const rows = document.querySelectorAll('[data-select-row]');
for (const row of rows) {
  row.addEventListener('click', () => {
    for (const item of rows) item.classList.remove('selected');
    row.classList.add('selected');
  });
}

const toggles = document.querySelectorAll('[data-toggle]');
for (const toggle of toggles) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
  });
}
