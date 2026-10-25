(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'portfolio-search';
  dialog.setAttribute('aria-labelledby', 'portfolio-search-title');
  dialog.innerHTML = '<div class="portfolio-search-heading"><h2 id="portfolio-search-title">Search this site</h2><form method="dialog"><button aria-label="Close search">Close</button></form></div><label for="portfolio-query">Search galleries and pages</label><input id="portfolio-query" type="search" autocomplete="off"><p class="portfolio-search-status" aria-live="polite"></p><ul></ul>';
  document.body.append(dialog);
  const input = dialog.querySelector('input');
  const results = dialog.querySelector('ul');
  const status = dialog.querySelector('.portfolio-search-status');
  let entries;
  let openingButton;
  const render = () => {
    results.replaceChildren();
    if (!entries) return;
    const words = input.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    const matches = entries.filter(entry => words.every(word => `${entry.title} ${entry.text}`.toLocaleLowerCase().includes(word)));
    status.textContent = `${matches.length} ${matches.length === 1 ? 'result' : 'results'}`;
    for (const entry of matches) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = entry.url;
      link.textContent = entry.title;
      li.append(link);
      results.append(li);
    }
  };
  input.addEventListener('input', render);
  for (const button of document.querySelectorAll('[data-portfolio-search]')) {
    button.addEventListener('click', async () => {
      openingButton = button;
      dialog.showModal();
      input.focus();
      if (!entries) {
        status.textContent = 'Loading…';
        try {
          const response = await fetch('/search-index.json');
          if (!response.ok) throw new Error('Search index unavailable');
          entries = await response.json();
        } catch {
          status.textContent = 'Search is unavailable. Please browse the galleries from Home.';
          return;
        }
      }
      render();
    });
  }
  dialog.addEventListener('close', () => openingButton?.focus());
})();
