"use client";
import { useState, useRef } from "react";
import "./abi-team.css";

// ─── Types ───────────────────────────────────────────────────────────────────
type Stage = "Problem statement"|"Problem Discovery"|"Solution design"|"Development"|"Testing"|"Deployment"|"Users feedback";
type Dept = "Cybersecurity"|"DevOps"|"Frontend Platform"|"Data Engineering"|"ML/AI"|"Backend Services";
type Role = "Manager"|"Contributor";

interface MeetingLog { timestamp: string; synopsis: string; }
interface AttFile { name: string; size: string; icon: string; }
interface Ticket {
  id: string; problem: string; dept: Dept; status: Stage;
  assignedTo: string; publish: boolean;
  projectName: string; projectDesc: string; projectType: string;
  meetings: MeetingLog[]; files: AttFile[]; saved: boolean;
  upvotes: number; upvotedByMe: boolean;
}
interface User { name: string; role: Role; }
interface Cred { id: string; name: string; role: string; token: string; }

// ─── Constants ───────────────────────────────────────────────────────────────
const STAGES: Stage[] = ["Problem statement","Problem Discovery","Solution design","Development","Testing","Deployment","Users feedback"];
const DEPTS: Dept[] = ["Cybersecurity","DevOps","Frontend Platform","Data Engineering","ML/AI","Backend Services"];
const MEMBERS = ["Alex Rivera","Zoe Rutherford","Marcus Chen","Priya Patel","Jordan Kim","Sam Torres","Dana Lee","Chris Morgan"];
const TYPES = ["Automation","Business Intelligence","Web App","API Service","Data Pipeline","ML Model"];
const PAGE_SIZE = 7;

