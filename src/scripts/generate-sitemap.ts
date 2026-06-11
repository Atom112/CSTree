#!/usr/bin/env node

/**
 * Custom sitemap generator.
 *
 * Scans the dist directory for .html files and generates sitemap.xml.
 * Runs as a post-build step.
 *
 * Usage: npx tsx src/scripts/generate-sitemap.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../../dist');
const SITE_URL = 'https://cstree.pages.dev';

function collectHtmlFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(directory: string) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name === 'index.html') {
        // Get the URL path relative to dist
        const relativePath = path.relative(DIST_DIR, path.dirname(fullPath));
        const urlPath = (relativePath === '.' || relativePath === '') ? '' : '/' + relativePath.replace(/\\/g, '/');
        files.push(urlPath);
      }
    }
  }

  walk(dir);
  return files.sort();
}

function generateSitemap(urls: string[]): string {
  const now = new Date().toISOString();

  const urlElements = urls
    .map((urlPath) => {
      const fullUrl = urlPath === ''
        ? `${SITE_URL}/`
        : `${SITE_URL}${urlPath}/`;
      return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${urlPath === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${urlPath === '' ? '1.0' : urlPath.split('/').length === 2 ? '0.8' : '0.6'}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

// Main
if (!fs.existsSync(DIST_DIR)) {
  console.error(`❌ dist directory not found at ${DIST_DIR}`);
  process.exit(1);
}

const urls = collectHtmlFiles(DIST_DIR);
const sitemap = generateSitemap(urls);
const outPath = path.join(DIST_DIR, 'sitemap.xml');

fs.writeFileSync(outPath, sitemap, 'utf-8');
console.log(`📄 Sitemap generated: ${outPath}`);
console.log(`   ${urls.length} URL(s):`);
for (const url of urls) {
  console.log(`   • ${SITE_URL}${url}/`);
}
console.log();
