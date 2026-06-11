#!/usr/bin/env node

/**
 * Build-time graph validation script.
 *
 * Reads all node markdown files, parses frontmatter,
 * and validates the graph structure (references, cycles, etc.).
 *
 * Exits with code 1 if validation fails.
 *
 * Usage: npx tsx src/scripts/validate-graph.ts
 * Or via prebuild script in package.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '../content/node');

interface NodeFrontmatter {
  id: string;
  title: string;
  summary: string;
  difficulty: string;
  order: number;
  parent?: string | null;
  children: string[];
  related: string[];
  prerequisites: string[];
  tags: string[];
}

/**
 * Parse frontmatter from a markdown file manually.
 * Keeps this script dependency-free for reliability.
 */
function parseFrontmatter(filePath: string): { data: Record<string, unknown>; content: string } {
  const text = fs.readFileSync(filePath, 'utf-8');
  const lines = text.split('\n');

  if (lines[0]?.trim() !== '---') {
    return { data: {}, content: text };
  }

  const endIdx = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
  if (endIdx === -1) {
    return { data: {}, content: text };
  }

  const fmLines = lines.slice(1, endIdx);
  const content = lines.slice(endIdx + 1).join('\n');

  // Simple YAML-like parser (no dependencies)
  const data: Record<string, unknown> = {};
  let currentKey: string | null = null;
  let currentArray: string[] | null = null;

  for (const rawLine of fmLines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Check for array item
    if (line.startsWith('- ') && currentKey) {
      const val = line.slice(2).trim();
      if (currentArray !== null) {
        currentArray.push(val);
      } else {
        data[currentKey] = [val];
        currentArray = [val];
      }
      continue;
    }

    currentArray = null;

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value: unknown = line.slice(colonIdx + 1).trim();

    if (value === '') {
      currentKey = key;
      continue;
    }

    // Parse values
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (value === 'null' || value === '~') value = null;
    else if (/^\d+$/.test(String(value))) value = parseInt(String(value), 10);
    else {
      // Remove quotes
      const strVal = String(value);
      if ((strVal.startsWith("'") && strVal.endsWith("'")) ||
          (strVal.startsWith('"') && strVal.endsWith('"'))) {
        value = strVal.slice(1, -1);
      }
    }

    data[key] = value;
    currentKey = key;
  }

  return { data, content };
}

function collectNodes(dir: string): NodeFrontmatter[] {
  const nodes: NodeFrontmatter[] = [];

  function walk(directory: string) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && /\.md$/.test(entry.name)) {
        if (entry.name.startsWith('_')) continue; // skip partials
        const { data } = parseFrontmatter(fullPath);
        if (data.id) {
          nodes.push({
            id: String(data.id),
            title: String(data.title || ''),
            summary: String(data.summary || ''),
            difficulty: String(data.difficulty || 'beginner'),
            order: Number(data.order || 0),
            parent: data.parent !== undefined && data.parent !== null ? String(data.parent) : undefined,
            children: Array.isArray(data.children) ? data.children.map(String) : [],
            related: Array.isArray(data.related) ? data.related.map(String) : [],
            prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites.map(String) : [],
            tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          });
        }
      }
    }
  }

  walk(dir);
  return nodes;
}

function validate(nodes: NodeFrontmatter[]): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const nodeIds = new Set(nodes.map((n) => n.id));

  // Check for duplicate IDs
  const seenIds = new Set<string>();
  for (const node of nodes) {
    if (seenIds.has(node.id)) {
      errors.push(`Duplicate node id: "${node.id}"`);
    }
    seenIds.add(node.id);
  }

  for (const node of nodes) {
    if (node.parent && !nodeIds.has(node.parent)) {
      errors.push(`[${node.id}] parent "${node.parent}" does not exist`);
    }
    for (const childId of node.children) {
      if (!nodeIds.has(childId)) {
        errors.push(`[${node.id}] child "${childId}" does not exist`);
      }
    }
    for (const relatedId of node.related) {
      if (!nodeIds.has(relatedId)) {
        errors.push(`[${node.id}] related "${relatedId}" does not exist`);
      }
    }
    for (const prereqId of node.prerequisites) {
      if (!nodeIds.has(prereqId)) {
        errors.push(`[${node.id}] prerequisite "${prereqId}" does not exist`);
      }
    }

  }

  // Detect circular prerequisites
  const visited = new Set<string>();
  const inStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    if (inStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);
    inStack.add(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      for (const prereqId of node.prerequisites) {
        if (dfs(prereqId)) {
          errors.push(`Circular prerequisite: "${nodeId}" -> "${prereqId}"`);
          return true;
        }
      }
    }

    inStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    dfs(node.id);
  }

  return { valid: errors.length === 0, errors, warnings };
}

// Main
const nodes = collectNodes(CONTENT_DIR);
console.log(`\n📊 CSTree Graph Validation`);
console.log(`   Found ${nodes.length} node(s) in ${CONTENT_DIR}\n`);

const result = validate(nodes);

if (result.warnings.length > 0) {
  console.log(`⚠️  ${result.warnings.length} warning(s):`);
  for (const w of result.warnings) {
    console.log(`   • ${w}`);
  }
  console.log();
}

if (result.errors.length > 0) {
  console.log(`❌ ${result.errors.length} error(s):`);
  for (const e of result.errors) {
    console.log(`   • ${e}`);
  }
  console.log();
  console.log('❌ Validation FAILED — fix errors before deploying.\n');
  process.exit(1);
} else {
  console.log(`✅ Graph validation PASSED — all ${nodes.length} nodes are correctly linked.\n`);
  process.exit(0);
}
