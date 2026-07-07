"use client";
import { useState, useEffect } from 'react';
// import { createClient } from '@/utils/supabase/client';

const STATUS_OPTIONS = ['Problem statement', 'Problem Discovery', 'Solution design', 'Development', 'testing', 'Deployment', 'Users feedback'];

export default function DashboardPage() {
    // const supabase = createClient();
    const [tickets, setTickets] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const ITEMS_PER_PAGE = 7;

    useEffect(() => {
        // TEMPORARY: Mock Data for UI testing without Supabase
        setUserRole('Manager');
        setUserId('mock-user-123');

        const mockTickets = Array.from({ length: 15 }).map((_, i) => ({
            ticket_id: `tkt-${Math.random().toString(36).substr(2, 9)}`,
            problem_statement: `Mock Problem Statement ${i + 1} - Improve workflow efficiency`,
            department_name: ['Operations', 'Finance', 'HR', 'Marketing'][i % 4],
            status_name: STATUS_OPTIONS[i % STATUS_OPTIONS.length],
            type_name: ['Automation', 'Business Intelligence', 'Web App'][i % 3],
            project_name: `Project Alpha ${i + 1}`,
            project_description: `This is a mock description for project ${i + 1} detailing the approach taken to solve the problem statement.`,
            assigned_to: i % 2 === 0 ? 'mock-user-123' : 'another-user-456',
            publish: i % 3 === 0,
            meeting_timeline: [
                { time: '2026-06-01', synopsis: 'Initial kickoff meeting.' },
                { time: '2026-06-03', synopsis: 'Reviewed mockups.' }
            ],
            attachments: []
        }));
        
        setTickets(mockTickets);
    }, []);

    const updateTicketLocal = (id: string, field: string, value: any) => {
        setTickets(prev => prev.map(t => t.ticket_id === id ? { ...t, [field]: value } : t));
    };

    const handleSave = async (ticket: any) => {
        // TEMPORARY: Mock save
        alert("Context Saved Successfully! (Mocked)");
    };

    const handlePublish = async (ticket: any) => {
        if (!ticket.project_name || (!ticket.project_description && !ticket.project_solution)) {
            alert("Please fill in Project Name and Description in the Summary before publishing!");
            return;
        }
        const newPublishState = !ticket.publish;
        updateTicketLocal(ticket.ticket_id, 'publish', newPublishState);
        
        // TEMPORARY: Mock publish
        // await supabase.from('tickets').update({ publish: newPublishState }).eq('ticket_id', ticket.ticket_id);
    };

    const addMeeting = (id: string) => {
        setTickets(prev => prev.map(t => {
            if (t.ticket_id !== id) return t;
            const newTimeline = [...(t.meeting_timeline || []), { time: new Date().toISOString().split('T')[0], synopsis: '' }];
            return { ...t, meeting_timeline: newTimeline };
        }));
    };

    const updateMeeting = (id: string, index: number, value: string) => {
        setTickets(prev => prev.map(t => {
            if (t.ticket_id !== id) return t;
            const newTimeline = [...t.meeting_timeline];
            newTimeline[index].synopsis = value;
            return { ...t, meeting_timeline: newTimeline };
        }));
    };

    const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setTickets(prev => prev.map(t => {
                if (t.ticket_id !== id) return t;
                const newAttachments = [...(t.attachments || []), { name: file.name, type: file.type, data: base64String }];
                return { ...t, attachments: newAttachments };
            }));
        };
        reader.readAsDataURL(file);
    };

    const removeAttachment = (id: string, index: number) => {
        setTickets(prev => prev.map(t => {
            if (t.ticket_id !== id) return t;
            const newAttachments = [...(t.attachments || [])];
            newAttachments.splice(index, 1);
            return { ...t, attachments: newAttachments };
        }));
    };

    const handleLogout = async () => {
        // await supabase.auth.signOut();
        window.location.href = '/login';
    };

    const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE) || 1;
    const paginated = tickets.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div style={{ minHeight: '100vh', background: '#f4f5f7', color: '#172b4d', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #dfe1e6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#172b4d' }}>DASHBOARD <span style={{ fontSize: '0.8rem', color: '#5e6c84', marginLeft: '0.5rem', fontWeight: 'normal' }}>({userRole})</span></h1>
                <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#5e6c84', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>LOGOUT</button>
            </header>

            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                
                {/* Tickets List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {paginated.map(ticket => (
                        <div key={ticket.ticket_id} style={{ background: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
                            
                            {/* Row Header (2-line layout like wireframe) */}
                            <div style={{ padding: '1rem 2rem', cursor: 'pointer', position: 'relative' }} onClick={() => setExpandedTicket(expandedTicket === ticket.ticket_id ? null : ticket.ticket_id)}>
                                
                                {/* Top Line */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ background: '#d1d5db', padding: '0.4rem 3rem', fontWeight: 900, fontSize: '1.1rem', color: '#000', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {expandedTicket === ticket.ticket_id ? 'Summary' : 'Details'} 
                                            <span style={{ fontWeight: 'normal' }}>{expandedTicket === ticket.ticket_id ? 'ʌ' : 'v'}</span>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', fontWeight: 900, fontSize: '1rem', color: '#000' }}>
                                        {ticket.department_name} &nbsp;|&nbsp; {String(ticket.ticket_id).slice(0, 8)}
                                    </div>
                                </div>

                                {/* Bottom Line */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 1, fontWeight: 900, fontSize: '1.2rem', color: '#000' }}>
                                        {ticket.problem_statement}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem' }}>
                                        <div onClick={e => e.stopPropagation()}>
                                            <select 
                                                value={ticket.status_name} 
                                                onChange={(e) => updateTicketLocal(ticket.ticket_id, 'status_name', e.target.value)}
                                                style={{ padding: '0.2rem 0.5rem', background: 'transparent', border: 'none', fontWeight: 900, fontSize: '1rem', color: '#000', outline: 'none', cursor: 'pointer' }}
                                            >
                                                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                        <div onClick={e => e.stopPropagation()}>
                                            <button 
                                                onClick={() => handlePublish(ticket)}
                                                style={{ background: 'transparent', color: '#000', border: 'none', fontSize: '1rem', fontWeight: 900, cursor: 'pointer' }}
                                            >
                                                {ticket.publish ? 'Unpublish' : 'Publish'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Area (Matches Wireframe 2) */}
                            {expandedTicket === ticket.ticket_id && (
                                <div style={{ display: 'flex', background: '#fff', padding: '2rem' }}>
                                    
                                    {/* Left Sidebar: Status Tracker */}
                                    <div style={{ flex: '0 0 200px', paddingRight: '2rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 900, fontSize: '0.9rem' }}>
                                            {STATUS_OPTIONS.map(opt => (
                                                <div 
                                                    key={opt}
                                                    style={{ 
                                                        padding: '0.5rem', 
                                                        background: ticket.status_name === opt ? '#d1d5db' : 'transparent',
                                                        color: '#000'
                                                    }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Main Content */}
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        
                                        {/* Top Header of Expanded View */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', fontWeight: 900, fontSize: '1rem', color: '#000' }}>
                                            <div>{String(ticket.ticket_id).slice(0, 8)}</div>
                                            <div style={{ background: '#d1d5db', padding: '0.2rem 1.5rem' }}>status</div>
                                            <div>{ticket.department_name}</div>
                                            <div style={{ fontSize: '0.85rem' }}>Publish</div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '2rem', marginBottom: '1.5rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontWeight: 900, color: '#000', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Project name</label>
                                                <input 
                                                    type="text" 
                                                    value={ticket.project_name || ''} 
                                                    placeholder="Project name"
                                                    onChange={(e) => updateTicketLocal(ticket.ticket_id, 'project_name', e.target.value)}
                                                    style={{ width: '100%', padding: '0.75rem', background: '#d1d5db', border: 'none', fontWeight: 900, color: '#6b7280', outline: 'none' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontWeight: 900, color: '#000', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Type</label>
                                                <select 
                                                    value={ticket.type_name}
                                                    onChange={(e) => updateTicketLocal(ticket.ticket_id, 'type_name', e.target.value)}
                                                    style={{ width: '100%', padding: '0.75rem', background: '#d1d5db', border: 'none', fontWeight: 900, color: '#6b7280', outline: 'none' }}
                                                >
                                                    <option value="Automation">Automation</option>
                                                    <option value="Business Intelligence">Business Intelligence</option>
                                                    <option value="Web App">Web App</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', fontWeight: 900, color: '#000', marginBottom: '0.25rem', fontSize: '0.9rem' }}>problem statement</label>
                                            <div style={{ width: '100%', padding: '0.75rem', background: '#d1d5db', fontWeight: 900, color: '#6b7280' }}>
                                                {ticket.problem_statement}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '2rem' }}>
                                            <label style={{ display: 'block', fontWeight: 900, color: '#000', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Description</label>
                                            <textarea 
                                                rows={2}
                                                placeholder="Approach took for the problem"
                                                value={ticket.project_description || ticket.project_solution || ''} 
                                                onChange={(e) => updateTicketLocal(ticket.ticket_id, 'project_description', e.target.value)}
                                                style={{ width: '100%', padding: '0.75rem', background: '#d1d5db', border: 'none', fontWeight: 900, color: '#6b7280', outline: 'none', resize: 'vertical' }}
                                            ></textarea>
                                        </div>

                                        <div style={{ marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                <label style={{ fontWeight: 900, color: '#000', fontSize: '1rem', margin: 0 }}>Meetings overview</label>
                                                <button onClick={() => addMeeting(ticket.ticket_id)} style={{ background: 'transparent', border: 'none', fontSize: '2rem', lineHeight: 1, color: '#000', cursor: 'pointer', fontWeight: 300 }}>+</button>
                                            </div>

                                            {(ticket.meeting_timeline || []).map((m: any, idx: number) => (
                                                <div key={idx} style={{ display: 'flex', marginBottom: '1rem' }}>
                                                    <div style={{ width: '200px', padding: '0.75rem', background: '#d1d5db', fontWeight: 900, color: '#000', borderRight: '2px solid #fff' }}>
                                                        meeting time stamp
                                                    </div>
                                                    <input 
                                                        type="text"
                                                        value={m.synopsis}
                                                        onChange={(e) => updateMeeting(ticket.ticket_id, idx, e.target.value)}
                                                        style={{ flex: 1, padding: '0.75rem', background: '#f3f4f6', border: 'none', fontWeight: 900, color: '#6b7280', outline: 'none' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                                {(ticket.attachments || []).map((att: any, index: number) => (
                                                    <div key={index} style={{ position: 'relative', width: '100px', height: '70px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <img src={att.data} alt="screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <button 
                                                            onClick={() => removeAttachment(ticket.ticket_id, index)}
                                                            style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 900, fontSize: '0.85rem', color: '#000' }}>
                                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(ticket.ticket_id, e)} style={{ display: 'none' }} />
                                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#d1d5db' }}></div>
                                                    Attach files
                                                </label>

                                                <button 
                                                    onClick={() => handleSave(ticket)}
                                                    style={{ background: 'transparent', color: '#000', border: 'none', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer' }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {paginated.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#5e6c84', background: '#fff', border: '1px solid #dfe1e6', borderRadius: '3px' }}>
                            No tickets assigned to you or available.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#172b4d' }}>Page No</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#172b4d', fontWeight: 600 }}>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#172b4d' }}>{'<'}</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p, index) => (
                                <span 
                                    key={p} 
                                    onClick={() => setPage(p)}
                                    style={{ cursor: 'pointer', color: page === p ? '#0052cc' : '#172b4d' }}
                                >
                                    {p}{index < totalPages - 1 ? ',' : ''}
                                </span>
                            ))}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#172b4d' }}>{'>'}</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
