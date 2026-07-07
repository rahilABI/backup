"use client";
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const SAMPLE_PROJECTS = [
    { ticket_id: '1', project_name: 'Alpha Node Integration', project_solution: 'Automated data pipelines across 5 business units using n8n workflows and advanced ETL processes for seamless data movement.', type: 'Automation', attachments: [{ type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600' }, { type: 'image/jpeg', data: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600' }, { type: 'application/pdf', name: 'docs.pdf', data: '' }] },
    { ticket_id: '2', project_name: 'Quantum BI Dashboard', project_solution: 'Real-time telemetry and KPI tracking dashboard built for executive strategic decision-making and performance monitoring.', type: 'Dashboards' },
    { ticket_id: '3', project_name: 'Employee Roster Portal', project_solution: 'Self-service portal for staff scheduling, time-off requests, and team performance tracking across departments.', type: 'Applications' },
    { ticket_id: '4', project_name: 'Secure Intake Forms', project_solution: 'End-to-end encrypted dynamic forms for client onboarding with automated CRM synchronization and validation.', type: 'Forms' },
    { ticket_id: '5', project_name: 'Global Load Balancer', project_solution: 'Distributed network traffic management system ensuring 99.99% uptime across all production applications.', type: 'Workflow' },
    { ticket_id: '6', project_name: 'System Architecture Docs', project_solution: 'Comprehensive internal documentation and interactive API references for the entire engineering organization.', type: 'Documentation' },
    { ticket_id: '7', project_name: 'Real-Time Sync Engine', project_solution: 'Bi-directional synchronization layer bridging legacy on-prem servers with cloud databases in real-time.', type: 'Workflow' },
    { ticket_id: '8', project_name: 'Zero-Trust Gateway', project_solution: 'Implementation of zero-trust architecture for internal tool access using advanced SSO and MFA protocols.', type: 'Applications' },
    { ticket_id: '9', project_name: 'Predictive Analytics Model', project_solution: 'Machine learning model deployed to predict quarterly resource bottlenecks and optimize capacity planning.', type: 'Data Insights' },
    { ticket_id: '10', project_name: 'Invoice Automation Suite', project_solution: 'Automated invoice generation, approval workflows, and payment reconciliation across 3 ERP systems.', type: 'Automation' },
    { ticket_id: '11', project_name: 'Client Feedback Loop', project_solution: 'Multi-channel feedback collection system with sentiment analysis and automated ticket routing to teams.', type: 'Forms' },
    { ticket_id: '12', project_name: 'DevOps Pipeline Monitor', project_solution: 'Centralized CI/CD monitoring dashboard with build health tracking and deployment analytics for all repos.', type: 'Dashboards' },
    { ticket_id: '13', project_name: 'Knowledge Base AI', project_solution: 'AI-powered internal knowledge base with semantic search and auto-categorization of technical documents.', type: 'Documentation' },
    { ticket_id: '14', project_name: 'Compliance Tracker', project_solution: 'Automated compliance monitoring and reporting system for SOC2, ISO 27001, and GDPR audit requirements.', type: 'Applications' },
    { ticket_id: '15', project_name: 'Revenue Attribution Engine', project_solution: 'Multi-touch attribution modeling platform connecting marketing spend to revenue outcomes across channels.', type: 'Data Insights' },
    { ticket_id: '16', project_name: 'Slack Command Center', project_solution: 'Custom Slack integration hub enabling team workflows, approvals, and status updates via slash commands.', type: 'Automation' },
    { ticket_id: '17', project_name: 'Corporate Website v3', project_solution: 'Complete redesign and rebuild of the corporate website with modern animations, CMS integration, and SEO.', type: 'Websites' },
    { ticket_id: '18', project_name: 'Interactive API Playground', project_solution: 'Developer-facing interactive API testing environment with auto-generated documentation and live examples.', type: 'Documentation' },
    { ticket_id: '19', project_name: 'Smart Notification Router', project_solution: 'Intelligent notification system that routes alerts based on urgency, role, and user preference settings.', type: 'Automation' },
    { ticket_id: '20', project_name: 'Executive War Room', project_solution: 'Real-time executive dashboard aggregating cross-departmental KPIs into a unified strategic command view.', type: 'Dashboards' },
    { ticket_id: '21', project_name: 'Vendor Onboarding Flow', project_solution: 'Streamlined vendor registration, verification, and contract management with automated compliance checks.', type: 'Forms' },
];

