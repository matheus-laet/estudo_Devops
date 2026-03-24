/* ================================================
   DataPulse Dashboard — main.js
   ================================================ */

// ---------- DATA ATUAL NO TOPBAR ----------
(function setDate() {
  const el = document.getElementById('currentDate');
  if (!el) return;
  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  el.textContent = now.toLocaleDateString('pt-BR', opts);
})();

// ---------- SIDEBAR TOGGLE (mobile) ----------
const sidebar    = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Fecha sidebar ao clicar fora (mobile)
  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      sidebar.classList.remove('open');
    }
  });
}

// ---------- NAVEGAÇÃO ----------
const navItems  = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('pageTitle');

const pageNames = {
  overview:  'Visão Geral',
  analytics: 'Análises',
  services:  'Serviços',
  reports:   'Relatórios',
  settings:  'Configurações',
};

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((n) => n.classList.remove('active'));
    item.classList.add('active');

    const page = item.dataset.page;
    if (pageTitle && pageNames[page]) {
      pageTitle.textContent = pageNames[page];
    }

    // Fecha sidebar no mobile após navegar
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
    }
  });
});

// ---------- CONTADOR ANIMADO (KPI values) ----------
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400; // ms
  const start = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const value = Math.round(ease * target);
    el.textContent = prefix + value.toLocaleString('pt-BR') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Dispara quando o card entrar na viewport
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el);
        observer.unobserve(el);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.kpi-card__value[data-target]').forEach((el) => {
  observer.observe(el);
});

// ---------- CHART TABS ----------
document.querySelectorAll('.chart-tabs').forEach((tabGroup) => {
  const tabs = tabGroup.querySelectorAll('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      // Aqui você pode trocar os dados do chart conforme o período selecionado
    });
  });
});

// ---------- TOOLTIP SIMPLES NOS SERVICE CARDS ----------
document.querySelectorAll('.service-card').forEach((card) => {
  card.addEventListener('mouseenter', function () {
    this.style.borderColor = 'rgba(255,255,255,0.12)';
  });
  card.addEventListener('mouseleave', function () {
    this.style.borderColor = '';
  });
});

// ---------- ATUALIZA "ÚLTIMO PING" A CADA 30S ----------
(function liveUptime() {
  const offlineCards = document.querySelectorAll('.service-badge--error');
  let minutes = 14;

  setInterval(() => {
    minutes++;
    offlineCards.forEach((badge) => {
      const card = badge.closest('.service-card');
      if (!card) return;
      const pingEl = card.querySelector('p strong');
      if (pingEl && pingEl.textContent.includes('min')) {
        pingEl.textContent = `${minutes}min atrás`;
      }
    });
  }, 30000);
})();
