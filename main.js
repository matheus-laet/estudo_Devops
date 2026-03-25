/* ================================================
   DataPulse Dashboard — main.js
   ================================================ */

const SERVICES = [
  { id: 'api-gateway', name: 'API Gateway', desc: 'Kong / Nginx proxy', icon: '🖥️', color: '#00f5a0', status: 'online', latency: 42, uptime: 99.9, load: 64, requests: '18.4k/min', errors: '0.01%', memory: '1.2 GB', cpu: '18%', lastCheck: 'agora', logs: [{ time: '14:32:01', level: 'ok', msg: 'Health check OK — 200ms' },{ time: '14:31:01', level: 'ok', msg: 'Health check OK — 198ms' },{ time: '14:29:01', level: 'warn', msg: 'Rate limit atingido — IP 10.0.0.14' }] },
  { id: 'database', name: 'Banco de Dados', desc: 'PostgreSQL 15 cluster', icon: '🗄️', color: '#7c6fff', status: 'online', latency: 8, uptime: 99.7, load: 78, requests: '1.240/s', errors: '0.00%', memory: '8.4 GB', cpu: '34%', lastCheck: '2s atrás', logs: [{ time: '14:32:00', level: 'ok', msg: 'Replication lag: 0ms' },{ time: '14:30:00', level: 'warn', msg: 'Conexões: 198/200 (99%)' },{ time: '14:29:00', level: 'ok', msg: 'Vacuum executado com sucesso' }] },
  { id: 'cdn', name: 'CDN / Storage', desc: 'S3 + CloudFront', icon: '☁️', color: '#ffd93d', status: 'warning', latency: 210, uptime: 98.4, load: 73, requests: '4.2k/min', errors: '1.2%', memory: '—', cpu: '—', lastCheck: '5s atrás', logs: [{ time: '14:32:05', level: 'warn', msg: 'Storage: 73% do limite atingido' },{ time: '14:28:05', level: 'ok', msg: 'Cache hit ratio: 91%' },{ time: '14:25:05', level: 'err', msg: 'Timeout em us-east-1 — 503' }] },
  { id: 'auth', name: 'Auth Service', desc: 'Keycloak / JWT', icon: '🔐', color: '#ff6b6b', status: 'online', latency: 35, uptime: 100, load: 45, requests: '3.891/h', errors: '0.00%', memory: '512 MB', cpu: '12%', lastCheck: '1s atrás', logs: [{ time: '14:32:10', level: 'ok', msg: 'Token issued — user@empresa.com' },{ time: '14:31:20', level: 'ok', msg: 'Health check OK' },{ time: '14:30:10', level: 'ok', msg: 'Certificado SSL válido até 2025-12-01' }] },
  { id: 'queue', name: 'Message Queue', desc: 'RabbitMQ 3.12', icon: '📨', color: '#00c9ff', status: 'online', latency: 5, uptime: 99.5, load: 12, requests: '320/s', errors: '0.00%', memory: '256 MB', cpu: '6%', lastCheck: '3s atrás', logs: [{ time: '14:32:08', level: 'ok', msg: 'Queue: 18 msgs pendentes' },{ time: '14:31:08', level: 'ok', msg: 'Consumer acknowledged 142 msgs' }] },
  { id: 'log-aggregator', name: 'Log Aggregator', desc: 'Elasticsearch + Kibana', icon: '📊', color: '#ff6b6b', status: 'offline', latency: null, uptime: 87.2, load: 0, requests: '—', errors: '100%', memory: '—', cpu: '—', lastCheck: '14min atrás', logs: [{ time: '14:18:00', level: 'err', msg: 'Connection refused — porta 9200' },{ time: '14:17:00', level: 'err', msg: 'Health check FAILED — timeout 30s' },{ time: '14:15:00', level: 'err', msg: 'OOM Killed — container reiniciando' },{ time: '14:14:00', level: 'warn', msg: 'Disk I/O latency: 850ms (crítico)' }] },
  { id: 'monitoring', name: 'Monitoring', desc: 'Prometheus + Grafana', icon: '📡', color: '#ff9f43', status: 'online', latency: 22, uptime: 99.8, load: 28, requests: '210/s', errors: '0.00%', memory: '768 MB', cpu: '9%', lastCheck: 'agora', logs: [{ time: '14:32:00', level: 'ok', msg: 'Scrape concluído — 47 targets' },{ time: '14:31:00', level: 'ok', msg: 'Alertmanager: 1 alerta ativo (CDN)' }] },
];