const getCategoryIcon = (type: string) => {
    switch(type?.toLowerCase()) {
        case 'websites':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
        case 'forms':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
        case 'dashboards':
        case 'data insights':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
        case 'automation':
        case 'workflow':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
        case 'applications':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
        case 'documentation':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
        default:
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
    }
};

const MetricText = ({ text, highlightColor }: { text: string, highlightColor: string }) => {
    if (!text) return null;
    const regex = /(\b\d+(?:,\d+)*(?:\.\d+)?\s*(?:%|x|s|hours?|minutes?|seconds?|days?|weeks?|months?)?\b|\bInstant(?:aneous)?\b|\bReal-time\b)/gi;
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) => {
                if (i % 2 === 1) {
                    return <strong key={i} style={{ color: highlightColor, fontWeight: '900' }}>{part}</strong>;
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
};

export default function ProjectsPage() {
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [page, setPage] = useState(1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const ITEMS_PER_PAGE = 7;
    const [typeOptions, setTypeOptions] = useState<string[]>(['All']);

    const [projects, setProjects] = useState<{ticket_id: string, project_name: string, project_solution: string, type: string, outcomes?: any[], custom_metrics?: any[], attachments?: any[], metrics?: any}[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        async function fetchProjects() {
            setLoading(true);
            try {
                // Fetch lookup table for mapping IDs to labels
                const { data: lokkerData, error: lokkerError } = await supabase.from('lokker').select('*');
                
                // Fetch published projects
                const { data: projectsData, error: projectsError } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('is_published', true)
                    .order('created_at', { ascending: false });

                const { data: attachmentsData } = await supabase.from('project_attachments').select('*');
                const { data: metricsData } = await supabase.from('project_metrics').select('*');

                if (projectsData && lokkerData && !projectsError && !lokkerError) {
                    const lokkerMap: Record<number, string> = {};
                    const types = new Set<string>();
                    lokkerData.forEach(l => {
                        lokkerMap[l.id] = l.label;
                        if (l.category === 'type') types.add(l.label);
                    });
                    
                    setTypeOptions(['All', ...Array.from(types)]);

                    const attMap: Record<string, any[]> = {};
                    if (attachmentsData) {
                        attachmentsData.forEach(att => {
                            if (!attMap[att.ticket_id]) attMap[att.ticket_id] = [];
                            attMap[att.ticket_id].push({
                                name: att.file_name,
                                dataUrl: att.data_url
                            });
                        });
                    }

                    const mapped = projectsData.map(p => {
                        const metric = metricsData?.find((m: any) => m.ticket_id === p.ticket_id);
                        return {
                            ticket_id: p.ticket_id,
                            project_name: p.project_name || 'Untitled Project',
                            project_solution: p.project_description || p.problem_statement || 'No description available.',
                            type: lokkerMap[p.type_looker_id] || 'Uncategorized',
                            outcomes: p.outcomes || [],
                            custom_metrics: p.custom_metrics || [],
                            attachments: attMap[p.ticket_id] || [],
                            metrics: metric || null
                        };
                    });

                    setProjects(mapped);
                } else {
                    console.error("Supabase fetch failed, falling back to sample data.", projectsError);
                    setProjects(SAMPLE_PROJECTS);
                }
            } catch (err) {
                console.error("Fetch exception:", err);
                setProjects(SAMPLE_PROJECTS);
            }
            setLoading(false);
        }
        fetchProjects();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Filter logic
    let displayed = projects.filter(t => {
        const matchesType = filter === 'All' ? true : t.type === filter;
        const matchesSearch = t.project_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const totalPages = Math.ceil(displayed.length / ITEMS_PER_PAGE) || 1;
    displayed = displayed.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="container" style={{ paddingTop: '140px', paddingBottom: '0', display: 'flex', justifyContent: 'center' }}>
            <div className="section visible text-protect" style={{ width: '100%', maxWidth: '1000px', minHeight: 'auto', padding: '0', marginBottom: '0', alignItems: 'flex-start' }}>
                
                {/* Filter & Search Bar */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                    {/* Search Input */}
                    <div style={{ flex: 1, maxWidth: '350px' }}>
                        <input 
                            type="text" 
                            placeholder="Search projects by name..." 
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="form-input"
                            style={{ margin: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                    </div>

                    {/* Type Dropdown - Top Right */}
                    <div className="wf-dropdown" ref={dropdownRef}>
                        <button 
                            className="wf-dropdown-btn"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            Type : <span className="wf-dropdown-value">{filter}</span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: '0.5rem' }}>
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className="wf-dropdown-menu">
                                {typeOptions.map(opt => (
                                    <button 
                                        key={opt}
                                        className={`wf-dropdown-item ${filter === opt ? 'active' : ''}`}
                                        onClick={() => { setFilter(opt); setDropdownOpen(false); setPage(1); }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Project Cards - Product Hunt Style */}
                <div className="ph-list" style={{ marginTop: '2rem' }}>
                    {loading ? (
                        <div className="ph-item" style={{ justifyContent: 'center', color: '#94a3b8', border: 'none' }}>
                            Loading projects from database...
                        </div>
                    ) : displayed.length === 0 ? (
                        <div className="ph-item" style={{ justifyContent: 'center', color: '#94a3b8', border: 'none' }}>
                            No published projects found matching your search.
                        </div>
                    ) : (
                        displayed.map((project, index) => {
                            const images = project.attachments ? project.attachments.filter((a: any) => a.dataUrl && a.dataUrl.startsWith('data:image/')) : [];
                            const hasImages = images.length > 0;
                            const hasOutcomes = project.outcomes && project.outcomes.length > 0;
                            const hasMetrics = !!project.metrics && !!project.metrics.tools_used;
                            const isExpanded = expandedProjects[project.ticket_id];

                            return (
                                <div key={project.ticket_id} className="ph-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: '1.5rem' }} onClick={() => toggleExpand(project.ticket_id)}>
                                    
                                    {/* Main Row */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', width: '100%' }}>
                                        {/* Rank / Icon */}
                                        <div className="ph-icon-box" style={{ background: 'linear-gradient(135deg, rgba(94, 234, 212, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', borderColor: 'rgba(94, 234, 212, 0.2)' }}>
                                            {getCategoryIcon(project.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="ph-content">
                                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: isExpanded ? 'flex-start' : 'center', marginBottom: '0.4rem', gap: '1rem', flexWrap: isExpanded ? 'wrap' : 'nowrap', width: '100%', overflow: 'hidden' }}>
                                                <div className="ph-name-row" style={{ marginBottom: 0, flexShrink: 0 }}>
                                                    <span className="ph-name" style={{ fontSize: '1.25rem' }}>{project.project_name}</span>
                                                    <span className="ph-category-badge">{project.type}</span>
                                                </div>
                                                
                                                {(project.metrics || (project.custom_metrics && project.custom_metrics.length > 0)) && (
                                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', overflow: 'hidden', maxHeight: isExpanded ? 'none' : '1.6rem', justifyContent: 'flex-end', marginLeft: 'auto', paddingBottom: '0.2rem', maxWidth: '100%' }}>
                                                        {project.custom_metrics && project.custom_metrics.map((cm: any, idx: number) => (
                                                            <div key={`cm-${idx}`} title={cm.name} style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                                <span style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cm.name}:</span>
                                                                <span style={{ fontSize: '0.9rem', color: '#818cf8', fontWeight: '800' }}>{cm.value}</span>
                                                            </div>
                                                        ))}
                                                        {project.metrics && project.metrics.total_hours_saved > 0 && (
                                                            <div title="Hours Saved" style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                                <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hours:</span>
                                                                <span style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: '800' }}>{project.metrics.total_hours_saved.toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                        {project.metrics?.data_visibility_improved > 0 && (
                                                            <div title="Visibility Improved" style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                                <span style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Visibility:</span>
                                                                <span style={{ fontSize: '0.9rem', color: '#a78bfa', fontWeight: '800' }}>{project.metrics.data_visibility_improved}x</span>
                                                            </div>
                                                        )}
                                                        {project.metrics?.optimization_rate > 0 && (
                                                            <div title="Optimization Rate" style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                                <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Optimized:</span>
                                                                <span style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: '800' }}>{project.metrics.optimization_rate}%</span>
                                                            </div>
                                                        )}
                                                        {project.metrics?.adoption_rate > 0 && (
                                                            <div title="Adoption Rate" style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                                <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Adoption:</span>
                                                                <span style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: '800' }}>{project.metrics.adoption_rate}%</span>
                                                            </div>
                                                        )}
                                                        {project.metrics?.security_rate > 0 && (
                                                            <div title="Security Score" style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                                <span style={{ fontSize: '0.7rem', color: '#fb7185', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Security:</span>
                                                                <span style={{ fontSize: '0.9rem', color: '#fb7185', fontWeight: '800' }}>{project.metrics.security_rate}%</span>
                                                            </div>
                                                        )}
                                                        {project.metrics?.sla_compliance > 0 && (
                                                            <div title="SLA Compliance" style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                                <span style={{ fontSize: '0.7rem', color: '#e879f9', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SLA:</span>
                                                                <span style={{ fontSize: '0.9rem', color: '#e879f9', fontWeight: '800' }}>{project.metrics.sla_compliance}%</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="ph-tagline" style={{ WebkitLineClamp: isExpanded ? 'unset' : 2, marginBottom: '0' }}>
                                                {project.project_solution}
                                                {isExpanded && hasOutcomes && (
                                                    <span style={{ display: 'inline', color: '#cbd5e1', lineHeight: '1.6' }}>
                                                        {' '}<MetricText text={project.outcomes?.map((o: any) => o.description).join(' ') || ''} highlightColor="#38bdf8" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action / Expand Button */}
                                        {(hasOutcomes || hasImages || hasMetrics) && (
                                            <button 
                                                className={`ph-upvote ${isExpanded ? 'voted' : ''}`}
                                                onClick={(e) => { e.stopPropagation(); toggleExpand(project.ticket_id); }}
                                            >
                                                <svg viewBox="0 0 10 8" fill="none" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                                                    <path d="M5 8L10 0H0L5 8Z" fill="currentColor"/>
                                                </svg>
                                                <span style={{ marginTop: '4px' }}>{isExpanded ? 'LESS' : 'MORE'}</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Expanded Section (Images & Outcomes) underneath */}
                                    {isExpanded && (hasOutcomes || hasImages || hasMetrics) && (
                                        <div style={{ paddingLeft: 'calc(56px + 1.5rem)', marginTop: '1.5rem', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                                            
                                            {/* Images rendered inside expanded view */}
                                            {hasImages && (
                                                <div style={{ marginBottom: '1.5rem' }}>
                                                    {images.length === 1 ? (
                                                        <div style={{ 
                                                            width: '100%', 
                                                            borderRadius: '12px', 
                                                            overflow: 'hidden', 
                                                            border: '1px solid rgba(255,255,255,0.08)',
                                                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                                            cursor: 'pointer'
                                                        }} onClick={(e) => { e.stopPropagation(); setSelectedImage(images[0].dataUrl); }}>
                                                            <img src={images[0].dataUrl} alt={`Preview`} style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', display: 'block' }} />
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px', WebkitOverflowScrolling: 'touch' }}>
                                                            {images.map((att: any, idx: number) => (
                                                                <div key={idx} style={{ 
                                                                    flex: '0 0 auto', 
                                                                    width: '320px', 
                                                                    height: '240px', 
                                                                    borderRadius: '12px', 
                                                                    overflow: 'hidden', 
                                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                                                    transition: 'transform 0.2s',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                                                                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                                                onClick={(e) => { e.stopPropagation(); setSelectedImage(att.dataUrl); }}
                                                                >
                                                                    <img src={att.dataUrl} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Metrics Section */}
                                            {project.metrics && (
                                                <div style={{ marginTop: hasImages ? '2rem' : '0', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>

                                                    
                                                    {/* Tech Stack */}
                                                    
                                                    {/* Tech Stack */}
                                                    {project.metrics.tools_used && (
                                                        <div style={{ marginTop: '1.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                                                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '0.75rem' }}>Tech Stack</span>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                                {project.metrics.tools_used.split(',').map((tool: string, i: number) => (
                                                                    <span key={i} style={{ padding: '0.35rem 0.85rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', border: '1px solid rgba(56, 189, 248, 0.2)' }}>{tool.trim()}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}



                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
                
                {displayed.length === 0 && (
                    <div style={{ width: '100%', padding: '4rem', textAlign: 'center', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.15)' }}>
                        No projects found for this type.
                    </div>
                )}

                {/* Pagination - Wireframe Style */}
                <div className="wf-pagination">
                    <span className="wf-page-label">Page No |</span>
                    <button className="wf-page-arrow" onClick={() => setPage(p => Math.max(1, p - 1))}>{'<'}</button>
                    {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((p) => (
                        <button 
                            key={p} 
                            className={`wf-page-num ${page === p ? 'active' : ''}`}
                            onClick={() => setPage(p)}
                        >
                            {p}
                        </button>
                    ))}
                    <button className="wf-page-arrow" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>{'>'}</button>
                </div>
            </div>

            {/* Full Screen Image Modal */}
            {selectedImage && (
                <div 
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 999999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'zoom-out', pointerEvents: 'auto'
                    }}
                    onClick={() => setSelectedImage(null)}
                >

                    <img 
                        src={selectedImage} 
                        alt="Full Screen" 
                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', cursor: 'zoom-out' }} 
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    />
                </div>
            )}
        </div>
    );
}
