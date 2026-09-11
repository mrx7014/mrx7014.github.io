(() => {
  const grid = document.querySelector('[data-project-grid]');
  if (!grid) return;
  const username = 'mrx7014';
  const fallback = [
    {name:'WebGetter',description:'An open-source utility for retrieving website source code.',html_url:'https://github.com/mrx7014/WebGetter',topics:['web','tool']},
    {name:'QuickDesk',description:'A disposable remote desktop environment designed to be launched with a single command.',html_url:'https://github.com/mrx7014/QuickDesk',topics:['linux','tool']},
    {name:'OneUFy',description:'Extending and customizing the One UI Android experience.',html_url:'https://github.com/mrx7014/OneUFy',topics:['android']},
    {name:'arfix',description:'A tool for fixing broken Arabic text rendering in terminals.',html_url:'https://github.com/mrx7014/arfix',topics:['tool','linux']},
    {name:'SuperMario-Tweaker',description:'A device-tweaking module aimed at improving performance and stability.',html_url:'https://github.com/mrx7014/SuperMario-Tweaker',topics:['android']},
    {name:'SpoofingCollection',description:'Magisk and LSPosed modules for customizing Android device fingerprints.',html_url:'https://github.com/mrx7014/SpoofingCollection',topics:['android']},
    {name:'NoSleep-Termux',description:'A simple Bash script that helps prevent Termux from sleeping.',html_url:'https://github.com/mrx7014/NoSleep-Termux',topics:['tools','android']},
    {name:'TGCleaner-BOT',description:'A Telethon-based Telegram bot for cleaning selected groups.',html_url:'https://github.com/mrx7014/TGCleaner-BOT',topics:['tools']}
  ];
  const getCategory = repo => {
    const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
    if (/android|magisk|termux|oneui|rom|lsposed/.test(text)) return 'android';
    if (/web|website|javascript|typescript|html/.test(text)) return 'web';
    return 'tools';
  };
  const escape = value => String(value || '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
  const render = repos => {
    const selected = repos.filter(repo => !repo.fork).slice(0, 12);
    document.querySelector('[data-repo-count]').textContent = repos.length;
    grid.innerHTML = selected.map((repo, index) => {
      const category = getCategory(repo), topics = (repo.topics || []).slice(0, 3);
      const banner = `https://opengraph.githubassets.com/1/${username}/${encodeURIComponent(repo.name)}`;
      const updated = repo.pushed_at ? `Updated ${new Date(repo.pushed_at).toLocaleDateString(undefined,{month:'short',year:'numeric'})}` : 'Open source project';
      return `<article class="project-card repo-card ${index === 0 ? 'project-featured' : ''}" data-category="${category}"><a class="project-image repo-banner" href="${escape(repo.html_url)}" target="_blank" rel="noopener noreferrer"><img src="${banner}" alt="${escape(repo.name)} GitHub banner" loading="lazy" onerror="this.onerror=null;this.src='./assets/webgetter.jpg'"><span class="image-arrow">↗</span></a><div class="project-info"><div><span class="project-number">${String(index + 1).padStart(2,'0')} / ${category.toUpperCase()}</span><h3>${escape(repo.name)}</h3><p>${escape(repo.description || 'Open-source project by MRX7014.')}</p>${topics.length ? `<div class="repo-topics">${topics.map(topic => `<span class="repo-topic">#${escape(topic)}</span>`).join('')}</div>` : ''}<div class="repo-updated">${updated}</div></div><a class="project-link" href="${escape(repo.html_url)}" target="_blank" rel="noopener noreferrer">View repository ↗</a></div></article>`;
    }).join('');
    grid.querySelectorAll('.project-card').forEach(card => {
      if (window.IntersectionObserver) repoObserver.observe(card);
    });
    document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(item => item.classList.remove('active')); button.classList.add('active');
      const filter = button.dataset.filter;
      grid.querySelectorAll('.project-card').forEach(card => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter));
    }));
  };
  const repoObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), {threshold:.12});
  fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`)
    .then(response => { if (!response.ok) throw new Error('GitHub API unavailable'); return response.json(); })
    .then(repos => render(repos))
    .catch(() => render(fallback));
})();
