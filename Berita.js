document.addEventListener('DOMContentLoaded', () => {
  // existing features (reading time, zoom, color-fix, share)
  const article = document.querySelector('#Berita');
  const readingTimeEl = document.getElementById('reading-time');
  if (article && readingTimeEl) {
    const text = article.innerText || '';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    readingTimeEl.textContent = `${minutes} menit baca`;
  }

  const root = document.documentElement;
  let baseSize = parseFloat(getComputedStyle(root).fontSize) || 16;
  document.getElementById('zoom-in')?.addEventListener('click', () => {
    baseSize = Math.min(22, baseSize + 1);
    root.style.fontSize = baseSize + 'px';
  });
  document.getElementById('zoom-out')?.addEventListener('click', () => {
    baseSize = Math.max(12, baseSize - 1);
    root.style.fontSize = baseSize + 'px';
  });

  // inline red -> brown fallback (keeps original brown body text)
  document.querySelectorAll('*').forEach(el => {
    const c = el.style && (el.style.color || el.style['color']);
    if (c && /red|#f00|rgb\(255,\s*0,\s*0\)/i.test(c)) {
      el.style.color = '#3b2f2f';
    }
  });

  const shareBtn = document.getElementById('share-btn');
  shareBtn?.addEventListener('click', async () => {
    const data = {
      title: document.title,
      text: document.querySelector('.article-header h2')?.innerText || '',
      url: location.href
    };
    if (navigator.share) {
      try { await navigator.share(data); }
      catch (e) { alert('Gagal membagikan: ' + (e.message || e)); }
    } else {
      try {
        await navigator.clipboard.writeText(`${data.title}\n${data.url}`);
        alert('Link disalin ke clipboard');
      } catch {
        prompt('Salin link ini:', location.href);
      }
    }
  });

  // NEW: entry animations & small UI touches
  setTimeout(() => {
    document.querySelectorAll('.site-header, .news-article').forEach(el => el.classList.add('is-visible'));
    document.querySelector('.dot')?.classList.add('pulse');
  }, 120);

  // subtle reveal for paragraphs (stagger)
  document.querySelectorAll('.news-article p, .features-grid li, blockquote').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => {
      el.style.transition = 'opacity .45s ease, transform .45s ease';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 260 + i * 70);
  });
});