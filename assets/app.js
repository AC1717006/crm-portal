
// ============================================================
// CRM PORTAL — app.js (Global utilities, auth, data helpers)
// ============================================================

const KEYS = {
  users: 'crm_users',
  leads: 'crm_leads',
  callLogs: 'crm_calllogs',
  followUps: 'crm_followups',
  billing: 'crm_billing',
  session: 'crm_session',
};

const ROLES = { admin: 'Admin', crm: 'CRM Executive', tl: 'Team Leader', accounts: 'Accounts Team' };

// ---- Utilities ----
const uid = () => 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
const now = () => new Date().toISOString();
const fmt = (iso) => iso ? new Date(iso).toLocaleString() : '—';
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString() : '—';

function getData(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function setData(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function getObj(key) {
  try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
}

// ---- Auth ----
function getSession() { return getObj(KEYS.session); }
function setSession(user) { localStorage.setItem(KEYS.session, JSON.stringify(user)); }
function clearSession() { localStorage.removeItem(KEYS.session); }
function requireAuth(allowedRoles) {
  const s = getSession();
  if (!s || !s.username) { window.location.href = rootPath() + 'index.html'; return null; }
  if (allowedRoles && !allowedRoles.includes(s.role)) {
    showToast('Access denied for your role.', 'error');
    setTimeout(() => window.location.href = rootPath() + 'index.html', 1200);
    return null;
  }
  return s;
}
function rootPath() {
  const href = window.location.href;
  const p = window.location.pathname;

  // file:// protocol — use relative paths based on depth inside crm-portal
  if (href.startsWith('file://')) {
    const afterCrm = p.split('/crm-portal/')[1] || '';
    const subDepth = afterCrm.split('/').filter(Boolean).length - 1;
    return subDepth > 0 ? '../'.repeat(subDepth) : './';
  }

  // http(s):// with /crm-portal/ subfolder (e.g. npx live-server from parent dir)
  if (p.includes('/crm-portal/')) {
    return '/crm-portal/';
  }

  // http(s):// served from within crm-portal dir (VS Code Live Server default)
  return '/';
}
function logout() { clearSession(); window.location.href = rootPath() + 'index.html'; }

// ---- Seed Data ----
const DEFAULT_USERS = [
  { id: 'u1', username: 'admin',    password: 'admin123', role: 'admin',    name: 'Super Admin',   email: 'admin@crm.com' },
  { id: 'u2', username: 'crm1',     password: 'crm123',   role: 'crm',      name: 'Ravi Kumar',    email: 'ravi@crm.com' },
  { id: 'u3', username: 'crm2',     password: 'crm123',   role: 'crm',      name: 'Priya Singh',   email: 'priya@crm.com' },
  { id: 'u4', username: 'tl1',      password: 'tl123',    role: 'tl',       name: 'Ankit Sharma',  email: 'ankit@crm.com' },
  { id: 'u5', username: 'accounts1',password: 'acc123',   role: 'accounts', name: 'Neha Joshi',    email: 'neha@crm.com' },
];

const DEMO_LEADS = [
  { id: uid(), createdAt: new Date(Date.now()-6*864e5).toISOString(), source:'Meta Ads', status:'New', assigneeName:'Ravi Kumar', assigneeEmail:'ravi@crm.com', name:'Sunita Mehta', phone:'9876543210', email:'sunita@gmail.com', altPhone:'', city:'Mumbai', dataCity:'Mumbai', designation:'Manager', agencyName:'TravelPro', assigned:true, remark:'Interested in Goa package', callLogs:[], followUps:[], billing:{} },
  { id: uid(), createdAt: new Date(Date.now()-5*864e5).toISOString(), source:'Meta Ads', status:'Follow-up', assigneeName:'Ravi Kumar', assigneeEmail:'ravi@crm.com', name:'Arjun Patel', phone:'9988776655', email:'arjun@gmail.com', altPhone:'9876500001', city:'Ahmedabad', dataCity:'Ahmedabad', designation:'Director', agencyName:'JourneyHub', assigned:true, remark:'Wants Rajasthan tour', callLogs:[], followUps:[{scheduledDate: new Date(Date.now()+864e5).toISOString().slice(0,10), scheduledTime:'10:00', note:'Discuss package pricing', completedAt:null, result:null}], billing:{} },
  { id: uid(), createdAt: new Date(Date.now()-4*864e5).toISOString(), source:'Manual', status:'Converted/Sold', assigneeName:'Priya Singh', assigneeEmail:'priya@crm.com', name:'Kavita Rao', phone:'8765432109', email:'kavita@gmail.com', altPhone:'', city:'Bangalore', dataCity:'Bangalore', designation:'CEO', agencyName:'SkyWings', assigned:true, remark:'Booked Kerala package', callLogs:[], followUps:[], billing:{invoiceNo:'INV-001', amount:85000, paymentStatus:'Paid', paidOn:new Date(Date.now()-2*864e5).toISOString().slice(0,10), notes:'Full payment received'} },
  { id: uid(), createdAt: new Date(Date.now()-3*864e5).toISOString(), source:'Meta Ads', status:'Not Interested', assigneeName:'Ravi Kumar', assigneeEmail:'ravi@crm.com', name:'Deepak Verma', phone:'7654321098', email:'deepak@gmail.com', altPhone:'', city:'Delhi', dataCity:'Delhi', designation:'Owner', agencyName:'TourMate', assigned:true, remark:'Budget too high', callLogs:[], followUps:[], billing:{} },
  { id: uid(), createdAt: new Date(Date.now()-2*864e5).toISOString(), source:'Meta Ads', status:'Callback', assigneeName:'Priya Singh', assigneeEmail:'priya@crm.com', name:'Meera Nair', phone:'6543210987', email:'meera@gmail.com', altPhone:'6543210000', city:'Chennai', dataCity:'Chennai', designation:'Partner', agencyName:'WanderlustCo', assigned:true, remark:'Call back after 5pm', callLogs:[], followUps:[], billing:{} },
  { id: uid(), createdAt: new Date(Date.now()-864e5).toISOString(), source:'Manual', status:'No Response', assigneeName:'', assigneeEmail:'', name:'Rahul Gupta', phone:'5432109876', email:'rahul@gmail.com', altPhone:'', city:'Pune', dataCity:'Pune', designation:'Consultant', agencyName:'TripZone', assigned:false, remark:'', callLogs:[], followUps:[], billing:{} },
];

function seedIfNeeded() {
  if (!localStorage.getItem(KEYS.users)) setData(KEYS.users, DEFAULT_USERS);
  if (!localStorage.getItem(KEYS.leads)) setData(KEYS.leads, DEMO_LEADS);
}

// ---- Lead Helpers ----
function getLeads() { return getData(KEYS.leads); }
function saveLeads(leads) { setData(KEYS.leads, leads); }
function getLeadById(id) { return getLeads().find(l => l.id === id); }
function updateLead(updated) {
  const leads = getLeads();
  const idx = leads.findIndex(l => l.id === updated.id);
  if (idx !== -1) { leads[idx] = updated; saveLeads(leads); return true; }
  return false;
}
function addLead(lead) {
  const leads = getLeads();
  leads.unshift(lead);
  saveLeads(leads);
}

// ---- User Helpers ----
function getUsers() { return getData(KEYS.users); }
function saveUsers(u) { setData(KEYS.users, u); }
function getCRMUsers() { return getUsers().filter(u => u.role === 'crm'); }

// ---- Toast ----
function showToast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ---- Status/Badge helpers ----
const STATUS_COLORS = {
  'New': 'badge-blue', 'Interested': 'badge-teal', 'Follow-up': 'badge-yellow',
  'Not Interested': 'badge-red', 'Converted/Sold': 'badge-green',
  'Callback': 'badge-purple', 'No Response': 'badge-gray'
};
const CALL_STATUS_COLORS = {
  'Connected': 'badge-green', 'Not Connected': 'badge-red',
  'Busy': 'badge-yellow', 'No Answer': 'badge-gray', 'Callback': 'badge-purple'
};
function statusBadge(s) { return `<span class="badge ${STATUS_COLORS[s]||'badge-gray'}">${s||'—'}</span>`; }
function sourceBadge(s) { return `<span class="badge ${s==='Meta Ads'?'badge-pink':'badge-gray'}">${s||'—'}</span>`; }
function callBadge(s) { return `<span class="badge ${CALL_STATUS_COLORS[s]||'badge-gray'}">${s||'—'}</span>`; }
function payBadge(s) {
  const c = {Paid:'badge-green',Partial:'badge-yellow',Pending:'badge-blue',Overdue:'badge-red'};
  return `<span class="badge ${c[s]||'badge-gray'}">${s||'—'}</span>`;
}

// ---- Navbar Inject ----
function injectNavbar() {
  const s = getSession();
  const nav = document.getElementById('topnav');
  if (!nav || !s) return;
  nav.innerHTML = `
    <div class="nav-brand"><span class="nav-icon">✈</span> TravelCRM</div>
    <div class="nav-right">
      <span class="role-badge">${ROLES[s.role]||s.role}</span>
      <span class="nav-user">👤 ${s.name}</span>
      <button class="btn-logout" onclick="logout()">Logout</button>
    </div>`;
}

// ---- Sidebar Inject ----
function injectSidebar() {
  const s = getSession();
  const sb = document.getElementById('sidebar');
  if (!sb || !s) return;
  const r = s.role;
  const links = [];
  const rp = rootPath();
  if (r === 'admin') {
    links.push(['🏠','Dashboard', rp+'admin/index.html'],
               ['👥','Users', rp+'admin/users.html'],
               ['📊','Reports', rp+'admin/reports.html'],
               ['📋','All Leads', rp+'leads/index.html'],
               ['➕','Add Lead', rp+'leads/add.html'],
               ['📅','Follow-ups', rp+'followups/index.html']);
  } else if (r === 'crm') {
    links.push(['📋','My Leads', rp+'leads/index.html'],
               ['➕','Add Lead', rp+'leads/add.html'],
               ['📞','Calling', rp+'calling/index.html'],
               ['📅','Follow-ups', rp+'followups/index.html']);
  } else if (r === 'tl') {
    links.push(['📋','All Leads', rp+'leads/index.html'],
               ['➕','Add Lead', rp+'leads/add.html'],
               ['📅','Follow-ups', rp+'followups/index.html'],
               ['📊','Reports', rp+'admin/reports.html']);
  } else if (r === 'accounts') {
    links.push(['💰','Billing', rp+'billing/index.html'],
               ['🧾','Payments', rp+'billing/payments.html'],
               ['📋','Leads', rp+'leads/index.html']);
  }
  const cur = window.location.href;
  sb.innerHTML = links.map(([icon, label, href]) =>
    `<a href="${href}" class="sidebar-link ${cur.includes(href)?'active':''}">
      <span class="si">${icon}</span><span class="sl">${label}</span>
    </a>`).join('');
}

// ---- CSV Export ----
function exportCSV(data, filename) {
  if (!data.length) return showToast('No data to export', 'error');
  const keys = Object.keys(data[0]);
  const rows = [keys.join(','), ...data.map(r => keys.map(k => `"${String(r[k]||'').replace(/"/g,'""')}"`).join(','))];
  const blob = new Blob([rows.join('\n')], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ---- Modal helpers ----
function openModal(id) { const m = document.getElementById(id); if(m) m.style.display='flex'; }
function closeModal(id) { const m = document.getElementById(id); if(m) m.style.display='none'; }

window.addEventListener('DOMContentLoaded', () => {
  seedIfNeeded();
  injectNavbar();
  injectSidebar();
});
