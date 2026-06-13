// Build-time script: generates public/node-index.json from all node markdown files
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const base = join(root, 'src', 'content', 'node');
const dirs = readdirSync(base).filter(d => statSync(join(base, d)).isDirectory());
const index = [];

for (const dir of dirs) {
  const files = readdirSync(join(base, dir)).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const text = readFileSync(join(base, dir, file), 'utf-8');
    const id = text.match(/^id:\s*(.+)$/m)?.[1]?.trim();
    const title = text.match(/^title:\s*(.+)$/m)?.[1]?.trim();
    const summary = text.match(/^summary:\s*(.+)$/m)?.[1]?.trim() || '';
    if (id && title) index.push({ id, title, summary });
  }
}

const out = join(root, 'public', 'node-index.json');
writeFileSync(out, JSON.stringify(index));
console.log(`✅ node-index.json generated — ${index.length} nodes`);