// DATA ATUAL
(function() {
  var el = document.getElementById('currentDate');
  if (el) el.textContent = new Date().toLocaleDateString('pt-BR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
})();

// SIDEBAR TOGGLE
var sidebar = document.getElementById('sidebar');
var menuToggle = document.getElementById('menuToggle');
if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', function() { sidebar.classList.toggle('open'); });
  document.addEventListener('click', function(e) {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !menuToggle.contains(e.target))
      sidebar.classList.remove('open');
  });
}

// NAVEGAÇÃO
var pageNames = { overview:'Visão Geral', analytics:'Análises', services:'Serviços', reports:'Relatórios', settings:'Configurações' };
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  var page = document.getElementById('page-' + pageId);
  var nav  = document.querySelector('.nav-item[data-page="' + pageId + '"]');
  if (page) page.classList.add('active');
  if (nav)  nav.classList.add('active');
  var t = document.getElementById('pageTitle');
  if (t) t.textContent = pageNames[pageId] || '';
  if (window.innerWidth <= 768) sidebar.classList.remove('open');
}
document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function() { navigateTo(item.dataset.page); });
});
var goToServices = document.getElementById('goToServices');
if (goToServices) goToServices.addEventListener('click', function(e) { e.preventDefault(); navigateTo('services'); });

// CONTADOR ANIMADO
function animateCounter(el) {
  var target = parseInt(el.dataset.target, 10);
  var prefix = el.dataset.prefix || '';
  var suffix = el.dataset.suffix || '';
  var start = performance.now();
  function update(now) {
    var p = Math.min((now - start) / 1400, 1);
    var ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
    el.textContent = prefix + Math.round(ease * target).toLocaleString('pt-BR') + suffix;
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
}, { threshold: 0.3 });
document.querySelectorAll('.kpi-card__value[data-target]').forEach(function(el) { obs.observe(el); });

// CHART TABS
document.querySelectorAll('.chart-tabs').forEach(function(group) {
  group.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      group.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });
});

// HELPERS
function statusBadgeHTML(status) {
  var m = { online: ['service-badge--ok','Online'], warning: ['service-badge--warn','Atenção'], offline: ['service-badge--error','Offline'] };
  var r = m[status] || ['service-badge--ok', status];
  return '<span class="service-badge ' + r[0] + '">' + r[1] + '</span>';
}
function latencyClass(ms) { if (ms === null) return 'bad'; if (ms < 100) return 'good'; if (ms < 300) return 'ok'; return 'bad'; }
function loadColor(pct) { if (pct === 0) return '#ff6b6b'; if (pct < 60) return '#00f5a0'; if (pct < 80) return '#ffd93d'; return '#ff6b6b'; }

// TABELA
function renderTable(filter) {
  var tbody = document.getElementById('svcTableBody');
  if (!tbody) return;
  tbody.innerHTML = SERVICES.map(function(s, i) {
    var hidden = (filter !== 'all' && s.status !== filter) ? 'hidden' : '';
    return '<tr class="' + hidden + '" style="animation:fadeUp 0.3s ' + (i*0.04) + 's ease both;">'
      + '<td><div class="svc-name-cell"><div class="svc-tbl-icon" style="background:' + s.color + '18;">' + s.icon + '</div><div><div class="svc-tbl-name">' + s.name + '</div><div class="svc-tbl-desc">' + s.desc + '</div></div></div></td>'
      + '<td>' + statusBadgeHTML(s.status) + '</td>'
      + '<td><span class="svc-latency ' + latencyClass(s.latency) + '">' + (s.latency !== null ? s.latency + 'ms' : '—') + '</span></td>'
      + '<td><span class="svc-uptime-cell">' + s.uptime + '%</span></td>'
      + '<td><div class="svc-load-cell"><div class="svc-load-bar"><div class="svc-load-bar__fill" style="width:' + s.load + '%;background:' + loadColor(s.load) + ';"></div></div><div class="svc-load-label">' + s.load + '% utilizado</div></div></td>'
      + '<td><span class="svc-check-cell">' + s.lastCheck + '</span></td>'
      + '<td><button class="btn-svc-detail" data-id="' + s.id + '">Ver detalhes</button></td>'
      + '</tr>';
  }).join('');
  tbody.querySelectorAll('.btn-svc-detail').forEach(function(btn) {
    btn.addEventListener('click', function() { openModal(btn.dataset.id); });
  });
}