function statusBadgeClass(s: Stage) {
  if (s === "Deployment" || s === "Users feedback") return "badge badge-green";
  if (s === "Development" || s === "Testing") return "badge badge-blue";
  if (s === "Solution design") return "badge badge-yellow";
  return "badge badge-gray";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PROBLEMS: [string, Dept][] = [
  ["CI/CD build times exceeded 45 minutes on main branch", "DevOps"],
  ["API auth tokens not rotating on the scheduled 24h cycle", "Cybersecurity"],
  ["Frontend bundle size exceeded the 8 MB performance threshold", "Frontend Platform"],
  ["Data pipeline latency surpassed the 30-second SLA", "Data Engineering"],
  ["ML model drift detected in the production scoring engine", "ML/AI"],
  ["DB connection pool exhaustion occurring under peak load", "Backend Services"],
  ["Log ingestion pipeline dropping 12% of security events", "Cybersecurity"],
  ["Container orchestration failures during node autoscaling", "DevOps"],
  ["Accessibility audit score fell below WCAG 2.1 AA threshold", "Frontend Platform"],
  ["Real-time feature store sync delays exceeding 5 minutes", "Data Engineering"],
  ["NLP classification accuracy dropped from 94% to 87%", "ML/AI"],
  ["gRPC service discovery failing after Kubernetes upgrades", "Backend Services"],
  ["Penetration test revealed SSRF vulnerability in API gateway", "Cybersecurity"],
  ["Deployment rollback procedures taking over 20 minutes", "DevOps"],
  ["Component library missing dark mode token support", "Frontend Platform"],
  ["ETL job failures causing stale reporting data", "Data Engineering"],
  ["Recommendation engine cold-start problem for new users", "ML/AI"],
  ["Rate limiting not enforced consistently across microservices", "Backend Services"],
  ["SSL certificate auto-renewal failing silently in prod", "Cybersecurity"],
  ["Kubernetes HPA misconfiguration causing over-provisioning", "DevOps"],
  ["Search indexing latency degrading user search experience", "Frontend Platform"],
  ["Data lineage tracking missing for 30% of production tables", "Data Engineering"],
  ["Fraud detection model generating excessive false positives", "ML/AI"],
  ["Cache invalidation race condition causing stale data reads", "Backend Services"],
  ["MFA enrollment rate below 60% for privileged accounts", "Cybersecurity"],
];

function makeTickets(): Ticket[] {
  return PROBLEMS.map(([problem, dept], i) => {
    const id = `ABI-${4400 + i + 1}`;
    const stage = STAGES[i % STAGES.length];
    const hasSaved = i < 5;
    return {
      id, problem, dept,
      status: stage,
      assignedTo: MEMBERS[i % MEMBERS.length],
      publish: i < 3,
      projectName: hasSaved ? `Project ${["Aurora","Nexus","Titan","Vega","Orion"][i] ?? id}` : "",
      projectDesc: hasSaved ? `Detailed approach and architecture for solving: ${problem.toLowerCase()}.` : "",
      projectType: TYPES[i % TYPES.length],
      meetings: hasSaved ? [
        { timestamp: "2026-05-28 09:15", synopsis: "Kickoff — scoped requirements and assigned owners." },
        { timestamp: "2026-05-30 14:00", synopsis: "Mid-sprint review — 60% complete, blockers cleared." },
      ] : [],
      files: hasSaved ? [{ name: "arch-diagram.pdf", size: "2.1 MB", icon: "📄" }] : [],
      saved: hasSaved,
      upvotes: hasSaved ? [42, 31, 18, 9, 5][i] : 0,
      upvotedByMe: false,
    };
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AuthModal({
  onLogin, onClose,
}: { onLogin: (u: User) => void; onClose: () => void; }) {
  const [credName, setCredName] = useState("");
  const [credRole, setCredRole] = useState<Role>("Contributor");
  const [creds, setCreds] = useState<Cred[]>([]);

  const genToken = () => `abi_key_${Math.random().toString(36).substr(2,6).toUpperCase()}`;

  const handleCreate = () => {
    if (!credName.trim()) return;
    setCreds(prev => [...prev, { id: Math.random().toString(), name: credName.trim(), role: credRole, token: genToken() }]);
    setCredName("");
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>✕</button>
        <div className="auth-title">Authentication Gateway</div>
        <div className="auth-sub">Select your sign-in method</div>

        <button className="auth-google" onClick={() => onLogin({ name: "Alex Rivera", role: "Manager" })}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google Sign-In (Manager)
        </button>
        <button className="auth-bypass" onClick={() => onLogin({ name: "Dev User", role: "Contributor" })}>
          Bypass → Contributor Access
        </button>

        <hr className="auth-divider" />
        <div style={{ fontWeight: 700, fontSize: ".78rem", marginBottom: ".6rem" }}>Generate Team Credentials</div>
        <div className="cred-form">
          <input className="cred-input" placeholder="Member Name" value={credName} onChange={e => setCredName(e.target.value)} />
          <select className="cred-role-select" value={credRole} onChange={e => setCredRole(e.target.value as Role)}>
            <option value="Contributor">Contributor</option>
            <option value="Manager">Manager</option>
          </select>
          <button className="cred-gen-btn" onClick={handleCreate}>Create Credentials</button>
        </div>
        {creds.length > 0 && (
          <div className="cred-list">
            {creds.map(c => (
              <div key={c.id} className="cred-item">
                <span>{c.name} · <span style={{ color: "#666" }}>{c.role}</span></span>
                <span className="cred-token">{c.token}</span>
                <button className="cred-del" onClick={() => setCreds(p => p.filter(x => x.id !== c.id))}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryModal({
  ticket, readOnly, onClose, onUpdate, onSave, onPublish,
}: {
  ticket: Ticket; readOnly: boolean;
  onClose: () => void;
  onUpdate: (id: string, field: keyof Ticket, value: unknown) => void;
  onSave: (id: string) => void;
  onPublish: (id: string) => void;
}) {
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const u = (field: keyof Ticket, val: unknown) => onUpdate(ticket.id, field, val);

  const addMeeting = () => {
    const ts = new Date().toLocaleString("en-GB", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" });
    u("meetings", [...ticket.meetings, { timestamp: ts, synopsis: "" }]);
  };

  const updateMtg = (idx: number, val: string) => {
    const m = [...ticket.meetings];
    m[idx] = { ...m[idx], synopsis: val };
    u("meetings", m);
  };

  const handleSave = () => {
    if (!ticket.projectName.trim() || !ticket.projectDesc.trim()) {
      setError("⚠ Both Project Name and Description are required to save.");
      return;
    }
    setError("");
    onSave(ticket.id);
  };

  const handlePublish = () => {
    if (!ticket.saved) {
      setError("⚠ Save the context first before publishing.");
      return;
    }
    setError("");
    onPublish(ticket.id);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const icons: Record<string, string> = { pdf: "📄", png: "🖼", jpg: "🖼", csv: "📊", xlsx: "📊", default: "📎" };
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "default";
    const size = f.size > 1048576 ? `${(f.size/1048576).toFixed(1)} MB` : `${(f.size/1024).toFixed(0)} KB`;
    u("files", [...ticket.files, { name: f.name, size, icon: icons[ext] ?? icons.default }]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Sidebar */}
        <div className="modal-sidebar">
          {STAGES.map(s => (
            <div key={s} className={`sidebar-stage${ticket.status === s ? " active" : ""}`}
              onClick={() => !readOnly && u("status", s)}>
              {s}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="modal-main">
          {/* Header */}
          <div className="modal-header-row">
            <span className="modal-ticket-id">{ticket.id}</span>
            <span className={statusBadgeClass(ticket.status) + " modal-status-badge"}>{ticket.status}</span>
            <span className="modal-dept-label">{ticket.dept}</span>
            {!readOnly && (
              <button className={`modal-pub-btn${ticket.publish ? " published" : ""}`} onClick={handlePublish}>
                {ticket.publish ? "✓ Published" : "Publish"}
              </button>
            )}
          </div>

          {error && <div className="error-banner">⚠ {error}</div>}

          {/* Project Name + Type */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Project name</label>
              <input className="form-input" placeholder="Project name"
                value={ticket.projectName} readOnly={readOnly}
                onChange={e => u("projectName", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" disabled={readOnly}
                value={ticket.projectType} onChange={e => u("projectType", e.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="form-group" style={{ marginBottom: "1.1rem" }}>
            <label className="form-label">Problem statement</label>
            <input className="form-input" value={ticket.problem} readOnly />
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: "1.1rem" }}>
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="Approach took for the problem"
              value={ticket.projectDesc} readOnly={readOnly}
              onChange={e => u("projectDesc", e.target.value)} />
          </div>

          {/* Meetings */}
          <div style={{ marginBottom: "1.1rem" }}>
            <div className="meetings-header">
              <span className="meetings-label">Meetings overview</span>
              {!readOnly && <button className="add-mtg-btn" onClick={addMeeting}>+</button>}
            </div>
            {ticket.meetings.map((m, i) => (
              <div key={i} className="meeting-block">
                <span className="mtg-ts">📅 {m.timestamp}</span>
                {readOnly
                  ? <span style={{ fontSize: ".78rem", color: "#555" }}>{m.synopsis || "—"}</span>
                  : <textarea className="mtg-input" value={m.synopsis} rows={1}
                      placeholder="Meeting notes…"
                      onChange={e => updateMtg(i, e.target.value)} />
                }
              </div>
            ))}
            {ticket.meetings.length === 0 && (
              <div style={{ color: "#aaa", fontSize: ".78rem", fontStyle: "italic" }}>No meetings logged yet.</div>
            )}
          </div>

          {/* Files */}
          {!readOnly && (
            <>
              <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFile} />
              <div className="file-zone" onClick={() => fileRef.current?.click()}>
                ⊕ Click to attach architecture diagrams, PDFs, or CSVs
              </div>
            </>
          )}
          {ticket.files.length > 0 && (
            <div className="files-grid">
              {ticket.files.map((f, i) => (
                <div key={i} className="file-chip">{f.icon} <span>{f.name}</span> <span style={{ color: "#aaa", marginLeft: "auto" }}>{f.size}</span></div>
              ))}
            </div>
          )}

          {/* Bottom */}
          {!readOnly && (
            <div className="modal-bottom">
              <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".78rem", cursor: "pointer", fontWeight: 700 }}
                onClick={() => fileRef.current?.click()}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#d1d5db", display: "inline-block" }} />
                Attach files
              </label>
              <button className="save-btn" onClick={handleSave}>
                {ticket.saved ? "✓ Context Saved" : "Save Context"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AbiTeamPage() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<"dashboard" | "showcase">("dashboard");
  const [tickets, setTickets] = useState<Ticket[]>(makeTickets);
  const [page, setPage] = useState(1);
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [showAuth, setShowAuth] = useState(false);
  const [summaryId, setSummaryId] = useState<string | null>(null);
  const [readOnly, setReadOnly] = useState(false);

  const update = (id: string, field: keyof Ticket, value: unknown) =>
    setTickets(p => p.map(t => t.id === id ? { ...t, [field]: value } : t));

  const handleSave = (id: string) =>
    setTickets(p => p.map(t => t.id === id ? { ...t, saved: true } : t));

  const handlePublishFromModal = (id: string) => {
    const t = tickets.find(x => x.id === id)!;
    if (!t.saved) return;
    update(id, "publish", !t.publish);
  };

  const handlePublishCard = (id: string) => {
    const t = tickets.find(x => x.id === id)!;
    if (!t.saved) {
      setSummaryId(id);
      setReadOnly(false);
      return;
    }
    update(id, "publish", !t.publish);
  };

  const handleUpvote = (id: string) => {
    setTickets(p => p.map(t => {
      if (t.id !== id) return t;
      const up = !t.upvotedByMe;
      return { ...t, upvotedByMe: up, upvotes: t.upvotes + (up ? 1 : -1) };
    }));
  };

  const openSummary = (id: string, ro: boolean) => { setSummaryId(id); setReadOnly(ro); };

  // Filtered + paginated tickets
  const filtered = tickets.filter(t => deptFilter === "All" || t.dept === deptFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageTickets = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Showcase tickets
  const showcaseTickets = [...tickets.filter(t => t.publish && t.saved)]
    .sort((a, b) => b.upvotes - a.upvotes);

  const publishedCount = tickets.filter(t => t.publish && t.saved).length;
  const summaryTicket = tickets.find(t => t.id === summaryId) ?? null;

  return (
    <div className="abi-root">
      {/* ── NAV ── */}
      <nav className="abi-nav">
        <div className="abi-nav-brand">ABI TEAM</div>

        <div className="abi-nav-center">
          <button className={`nav-tab${view === "dashboard" ? " active" : ""}`}
            onClick={() => setView("dashboard")}>Dashboard</button>
          <button className={`nav-tab${view === "showcase" ? " active" : ""}`}
            onClick={() => setView("showcase")}>
            Showcase
            {publishedCount > 0 && <span className="showcase-pill">{publishedCount}</span>}
          </button>
        </div>

        <div className="abi-nav-right">
          {user ? (
            <>
              <span className="nav-username">👤 {user.name} <span style={{ color: "#666", fontSize: ".72rem" }}>({user.role})</span></span>
              <button className="nav-logout" onClick={() => setUser(null)}>Log out</button>
            </>
          ) : (
            <button className="nav-login-btn" onClick={() => setShowAuth(true)}>LOGIN</button>
          )}
        </div>
      </nav>

      {/* ── AUTH MODAL ── */}
      {showAuth && (
        <AuthModal onLogin={u => { setUser(u); setShowAuth(false); }} onClose={() => setShowAuth(false)} />
      )}

      {/* ── SUMMARY MODAL ── */}
      {summaryTicket && (
        <SummaryModal
          ticket={summaryTicket}
          readOnly={readOnly}
          onClose={() => setSummaryId(null)}
          onUpdate={update}
          onSave={handleSave}
          onPublish={handlePublishFromModal}
        />
      )}

      {/* ── DASHBOARD VIEW ── */}
      {view === "dashboard" && (
        <div className="abi-main">
          <div className="page-label">Projects</div>

          {/* Filter bar */}
          <div className="filter-bar">
            <select className="dept-select" value={deptFilter}
              onChange={e => { setDeptFilter(e.target.value); setPage(1); }}>
              <option value="All">All Departments</option>
              {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Ticket cards */}
          {pageTickets.map(t => (
            <div key={t.id} className="ticket-card">
              <div className="ticket-card-row">
                {/* Left */}
                <div className="ticket-left">
                  <div className="ticket-problem">{t.problem}</div>
                  <div>
                    <span className="ticket-assigned-label">Assigned to &nbsp;</span>
                    <select className="assigned-dropdown" value={t.assignedTo}
                      onChange={e => update(t.id, "assignedTo", e.target.value)}>
                      {MEMBERS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                {/* Center — Summary/Details button */}
                <div className="ticket-center">
                  <button className={`summary-btn${t.saved ? " saved" : ""}`}
                    onClick={() => openSummary(t.id, false)}>
                    {t.saved ? "Summary [Saved]" : "Summary"} <span className="toggle-chevron">↗</span>
                  </button>
                </div>

                {/* Right */}
                <div className="ticket-right">
                  <div className="ticket-meta-top">
                    <span className="ticket-dept">{t.dept}</span>
                    <span className="ticket-id-val">{t.id}</span>
                  </div>
                  <div className="ticket-meta-bottom">
                    <select className="status-select-inline" value={t.status}
                      onChange={e => update(t.id, "status", e.target.value as Stage)}>
                      {STAGES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button className={`publish-btn${t.publish ? " published" : ""}`}
                      onClick={() => handlePublishCard(t.id)}>
                      {t.publish ? "✓ Published" : "Publish"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {pageTickets.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#888", fontWeight: 700 }}>
              No tickets for this department.
            </div>
          )}

          {/* Pagination */}
          <div className="pagination-row">
            <span className="page-label-text">Page No</span>
            <button className="page-nav" onClick={() => setPage(p => Math.max(1, p - 1))}>{"<"}</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n, idx, arr) => (
              <span key={n}>
                <span className={`page-num${page === n ? " active" : ""}`} onClick={() => setPage(n)}>{n}</span>
                {idx < arr.length - 1 && <span style={{ color: "#888" }}>,</span>}
              </span>
            ))}
            <button className="page-nav" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>{">"}</button>
          </div>
        </div>
      )}

      {/* ── SHOWCASE VIEW ── */}
      {view === "showcase" && (
        <div className="showcase-main">
          <div className="showcase-title">🚀 Live Deployments — Leaderboard</div>
          {showcaseTickets.length === 0 ? (
            <div className="sc-empty">
              No published projects yet.<br />
              <span style={{ fontSize: ".78rem", fontWeight: 400 }}>Go to Dashboard → fill a Summary → hit Publish.</span>
            </div>
          ) : (
            showcaseTickets.map(t => (
              <div key={t.id} className="showcase-card" onClick={() => { setReadOnly(true); setSummaryId(t.id); }}>
                <div className="sc-avatar">{t.id}</div>
                <div className="sc-body">
                  <div className="sc-name">{t.projectName}</div>
                  <div className="sc-desc">{t.projectDesc}</div>
                  <div className="sc-meta">
                    <span>🏢 {t.dept}</span>
                    <span>👤 {t.assignedTo}</span>
                    <span>📅 {t.meetings.length} sync{t.meetings.length !== 1 ? "s" : ""}</span>
                    <span className={statusBadgeClass(t.status) + " badge"}>{t.status}</span>
                  </div>
                </div>
                <div className="sc-right" onClick={e => e.stopPropagation()}>
                  <button className={`upvote-btn${t.upvotedByMe ? " upvoted" : ""}`}
                    onClick={() => handleUpvote(t.id)}>
                    <span className="upvote-triangle">▲</span>
                    <span className="upvote-count">{t.upvotes}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
