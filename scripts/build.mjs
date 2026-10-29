// Fügt die Quelldateien zu dist/homeboo-3d-card.js zusammen: node scripts/build.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const parts = readdirSync('src').filter(f => f.endsWith('.js')).sort();
writeFileSync('dist/homeboo-3d-card.js', parts.map(f => readFileSync('src/' + f, 'utf8')).join(''));
console.log('dist/homeboo-3d-card.js aus', parts.join(', '));
