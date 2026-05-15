async function loadAppsCatalog() {
  const root = document.getElementById('apps-catalog-root');
  if (!root) return;

  root.innerHTML = '<div style="color:var(--text-dim);padding:24px 0">Loading apps…</div>';

  try {
    const res = await fetch('static/data/apps.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const categories = Array.isArray(data.categories) ? data.categories : [];

    root.innerHTML = categories.map(renderCategory).join('');
  } catch (err) {
    console.error('Failed to load apps catalog', err);
    root.innerHTML = '<div style="color:#fca5a5;padding:24px 0">Failed to load app catalog.</div>';
  }
}

function renderCategory(category) {
  const apps = Array.isArray(category.apps) ? category.apps : [];
  return `
    <div class="cat-label">${escapeHtml(category.label || '')}</div>
    <div class="app-grid">
      ${apps.map(renderAppCard).join('')}
    </div>
  `;
}

function renderAppCard(app) {
  const links = Array.isArray(app.links) ? app.links : [];
  const title = `${escapeHtml(app.name || '')}${app.badgeNew ? ' <span class="badge-new">New</span>' : ''}${app.hibernated ? ' <span class="badge-new" style="background:#374151;color:#d1d5db">Hibernate</span>' : ''}`;
  const actions = links.length > 1
    ? `<div class="btn-row">${links.map(renderLinkButton).join('')}</div>`
    : `${links.map(renderLinkButton).join('')}`;

  return `
    <div class="app-card">
      <div class="app-card-image"><img src="${escapeAttr(app.image || '')}" alt="${escapeAttr(app.name || '')}" loading="lazy"></div>
      <div class="app-card-body">
        <h3>${title}</h3>
        <p>${escapeHtml(app.description || '')}</p>
        ${actions}
      </div>
    </div>
  `;
}

function renderLinkButton(link) {
  const url = link.url || '#';
  const label = escapeHtml(link.label || 'Open');
  const isExternal = /^https?:\/\//.test(url);
  if (isExternal) {
    return `<a href="#" onclick="event.preventDefault(); navigateToApp('${escapeJs(url)}')" class="btn">${label}</a>`;
  }
  return `<a href="${escapeAttr(url)}" class="btn">${label}</a>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function escapeJs(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

document.addEventListener('DOMContentLoaded', loadAppsCatalog);
