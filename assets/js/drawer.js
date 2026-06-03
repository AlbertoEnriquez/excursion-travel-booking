/* ============================================================
   Mobile Drawer Menu — auto-inyectado en cualquier página
   Detecta el contexto:
   - Si hay un <button class="hburger"> en el header (Home), ese lo abre.
   - Si .hburger es un <a> (subpáginas con back arrow), inyecta un trigger
     a la derecha en .hdr-actions (mobile-only por CSS).
   ============================================================ */
(function(){
  if (window.__DRAWER_INIT__) return;
  window.__DRAWER_INIT__ = true;

  /* Modo dev: muestra herramientas internas (proto-nav, skel-toggle) solo
     cuando la URL incluye ?dev=1. Para clientes (Valeria) → vista limpia. */
  const isDev = new URLSearchParams(location.search).get('dev') === '1';
  if (isDev) {
    document.body.classList.add('dev-mode');
    // Preservar ?dev=1 al navegar entre páginas internas del proto
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.proto-nav a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && !href.startsWith('http') && !href.includes('?')) {
          a.setAttribute('href', href + '?dev=1');
        }
      });
    });
  }

  // Detectar página actual para marcar el link activo
  const PAGE = (location.pathname.split('/').pop() || 'index.html');

  const isActive = (href) => href === PAGE ? ' on' : '';

  const DRAWER_HTML = `
    <div class="drawer" id="mobileDrawer" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
      <div class="drawer-backdrop" data-close></div>
      <aside class="drawer-panel">

        <div class="drawer-head">
          <div class="logo">
            <img src="assets/aloft-logo.png" alt="Aloft Cancún" id="drawerTitle" />
          </div>
          <button class="drawer-close" data-close aria-label="Cerrar menú">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="drawer-section">
          <a href="my-reservation.html" class="drawer-cta">📋 Consultar mi reserva</a>
        </div>

        <div class="drawer-section">
          <span class="lbl">Navegación</span>
          <a href="index.html" class="drawer-link${isActive('index.html')}"><span class="ic">🚗</span>Reservar transporte</a>
          <a href="my-reservation.html" class="drawer-link${isActive('my-reservation.html')}"><span class="ic">📋</span>Mi reserva</a>
          <a href="billing.html" class="drawer-link${isActive('billing.html')}"><span class="ic">🧾</span>Facturación CFDI</a>
          <a href="index.html#why" class="drawer-link"><span class="ic">⭐</span>¿Por qué nosotros?</a>
        </div>

        <div class="drawer-section">
          <span class="lbl">🌐 Idioma</span>
          <div class="drawer-toggle-row" data-toggle-group>
            <button type="button" class="drawer-toggle on">🇪🇸 Español</button>
            <button type="button" class="drawer-toggle">🇬🇧 English</button>
          </div>
        </div>

        <div class="drawer-section">
          <span class="lbl">💱 Moneda</span>
          <div class="drawer-toggle-row" data-toggle-group>
            <button type="button" class="drawer-toggle on">MXN $</button>
            <button type="button" class="drawer-toggle">USD $</button>
          </div>
        </div>

        <div class="drawer-section">
          <span class="lbl">¿Necesitas ayuda?</span>
          <a href="tel:+17867236220" class="drawer-link"><span class="ic">📞</span>+1 786 723 6220</a>
          <a href="https://wa.me/17867236220" class="drawer-link"><span class="ic">💬</span>WhatsApp</a>
          <a href="mailto:ebookings@aloftcancun.com" class="drawer-link"><span class="ic">✉️</span>Email</a>
        </div>

        <div class="drawer-section drawer-legal">
          <a href="terms.html">Términos</a> · <a href="privacy.html">Privacidad</a><br/>
          <span style="margin-top:8px;display:inline-block">© 2026 Aloft Cancún · Operado por Excursion Travel</span>
        </div>
      </aside>
    </div>
  `;

  // Inyectar drawer al body
  document.body.insertAdjacentHTML('beforeend', DRAWER_HTML);
  const drawer = document.getElementById('mobileDrawer');

  // API open/close
  let prevOverflow = '';
  const open = () => {
    drawer.classList.add('open');
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = prevOverflow;
  };

  // Wire close handlers
  drawer.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });

  // Detect button hamburger on home page (left side menu)
  const leftMenuBtn = document.querySelector('header.hdr button.hburger');
  if (leftMenuBtn) {
    leftMenuBtn.addEventListener('click', e => { e.preventDefault(); open(); });
  } else {
    // On subpages: left is a back arrow link, inject menu trigger to the right
    const actions = document.querySelector('header.hdr .hdr-actions');
    if (actions) {
      const trigger = document.createElement('button');
      trigger.className = 'menu-trigger';
      trigger.setAttribute('aria-label', 'Abrir menú');
      trigger.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
      trigger.addEventListener('click', open);
      actions.appendChild(trigger);
    }
  }

  // Toggle groups (idioma / moneda)
  drawer.querySelectorAll('[data-toggle-group]').forEach(group => {
    group.querySelectorAll('.drawer-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.drawer-toggle').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
      });
    });
  });
})();
