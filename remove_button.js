import fs from 'fs';

const filePath = '/home/vempallemohammadrahil/Desktop/abi-team-project/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the Seed DB button with nothing
content = content.replace(/<button onClick=\{runSeeder\} className="px-2 py-1 bg-rose-500 text-white rounded text-xs">Seed DB<\/button>/g, '');

fs.writeFileSync(filePath, content);
console.log('Removed Seed DB button!');