// CARDS DETALHADOS
function renderDetailCards(filter) {
  var grid = document.getElementById('svcDetailGrid');
  if (!grid) return;
  var list = filter === 'all' ? SERVICES : SERVICES.filter(function(s) { return s.status === filter; });
  grid.innerHTML = list.map(function(s, i) {
    return '<div class="svc-detail-card" data-id="' + s.id + '" style="animation-delay:' + (i*0.06) + 's;">'
      + '<div class="svc-detail-card__top"><div class="svc-detail-icon" style="background:' + s.color + '18;">' + s.icon + '</div>' + statusBadgeHTML(s.status) + '</div>'
      + '<h3>' + s.name + '</h3>'
      + '<div class="svc-detail-card__meta">' + s.desc + '</div>'
      + '<div class="svc-detail-stats">'
      + '<div class="svc-stat"><div class="svc-stat__label">Latência</div><div class="svc-stat__value" style="color:' + (s.latency !== null ? s.color : '#ff6b6b') + '">' + (s.latency !== null ? s.latency + 'ms' : '—') + '</div></div>'
      + '<div class="svc-stat"><div class="svc-stat__label">Uptime</div><div class="svc-stat__value">' + s.uptime + '%</div></div>'
      + '<div class="svc-stat"><div class="svc-stat__label">CPU</div><div class="svc-stat__value">' + s.cpu + '</div></div>'
      + '<div class="svc-stat"><div class="svc-stat__label">Memória</div><div class="svc-stat__value">' + s.memory + '</div></div>'
      + '</div></div>';
  }).join('');
  grid.querySelectorAll('.svc-detail-card').forEach(function(card) {
    card.addEventListener('click', function() { openModal(card.dataset.id); });
  });
}

// MODAL
var modal = document.getElementById('svcModal');
var modalClose = document.getElementById('modalClose');
function openModal(id) {
  var s = SERVICES.find(function(x) { return x.id === id; });
  if (!s || !modal) return;
  document.getElementById('modalTitle').textContent = s.name;
  document.getElementById('modalSubtitle').textContent = s.desc;
  var logLines = s.logs.map(function(l) {
    return '<div class="log-line"><span class="log-time">' + l.time + '</span><span class="log-' + l.level + '">' + l.level.toUpperCase() + '</span><span>' + l.msg + '</span></div>';
  }).join('');
  document.getElementById('modalBody').innerHTML =
    '<div class="modal-stat-grid">'
    + '<div class="modal-stat"><div class="modal-stat__label">Status</div><div class="modal-stat__value">' + statusBadgeHTML(s.status) + '</div></div>'
    + '<div class="modal-stat"><div class="modal-stat__label">Latência</div><div class="modal-stat__value" style="color:' + (s.latency !== null ? s.color : '#ff6b6b') + '">' + (s.latency !== null ? s.latency + 'ms' : '—') + '</div></div>'
    + '<div class="modal-stat"><div class="modal-stat__label">Uptime</div><div class="modal-stat__value">' + s.uptime + '%</div></div>'
    + '<div class="modal-stat"><div class="modal-stat__label">Requests</div><div class="modal-stat__value">' + s.requests + '</div></div>'
    + '<div class="modal-stat"><div class="modal-stat__label">Erros</div><div class="modal-stat__value" style="color:' + (s.errors === '0.00%' ? '#00f5a0' : '#ff6b6b') + '">' + s.errors + '</div></div>'
    + '<div class="modal-stat"><div class="modal-stat__label">Último Check</div><div class="modal-stat__value" style="font-size:0.8rem">' + s.lastCheck + '</div></div>'
    + '</div>'
    + '<div><div style="font-size:0.72rem;font-family:var(--font-mono);color:var(--text-muted);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.08em;">Logs recentes</div>'
    + '<div class="modal-log">' + logLines + '</div></div>';
  modal.classList.add('open');
}
function closeModal() { if (modal) modal.classList.remove('open'); }
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

// FILTROS
var currentFilter = 'all';
document.querySelectorAll('.svc-filter').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.svc-filter').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTable(currentFilter);
    renderDetailCards(currentFilter);
  });
});

// BOTÃO ATUALIZAR
var btnRefresh = document.getElementById('btnRefresh');
if (btnRefresh) {
  btnRefresh.addEventListener('click', function() {
    btnRefresh.classList.add('spinning');
    setTimeout(function() { btnRefresh.classList.remove('spinning'); }, 650);
    SERVICES.forEach(function(s) {
      if (s.status === 'online' && s.latency !== null)
        s.latency = Math.max(1, s.latency + Math.floor((Math.random() - 0.5) * 20));
    });
    renderTable(currentFilter);
    renderDetailCards(currentFilter);
  });
}

// PING OFFLINE
var offlineMinutes = 14;
setInterval(function() {
  offlineMinutes++;
  var offlineSvc = SERVICES.find(function(s) { return s.status === 'offline'; });
  if (offlineSvc) offlineSvc.lastCheck = offlineMinutes + 'min atrás';
  var pingEl = document.getElementById('offlinePing');
  if (pingEl) pingEl.textContent = offlineMinutes + 'min atrás';
}, 30000);

// INIT
renderTable('all');
renderDetailCards('all');
