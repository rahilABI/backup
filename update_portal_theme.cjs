const fs = require('fs');

// 1. Update globals.css
const cssPath = '/home/vempallemohammadrahil/.gemini/antigravity/scratch/abi-portal/app/globals.css';
let css = fs.readFileSync(cssPath, 'utf-8');

// Replace form-input
css = css.replace(/\.form-input \{[\s\S]*?outline: none;\n    font-family: 'Inter', sans-serif;\n\}/, 
`.form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: #0f1418;
    border: 1px solid #1d252a;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.7);
    color: #e2e8f0;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    outline: none;
    font-family: 'Inter', sans-serif;
}`);

// Replace form-input:focus
css = css.replace(/\.form-input:focus \{ border-color: #5eead4; \}/, 
`.form-input:focus { 
    border-color: #5eead4; 
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.7), 0 0 10px rgba(94,234,212,0.3); 
}`);

// Replace form-label
css = css.replace(/\.form-label \{[\s\S]*?letter-spacing: 0\.2px;\n\}/, 
`.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    color: #5eead4;
}`);

// Update primary button
css = css.replace(/\.btn-primary \{[\s\S]*?transition: opacity 0\.2s;\n\}/,
`.btn-primary {
    background: linear-gradient(90deg, #5eead4 0%, #06b6d4 100%);
    color: #000;
    padding: 0.7rem 2.5rem;
    font-weight: 800;
    font-size: 0.95rem;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    font-family: 'Space Grotesk', sans-serif;
    transition: all 0.3s;
    box-shadow: 0 0 15px rgba(94,234,212,0.4);
}`);
css = css.replace(/\.btn-primary:hover \{ opacity: 0\.8; \}/, 
`.btn-primary:hover { 
    transform: translateY(-2px);
    box-shadow: 0 0 25px rgba(94,234,212,0.6); 
}`);

fs.writeFileSync(cssPath, css);

// 2. Update page.tsx
const pagePath = '/home/vempallemohammadrahil/.gemini/antigravity/scratch/abi-portal/app/query/page.tsx';
let pageCode = fs.readFileSync(pagePath, 'utf-8');

// Add Lucide icons imports
if (!pageCode.includes('lucide-react')) {
    pageCode = pageCode.replace(
        "import { supabase } from '@/lib/supabaseClient';", 
        "import { supabase } from '@/lib/supabaseClient';\nimport { User, Mail, Building, Plus, Trash2, AtSign } from 'lucide-react';"
    );
}

// Update the form container background
pageCode = pageCode.replace(
    /background: '\#111315', padding: '3rem', borderRadius: '8px', border: '1px solid rgba\(255,255,255,0\.08\)', boxShadow: '0 10px 40px rgba\(0,0,0,0\.5\)'/,
    "background: '#161c22', padding: '3rem', borderRadius: '16px', border: '1px solid rgba(94,234,212,0.1)', boxShadow: '0 10px 50px rgba(0,0,0,0.6)'"
);

// Inject Icons into Top Row
pageCode = pageCode.replace(
    /<div>\s*<label className="form-label">Name<\/label>\s*<input required type="text" list="stakeholders-list" className="form-input" value=\{name\} onChange=\{e => handleNameChange\(e\.target\.value\)\} \/>\s*<\/div>/,
    `<div>
        <label className="form-label">Name</label>
        <div style={{position: 'relative'}}>
            <User style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '16px', height: '16px'}} />
            <input required type="text" list="stakeholders-list" className="form-input" style={{paddingLeft: '2.5rem'}} value={name} onChange={e => handleNameChange(e.target.value)} />
        </div>
    </div>`
);

pageCode = pageCode.replace(
    /<div>\s*<label className="form-label">Email<\/label>\s*<input required type="email" className="form-input" value=\{email\} onChange=\{e => setEmail\(e\.target\.value\)\} \/>\s*<\/div>/,
    `<div>
        <label className="form-label">Email</label>
        <div style={{position: 'relative'}}>
            <AtSign style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '16px', height: '16px'}} />
            <input required type="email" className="form-input" style={{paddingLeft: '2.5rem'}} value={email} onChange={e => setEmail(e.target.value)} />
        </div>
    </div>`
);

// Stakeholders row icons
pageCode = pageCode.replace(
    /<input type="text" list="stakeholders-list" className="form-input" style=\{\{ marginBottom: 0 \}\} value=\{sh\.name\}/g,
    `<div style={{position: 'relative'}}><User style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '14px', height: '14px'}} /><input type="text" list="stakeholders-list" className="form-input" style={{ marginBottom: 0, paddingLeft: '2.2rem' }} value={sh.name}`
);

pageCode = pageCode.replace(
    /onChange=\{e => updateStakeholder\(idx, 'name', e\.target\.value\)\} placeholder="Stakeholder Name" \/>/g,
    `onChange={e => updateStakeholder(idx, 'name', e.target.value)} placeholder="Stakeholder Name" /></div>`
);

pageCode = pageCode.replace(
    /<input type="email" className="form-input" style=\{\{ marginBottom: 0 \}\} value=\{sh\.email\}/g,
    `<div style={{position: 'relative'}}><AtSign style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '14px', height: '14px'}} /><input type="email" className="form-input" style={{ marginBottom: 0, paddingLeft: '2.2rem' }} value={sh.email}`
);

pageCode = pageCode.replace(
    /onChange=\{e => updateStakeholder\(idx, 'email', e\.target\.value\)\} placeholder="name@domain\.com" \/>/g,
    `onChange={e => updateStakeholder(idx, 'email', e.target.value)} placeholder="name@domain.com" /></div>`
);

// Department Select Icon
pageCode = pageCode.replace(
    /<select className="form-input" style=\{\{ marginBottom: 0 \}\} value=\{sh\.department\}/g,
    `<div style={{position: 'relative'}}><Building style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '14px', height: '14px', pointerEvents: 'none'}} /><select className="form-input" style={{ marginBottom: 0, paddingLeft: '2.2rem' }} value={sh.department}`
);

pageCode = pageCode.replace(
    /onChange=\{e => updateStakeholder\(idx, 'department', e\.target\.value\)\}>\s*<option value="">Select\.\.\.<\/option>/g,
    `onChange={e => updateStakeholder(idx, 'department', e.target.value)}>\n                                        <option value="">Select...</option>`
);

pageCode = pageCode.replace(
    /\{ALL_DEPARTMENTS\.map\(d => \(\s*<option key=\{d\} value=\{d\}>\{d\}<\/option>\s*\)\)\}\s*<\/select>/g,
    `{ALL_DEPARTMENTS.map(d => (\n                                            <option key={d} value={d}>{d}</option>\n                                        ))}\n                                    </select></div>`
);


// Replace X with Trash Icon
pageCode = pageCode.replace(
    />\s*X\s*<\/button>/g,
    `>\n                                    <Trash2 size={16} />\n                                </button>`
);

// Stakeholder background
pageCode = pageCode.replace(
    /background: 'rgba\(255,255,255,0\.02\)', padding: '1\.5rem', borderRadius: '8px', border: '1px solid rgba\(255,255,255,0\.05\)'/g,
    `background: '#13181d', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'`
);

// + Add button style
pageCode = pageCode.replace(
    /<button type="button" onClick=\{addStakeholder\} style=\{\{ background: 'transparent', color: '\#5eead4', border: '1px solid \#5eead4', padding: '0\.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0\.8rem', fontWeight: 'bold' \}\}>\+ Add<\/button>/g,
    `<button type="button" onClick={addStakeholder} style={{ background: 'rgba(94, 234, 212, 0.1)', color: '#5eead4', border: '1px solid rgba(94, 234, 212, 0.3)', padding: '0.4rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s' }}><Plus size={14} /> Add</button>`
);

// Main Department Dropdown Icon
pageCode = pageCode.replace(
    /<div>\s*<label className="form-label">Department<\/label>\s*<select required className="form-input" value=\{department\} onChange=\{e => setDepartment\(e\.target\.value\)\}>/g,
    `<div>\n                            <label className="form-label">Department</label>\n                            <div style={{position: 'relative'}}>\n                                <Building style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '16px', height: '16px', pointerEvents: 'none'}} />\n                                <select required className="form-input" style={{paddingLeft: '2.5rem'}} value={department} onChange={e => setDepartment(e.target.value)}>`
);

pageCode = pageCode.replace(
    /\{ALL_DEPARTMENTS\.map\(d => \(\s*<option key=\{d\} value=\{d\}>\{d\}<\/option>\s*\)\)\}\s*<\/select>\s*<\/div>/g,
    `{ALL_DEPARTMENTS.map(d => (\n                                    <option key={d} value={d}>{d}</option>\n                                ))}\n                            </select>\n                            </div>\n                        </div>`
);


fs.writeFileSync(pagePath, pageCode);
console.log('Portal Theme applied successfully.');
