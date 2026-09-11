(() => {
  const root = document.documentElement, menu = document.querySelector('.menu'), nav = document.querySelector('.nav'), themeButton = document.querySelector('.theme-button'), projectGrid = document.querySelector('[data-projects]');
  const profileReadme = 'https://raw.githubusercontent.com/mrx7014/mrx7014/master/README.md';
  const fallback = [['OneUFy','A project focused on extending and customizing the One UI Android experience.'],['FontMerger','A Python utility for merging fonts into a single font.'],['arfix','A tool for fixing broken Arabic text rendering in terminals.'],['QuickDesk','A disposable remote desktop environment designed to be launched with a single command.'],['WebGetter','An open-source utility for retrieving website source code.'],['SuperMario-Tweaker','A device-tweaking module aimed at improving performance and stability for gaming and everyday use.'],['morphe-patches','Java-based patches for the Morphe project.'],['SpoofingCollection','A collection of Magisk and LSPosed modules for customizing Android device fingerprints and build properties.'],['WebGetter-Website','The website interface and companion project for WebGetter.'],['NoSleep-Termux','A simple Bash script that helps prevent Termux from sleeping in the background.'],['TGCleaner-BOT','A Telethon-based Telegram bot for removing non-admin members from a selected group.'],['SPSS_Android','A Bash script for installing IBM SPSS on Android environments.']];
  const escapeHTML = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const repoSlug = name => `https://github.com/mrx7014/${encodeURIComponent(name)}`;
  const imageFromReadme = async name => {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/mrx7014/${encodeURIComponent(name)}/master/README.md`);
      if (!response.ok) throw new Error();
      const markdown = await response.text();
      const candidates = [];
      const markdownImages = [...markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1]);
      const htmlImages = [...markdown.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(match => match[1]);
      [...markdownImages, ...htmlImages].forEach(url => { if (url && !/shields\.io|badge|github-readme|komarev|typing-svg|profile-summary/i.test(url)) candidates.push(url); });
      const chosen = candidates[0];
      if (!chosen) throw new Error();
      if (/^https?:\/\//i.test(chosen)) return chosen;
      return `https://raw.githubusercontent.com/mrx7014/${encodeURIComponent(name)}/master/${chosen.replace(/^\.\//,'')}`;
    } catch { return `https://opengraph.githubassets.com/1/mrx7014/${encodeURIComponent(name)}`; }
  };
  const parseProfileProjects = markdown => {
    const projects=[];
    markdown.split('\n').forEach(line => { const match=line.match(/^\|\s*\[([^\]]+)\]\([^)]*\/([^)/]+)\)\s*\|\s*(.*?)\s*\|/); if (match && !projects.some(item=>item[0]===match[1])) projects.push([match[1], match[3].replace(/\s+$/,'')]); });
    return projects.length ? projects : fallback;
  };
  const renderProjects = async projects => {
    document.querySelector('[data-count]').textContent = projects.length;
    projectGrid.innerHTML = projects.map((repo,index) => `<article class="project-card ${index===0?'featured':''}"><a class="project-image" href="${repoSlug(repo[0])}" target="_blank" rel="noopener"><img data-banner="${escapeHTML(repo[0])}" alt="${escapeHTML(repo[0])} README banner" loading="lazy"><span class="image-arrow">↗</span></a><div class="project-info"><div><span class="project-number">${String(index+1).padStart(2,'0')} / README PROJECT</span><h3>${escapeHTML(repo[0])}</h3><p>${escapeHTML(repo[1])}</p><div class="repo-meta">Synced from the profile README</div></div><a class="project-link" href="${repoSlug(repo[0])}" target="_blank" rel="noopener">View repository ↗</a></div></article>`).join('');
    await Promise.all([...projectGrid.querySelectorAll('[data-banner]')].map(async image => { const name=image.dataset.banner; image.src=await imageFromReadme(name); image.onerror=()=>{image.onerror=null;image.src=`https://opengraph.githubassets.com/1/mrx7014/${encodeURIComponent(name)}`;}; }));
  };
  fetch(profileReadme).then(response=>{if(!response.ok)throw new Error();return response.text();}).then(markdown=>renderProjects(parseProfileProjects(markdown))).catch(()=>renderProjects(fallback));
  const savedTheme=localStorage.getItem('mrx-theme'); if(savedTheme)root.dataset.theme=savedTheme; const updateTheme=()=>{const light=root.dataset.theme==='light';themeButton.querySelector('span').textContent=light?'☾':'☼';themeButton.querySelector('b').textContent=light?'Dark mode':'Light mode';}; updateTheme(); themeButton.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='light'?'dark':'light';localStorage.setItem('mrx-theme',root.dataset.theme);updateTheme();});
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);}); nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
  const glow=document.querySelector('.cursor-glow'); window.addEventListener('pointermove',event=>{glow.style.left=`${event.clientX}px`;glow.style.top=`${event.clientY}px`;},{passive:true}); document.getElementById('year').textContent=new Date().getFullYear();
})();
