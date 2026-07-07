import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ProjectsSection.css';
import automationLogo from '../assets/automation-logo.png';
import biLogo from '../assets/bi-logo.png';

/* ══════════════════════════════════════════
   TEAM CONFIG
══════════════════════════════════════════ */
function getProjectConfig(category) {
  if (['Automation', 'AI & ML'].includes(category)) {
    return { team: 'AUTOMATION & AI', type: 'automation' };
  } else {
    return { team: 'BUSINESS INTELLIGENCE', type: 'bi' };
  }
}

/* ══════════════════════════════════════════
   TEAM ICONS (SVG)
══════════════════════════════════════════ */
const IconGears = () => <i className="fa-solid fa-gears text-[1.4rem]"></i>;

const IconChart = () => <i className="fa-solid fa-chart-pie text-[1.4rem]"></i>;

const IconUser = () => <i className="fa-solid fa-user text-[1.4rem]"></i>;

const IconChevronDown = ({ rotated }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"
    style={{ transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ══════════════════════════════════════════
   DYNAMIC METRICS GENERATOR
══════════════════════════════════════════ */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function generateDynamicMetrics(title, desc, category) {
  const hash = hashCode(title + desc);
  let pool = [];

  if (category === 'Dashboards') {
    pool = ['Manual Reports Eliminated', 'Operational Uptime Maintained', 'KPI Visibility Improved', 'Legacy Tools Replaced', 'Execution Speeds Boosted', 'User Adoption Maximized'];
  } else if (category === 'Automation') {
    pool = ['Process Workloads Automated', 'Human Labor Hours Reduced', 'API Errors Drastically Cut', 'Processing Speed Enhanced', 'Audit Logs Generated', 'Resource Allocations Shifted'];
  } else if (category === 'AI & ML') {
    pool = ['Decision Precision Boosted', 'Inference Run Times Halved', 'Retention Values Increased', 'Behavioral Vectors Calibrated', 'Predictive Drift Monitored'];
  } else {
    pool = ['Cloud Latency Gaps Eliminated', 'Query Speed Multiplied', 'Storage Consolidations Done', 'Data Access Speeds Doubled', 'Ingestion Pipes Standardized'];
  }

  const count = 3 + (hash % 2);
  const selected = [];
  for (let i = 0; i < count; i++) {
    const idx = (hash + i) % pool.length;
    if (!selected.includes(pool[idx])) selected.push(pool[idx]);
  }
  return selected;
}

/* ══════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════ */
const MOCK_PROJECTS = [
  {
    ticket_id: 'ABIT-01',
    title: 'Operations Hub Dashboard',
    category: 'Dashboards',
    reporter: 'Steve Jobs',
    shortDesc: 'A centralized view of daily plant operations and critical KPIs.',
    longDesc: 'Built to replace 14 disparate legacy reporting tools, this unified dashboard aggregates real-time data from global manufacturing plants. It enables shift managers to instantly spot bottlenecks, track yield, and proactively adjust operations. Developed using React with a SQL Server backend and PowerBI integrations.',
    techStack: ['React', 'PowerBI', 'SQL Server', 'Node.js'],
    attachments: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    ticket_id: 'ABIT-02',
    title: 'Automated Invoice Processing',
    category: 'Automation',
    reporter: 'Ada Lovelace',
    shortDesc: 'End-to-end extraction and routing of vendor invoices.',
    longDesc: 'Implemented an OCR-based robotic process to read incoming PDF invoices, extract line items, match them against POs in the ERP system, and automatically route exceptions for human review. This eliminated thousands of hours of manual data entry. Uses AWS APIs and Python routines to coordinate workflows.',
    techStack: ['Python', 'AWS', 'PostgreSQL', 'UiPath'],
    attachments: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    ticket_id: 'ABIT-03',
    title: 'Predictive Customer Churn Model',
    category: 'AI & ML',
    reporter: 'Sarah Connor',
    shortDesc: 'Machine learning model predicting B2B account churn risk.',
    longDesc: 'Predictive behavioral patterns are fed daily through automated pipelines to assess user friction points. Customer success teams receive actionable triggers allowing them to proactively resolve issues before churn occurs. Configured with TensorFlow, Pandas, and Python.',
    techStack: ['Python', 'TensorFlow', 'Pandas', 'FastAPI'],
    attachments: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    ticket_id: 'ABIT-04',
    title: 'Enterprise Data Lake Migration',
    category: 'Data Eng',
    reporter: 'Grace Hopper',
    shortDesc: 'Consolidated on-premise data warehouses into a cloud data lake.',
    longDesc: 'Architected a scalable, high-speed data ecosystem merging unstructured legacy storage silos into a unified warehouse using Apache Spark, Terraform, and Snowflake for instant querying. Unlocked the ability for the data science team to run complex predictive models without impacting production systems.',
    techStack: ['Apache Spark', 'Terraform', 'Snowflake', 'Airflow'],
    attachments: [],
  },
  {
    ticket_id: 'ABIT-05',
    title: 'Sales Performance Tracker',
    category: 'Web Apps',
    reporter: 'John Doe',
    shortDesc: 'Mobile-friendly web application for field sales reps.',
    longDesc: 'A custom-built progressive web app allowing field representatives to log client visits, check inventory levels in real-time, and view their quarterly commission targets. Features offline mode for remote areas with near-instant sync.',
    techStack: ['React', 'GraphQL', 'PostgreSQL', 'Redis'],
    attachments: [],
  },
  {
    ticket_id: 'ABIT-06',
    title: 'HR Onboarding Automation Bot',
    category: 'Automation',
    reporter: 'Alan Turing',
    shortDesc: 'Automates software provisioning and account creation for new hires.',
    longDesc: 'Upon a new employee record creation in Workday, this bot automatically triggers IT tickets, provisions Active Directory accounts, assigns software licenses, and sends a welcome email with credentials—all before the employee\'s first day.',
    techStack: ['Power Automate', 'Azure AD', 'ServiceNow API'],
    attachments: [],
  },
  {
    ticket_id: 'ABIT-07',
    title: 'Customer 360 Dashboard',
    category: 'Dashboards',
    reporter: 'Bill Gates',
    shortDesc: 'Comprehensive view of the entire customer lifecycle.',
    longDesc: 'A master dashboard merging marketing touchpoints, sales calls, support tickets, and product usage into a single timeline. Used primarily by the Customer Success team to tailor Quarterly Business Reviews and identify upsell opportunities.',
    techStack: ['Tableau', 'dbt', 'Snowflake', 'Fivetran'],
    attachments: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    ticket_id: 'ABIT-08',
    title: 'Sentiment Analysis Engine',
    category: 'AI & ML',
    reporter: 'Sarah Connor',
    shortDesc: 'Real-time NLP processing of social media and review platforms.',
    longDesc: 'Scrapes brand mentions across Twitter, Reddit, and Trustpilot, processing text through an NLP pipeline to gauge public sentiment. Triggers automatic alerts to the PR team if a negative sentiment spike is detected in real-time.',
    techStack: ['Python', 'Hugging Face', 'Kafka', 'Elasticsearch'],
    attachments: [],
  },
];

const CATEGORIES = ['All', 'Automation', 'Dashboards', 'AI & ML', 'Data Eng', 'Web Apps'];
const ITEMS_PER_PAGE = 4;

/* ══════════════════════════════════════════
   IMAGE CAROUSEL SUB-COMPONENT
══════════════════════════════════════════ */
const ImageCarousel = ({ attachments, projectId }) => {
  const [idx, setIdx] = useState(0);

  const navigate = useCallback((dir, e) => {
    e.stopPropagation();
    setIdx(prev => {
      const next = prev + dir;
      if (next < 0) return attachments.length - 1;
      if (next >= attachments.length) return 0;
      return next;
    });
  }, [attachments.length]);

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="proj-carousel">
      <div className="proj-carousel-img-wrap">
        <img
          src={attachments[idx]}
          alt="Project attachment"
          className="proj-carousel-img"
          onError={e => { e.target.src = 'https://placehold.co/400x240/f4ede2/8c7e6e?text=No+Preview'; }}
        />
        {attachments.length > 1 && (
          <>
            <button className="proj-carousel-btn left" onClick={(e) => navigate(-1, e)}>
              <IconChevronLeft />
            </button>
            <button className="proj-carousel-btn right" onClick={(e) => navigate(1, e)}>
              <IconChevronRight />
            </button>
            <div className="proj-carousel-dots">
              {attachments.map((_, i) => (
                <span key={i} className={`proj-carousel-dot ${i === idx ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const ProjectsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const filteredProjects = MOCK_PROJECTS.filter(proj => {
    const rcfg = getProjectConfig(proj.category);
    const matchesSearch =
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.longDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      rcfg.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || proj.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleToggle = (ticket_id, e) => {
    if (e.target.closest('button') && !e.target.closest('.proj-toggle-btn')) return;
    setExpandedId(expandedId === ticket_id ? null : ticket_id);
  };

  const handleCategoryChange = e => { setSelectedCategory(e.target.value); setCurrentPage(1); setExpandedId(null); };
  const handleSearchChange = e => { setSearchTerm(e.target.value); setCurrentPage(1); setExpandedId(null); };

  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">

        {/* ── FILTERS BAR ── */}
        <div className="projects-filters-bar">
          <div className="proj-filter-left">
            <div className="proj-search-wrap">
              <svg className="proj-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search project, stack, team..."
                className="proj-search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="proj-select-wrap">
              <select className="proj-category-select" value={selectedCategory} onChange={handleCategoryChange}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
              </select>
              <svg className="proj-select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
          <span className="proj-results-count">Showing {filteredProjects.length} Result{filteredProjects.length !== 1 ? 's' : ''}</span>
        </div>

        {/* ── PROJECT STACK ── */}
        <div className="projects-list">
          <AnimatePresence mode="popLayout">
            {currentProjects.length > 0 ? currentProjects.map((proj, i) => {
              const isExpanded = expandedId === proj.ticket_id;
              const rcfg = getProjectConfig(proj.category);
              const achievements = generateDynamicMetrics(proj.title, proj.longDesc, proj.category);
              const hasAttachments = proj.attachments && proj.attachments.length > 0;

              return (
                <motion.div
                  key={proj.ticket_id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className={`proj-card ${isExpanded ? 'expanded' : ''}`}
                >
                  {/* TOP-RIGHT: Achievements */}
                  <ul className="proj-achievements">
                    {achievements.map((a, idx) => (
                      <li key={idx} className="proj-achievement-item">
                        <span className="proj-achievement-dot" />
                        {a}
                      </li>
                    ))}
                  </ul>

                  {/* ── CARD HEADER ROW ── */}
                  <div className="proj-header-row" onClick={e => handleToggle(proj.ticket_id, e)}>

                    {/* LEFT: Icon + Title + Desc */}
                    <div className="proj-info-left">
                      <div className={`proj-team-icon ${rcfg.type}`} title={rcfg.team}>
                        {rcfg.type === 'automation' ? <img src={automationLogo} alt="Automation" className="proj-custom-logo" /> : rcfg.type === 'bi' ? <img src={biLogo} alt="BI" className="proj-custom-logo" /> : <IconUser />}
                      </div>
                      <div className="proj-title-area">
                        <div className="proj-title-row">
                          <h3 className="proj-title">{proj.title}</h3>
                          <span className="proj-category-pill">{proj.category}</span>
                        </div>
                        <p className="proj-short-desc">{proj.shortDesc}</p>
                      </div>
                    </div>

                    {/* RIGHT: Toggle only */}
                    <div className="proj-info-right">
                      <button className={`proj-toggle-btn ${isExpanded ? 'active' : ''}`} onClick={e => { e.stopPropagation(); handleToggle(proj.ticket_id, e); }}>
                        <IconChevronDown rotated={isExpanded} />
                      </button>
                    </div>
                  </div>

                  {/* ── EXPANDED DETAILS ── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="proj-details">
                          <div className={`proj-details-grid ${hasAttachments ? 'has-image' : ''}`}>
                            {/* Description */}
                            <div className="proj-desc-block">
                              <div className="proj-details-label">Description</div>
                              <p className="proj-long-desc">{proj.longDesc}</p>
                            </div>
                            {/* Carousel */}
                            {hasAttachments && (
                              <ImageCarousel attachments={proj.attachments} projectId={proj.ticket_id} />
                            )}
                          </div>

                          {/* Tech Stack */}
                          <div className="proj-tech-block">
                            <div className="proj-details-label">Tech Stack</div>
                            <div className="proj-tech-pills">
                              {proj.techStack.map((tech, idx) => (
                                <span className="proj-tech-pill" key={idx}>{tech}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="proj-no-results">
                No projects match current filter parameters.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="proj-pagination">
            <button className="proj-page-arrow" disabled={safePage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
              <IconChevronLeft />
            </button>
            <div className="proj-page-numbers">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`proj-page-num ${safePage === idx + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button className="proj-page-arrow" disabled={safePage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>
              <IconChevronRight />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProjectsSection;
