"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Mail, Building, Plus, Trash2, AtSign } from 'lucide-react';

const ALL_DEPARTMENTS = [
    "Algo", "Software", "Medical", "QA", "Hardware", "QARA", "Marketing", "Human Resource",
    "Customer Success", "Order Management", "Finance & Accounts", "Inside Sales", "Customer Support",
    "Management", "Inventory & Logistics", "Admin & Facility", "Product & Design", "Channel Management",
    "IT", "Product Operations", "Tools and Analytics", "SRE", "DE", "Echo Sales", "Sales - SME",
    "Digital Health", "Installation & Service", "Government Business", "Sales - LE", "Malaysia Business",
    "Africa Business", "Philippines Business", "Automation & Business Intelligence", "Clinical Research Division",
    "Draft", "Business Ops", "New Business Initiatives"
];

export default function QueryPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [problemStatement, setProblemStatement] = useState('');
    const [objectiveScope, setObjectiveScope] = useState('');
    const [projectProcess, setProjectProcess] = useState('');
    const [stakeholders, setStakeholders] = useState<{name: string, email: string, department: string}[]>([{ name: '', email: '', department: '' }]);
    const [dataSources, setDataSources] = useState('');
    const [knownStakeholders, setKnownStakeholders] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            const { data: stData } = await supabase.from('stakeholders').select('*');
            if (stData) setKnownStakeholders(stData);
        }
        fetchData();
    }, []);

    const addStakeholder = () => setStakeholders([...stakeholders, { name: '', email: '', department: '' }]);
    const removeStakeholder = (idx: number) => setStakeholders(stakeholders.filter((_, i) => i !== idx));
    const updateStakeholder = (idx: number, field: string, value: string) => {
        const newArr = [...stakeholders];
        newArr[idx] = { ...newArr[idx], [field]: value };

        // Autocomplete Logic
        if (field === 'name') {
            const matched = knownStakeholders.find(k => k.name.toLowerCase() === value.toLowerCase());
            if (matched) {
                newArr[idx].email = matched.email;
                if (matched.department) newArr[idx].department = matched.department;
            }
        }

        setStakeholders(newArr);
    };

    const handleNameChange = (value: string) => {
        setName(value);
        const matched = knownStakeholders.find(k => k.name.toLowerCase() === value.toLowerCase());
        if (matched) {
            setEmail(matched.email || '');
            if (matched.department) setDepartment(matched.department);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Map department ID to prefix dynamically
        const deptLabel = department || 'GEN';
        const deptPrefix = deptLabel.substring(0, 4).toUpperCase();

        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const ticket_id = `ABI-${deptPrefix}-${randomNum}`;

        // Look up the department ID in lokker table
        const { data: lokkerMatch } = await supabase.from('lokker').select('id').eq('category', 'department').eq('label', deptLabel).limit(1);
        const finalDeptId = lokkerMatch && lokkerMatch.length > 0 ? lokkerMatch[0].id : null;

        // Insert into Supabase projects table
        const { error } = await supabase.from('projects').insert([{
            ticket_id,
            submitter_name: name,
            submitter_email: email,
            department_looker_id: finalDeptId,
            problem_statement: problemStatement,
            objectives_scope: objectiveScope,
            project_process: projectProcess,
            data_sources: dataSources,
            is_published: false
        }]);

        // Note: Stakeholders are captured in state but need a custom mapping flow to the project_stakeholders junction table.
        if (!error && ticket_id) {
            const submitterStakeholder = {
                name: name,
                email: email,
                department: deptLabel
            };

            const validStakeholders = stakeholders.filter(s => s.name.trim() !== '' && s.email.trim() !== '');
            const allStakeholders = [submitterStakeholder, ...validStakeholders];

            // Upsert stakeholders and return their IDs
            const { data: insertedStakeholders, error: stakeError } = await supabase
                .from('stakeholders')
                .upsert(allStakeholders, { onConflict: 'email' })
                .select('stakeholder_id');

            if (!stakeError && insertedStakeholders) {
                // Link in project_stakeholders
                const mappings = insertedStakeholders.map(s => ({
                    ticket_id: ticket_id,
                    stakeholder_id: s.stakeholder_id
                }));
                await supabase.from('project_stakeholders').insert(mappings);
            } else {
                console.error("Stakeholder insert error:", stakeError);
            }
        }

        setLoading(false);
        if (error) {
            console.error("Supabase insert error:", error);
            alert("Submission failed. Ensure Supabase keys are correctly configured in .env.local");
        } else {
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="container" style={{ paddingTop: '140px', paddingBottom: '80px', display: 'flex', justifyContent: 'center' }}>
                <div className="section visible text-protect" style={{ width: '100%', maxWidth: '900px', minHeight: 'auto', padding: '0', alignItems: 'flex-start', textAlign: 'left' }}>
                    <div style={{ marginBottom: '3rem', textAlign: 'left' }}>
                        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#5eead4', marginBottom: '1rem', fontFamily: 'Space Grotesk' }}>Thank you for reaching out!</h1>
                        <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: '1.6' }}>We’ve received your submission and will get back to you shortly.</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="btn-primary" 
                            style={{ padding: '0.8rem 3rem' }}
                        >
                            Submit Another Query
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '140px', paddingBottom: '80px', display: 'flex', justifyContent: 'center' }}>
            <div className="section visible text-protect" style={{ width: '100%', maxWidth: '900px', minHeight: 'auto', padding: '0', margin: '0', alignItems: 'center' }}>

                <form onSubmit={handleSubmit} style={{ width: '100%', background: 'linear-gradient(135deg, rgba(80, 90, 100, 0.8) 0%, rgba(40, 50, 60, 0.8) 50%, rgba(15, 20, 25, 0.8) 100%)', padding: '3rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.15)', borderTop: '1px solid rgba(255, 255, 255, 0.4)', borderLeft: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 20px 50px rgba(0,0,0,0.8), 0 0 60px rgba(253, 230, 138, 0.15)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>

                    <div style={{ marginBottom: '3rem', textAlign: 'left' }}>
                        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1rem', fontFamily: 'Space Grotesk' }}>Request Form</h1>
                    </div>

                    {/* Top Row: 3 Columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div>
                            <label className="form-label">Name</label>
                            <div style={{position: 'relative'}}>
                                <User style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '16px', height: '16px'}} />
                                <input required type="text" list="stakeholders-list" className="form-input" style={{paddingLeft: '2.5rem'}} value={name} onChange={e => handleNameChange(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Department</label>
                            <div style={{position: 'relative'}}>
                                <Building style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '16px', height: '16px', pointerEvents: 'none'}} />
                                <select required className="form-input" style={{paddingLeft: '2.5rem'}} value={department} onChange={e => setDepartment(e.target.value)}>
                                    <option value="">Select...</option>
                                    {ALL_DEPARTMENTS.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Email</label>
                            <div style={{position: 'relative'}}>
                                <AtSign style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '16px', height: '16px'}} />
                                <input required type="email" className="form-input" style={{paddingLeft: '2.5rem'}} value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Text Areas Stacked */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">What Specific Challenge Or Opportunity Can ABI Help You Solve Today?</label>
                        <textarea required rows={3} className="form-input" value={problemStatement} onChange={e => setProblemStatement(e.target.value)}></textarea>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">What Is Your Primary Goals And Desired Outcome For This Project?</label>
                        <textarea required rows={3} className="form-input" value={objectiveScope} onChange={e => setObjectiveScope(e.target.value)}></textarea>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">How Is This Process Currently Being Handled?</label>
                        <textarea required rows={3} className="form-input" value={projectProcess} onChange={e => setProjectProcess(e.target.value)}></textarea>
                    </div>

                    <div style={{ marginBottom: '1.5rem', background: '#13181d', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <label className="form-label" style={{ marginBottom: 0 }}>Who Are The Stakeholders Involved In This Initiative?</label>
                            <button type="button" onClick={addStakeholder} style={{ background: 'rgba(94, 234, 212, 0.1)', color: '#5eead4', border: '1px solid rgba(94, 234, 212, 0.3)', padding: '0.4rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s' }}><Plus size={14} /> Add</button>
                        </div>

                        <datalist id="stakeholders-list">
                            {knownStakeholders.map(k => (
                                <option key={k.email} value={k.name} />
                            ))}
                        </datalist>

                        {stakeholders.map((sh, idx) => (
                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', marginBottom: '1rem', alignItems: 'end' }}>
                                <div>
                                    <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Name</label>
                                    <div style={{position: 'relative'}}><User style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '14px', height: '14px'}} /><input type="text" list="stakeholders-list" className="form-input" style={{ marginBottom: 0, paddingLeft: '2.2rem' }} value={sh.name} onChange={e => updateStakeholder(idx, 'name', e.target.value)} placeholder="Stakeholder Name" /></div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Department</label>
                                    <div style={{position: 'relative'}}>
                                        <Building style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '14px', height: '14px', pointerEvents: 'none'}} />
                                        <select className="form-input" style={{ marginBottom: 0, paddingLeft: '2.2rem' }} value={sh.department} onChange={e => updateStakeholder(idx, 'department', e.target.value)}>
                                            <option value="">Select...</option>
                                            {ALL_DEPARTMENTS.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Email</label>
                                    <div style={{position: 'relative'}}>
                                        <AtSign style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '14px', height: '14px'}} />
                                        <input type="email" className="form-input" style={{ marginBottom: 0, paddingLeft: '2.2rem' }} value={sh.email} onChange={e => updateStakeholder(idx, 'email', e.target.value)} placeholder="name@domain.com" />
                                    </div>
                                </div>
                                <button type="button" onClick={() => removeStakeholder(idx)} disabled={stakeholders.length === 1} style={{ background: '#f43f5e', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '4px', cursor: stakeholders.length === 1 ? 'not-allowed' : 'pointer', opacity: stakeholders.length === 1 ? 0.3 : 1 }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <label className="form-label">What Are Your Data Sources?</label>
                        <textarea required rows={3} className="form-input" value={dataSources} onChange={e => setDataSources(e.target.value)}></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.8rem 3rem' }}>
                            {loading ? 'Transmitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
