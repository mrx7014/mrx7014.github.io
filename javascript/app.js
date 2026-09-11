(() => {
  const root = document.documentElement;
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');
  const themeButton = document.querySelector('.theme-button');
  const projectGrid = document.querySelector('[data-projects]');
  const fallback = [
    ['WebGetter','An open-source utility for retrieving website source code.','web','WebGetter'],
    ['QuickDesk','A disposable remote desktop environment launched with one command.','tools','QuickDesk'],
    ['OneUFy','Extending and customizing the One UI Android experience.','android','OneUFy'],
    ['arfix','A tool for fixing broken Arabic text rendering in terminals.','tools','arfix'],
    ['SuperMario-Tweaker','A device-tweaking module for performance and stability.','android','SuperMario-Tweaker'],
    ['SpoofingCollection','Magisk and LSPosed modules for Android customization.','android','SpoofingCollection']
  ];
  const escapeHTML = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const category = repo => { const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase(); if (/android|magisk|termux|oneui|rom|lsposed/.test(text)) return 'android'; if (/web|website|javascript|typescript|html/.test(text)) return 'web'; return 'tools'; };
  const renderProjects = repos => {
    const list = repos.filter(repo => !repo.fork).slice(0, 12);
    document.querySelector('[data-count]').textContent = repos.length;
    projectGrid.innerHTML = list.map((repo, index) => {
      const type = category(repo), topics = (repo.topics || []).slice(0, 3), banner = `https://opengraph.githubassets.com/1/mrx7014/${encodeURIComponent(repo.name)}`;
      const date = repo.pushed_at ? new Date(repo.pushed_at).toLocaleDateString(undefined, {month:'short', year:'numeric'}) : 'Open source';
      return `<article class="project-card ${index === 0 ? 'featured' : ''}" data-category="${type}"><a class="project-image" href="${escapeHTML(repo.html_url)}" target="_blank" rel="noopener"><img src="${banner}" alt="${escapeHTML(repo.name)} banner" loading="lazy" onerror="this.src='https://opengraph.githubassets.com/1/mrx7014/WebGetter'"><span class="image-arrow">↗</span></a><div class="project-info"><div><span class="project-number">${String(index + 1).padStart(2,'0')} / ${type}</span><h3>${escapeHTML(repo.name)}</h3><p>${escapeHTML(repo.description || 'An open-source project by MRX7014.')}</p>${topics.length ? `<div class="repo-topics">${topics.map(topic => `<span class="repo-topic">#${escapeHTML(topic)}</span>`).join('')}</div>` : ''}<div class="repo-meta">Updated ${date}</div></div><a class="project-link" href="${escapeHTML(repo.html_url)}" target="_blank" rel="noopener">View repository ↗</a></div></article>`;
    }).join('');
    bindFilters();
  };
  const bindFilters = () => document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.filter').forEach(item => item.classList.remove('active')); button.classList.add('active'); const value = button.dataset.filter; projectGrid.querySelectorAll('.project-card').forEach(card => card.classList.toggle('is-hidden', value !== 'all' && card.dataset.category !== value)); }));
  const fallbackRepos = fallback.map(([name, description, type, slug]) => ({name, description, html_url:`https://github.com/mrx7014/${slug}`, topics:[type]}));
  fetch('https://api.github.com/users/mrx7014/repos?per_page=100&sort=pushed').then(response => { if (!response.ok) throw new Error('GitHub unavailable'); return response.json(); }).then(renderProjects).catch(() => renderProjects(fallbackRepos));
  const savedTheme = localStorage.getItem('mrx-theme'); if (savedTheme) root.dataset.theme = savedTheme;
  const updateThemeLabel = () => { const light = root.dataset.theme === 'light'; themeButton.querySelector('span').textContent = light ? '☾' : '☼'; themeButton.querySelector('b').textContent = light ? 'Dark mode' : 'Light mode'; };
  updateThemeLabel(); themeButton.addEventListener('click', () => { root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'; localStorage.setItem('mrx-theme', root.dataset.theme); updateThemeLabel(); });
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', open); }); nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));
  const glow = document.querySelector('.cursor-glow'); window.addEventListener('pointermove', event => { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; }, {passive:true});
  document.getElementById('year').textContent = new Date().getFullYear();
})();
