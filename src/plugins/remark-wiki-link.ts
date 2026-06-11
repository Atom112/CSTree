import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';

/**
 * remark-wiki-link plugin
 *
 * Parses [[node-id|display-text]] and [[node-id]] (wiki-link) syntax in markdown
 * and converts them to anchor tags linking to knowledge nodes.
 *
 * Processing flow:
 * 1. Scan text nodes for [[...]] / [@...] patterns
 * 2. Extract node ID and optional display text
 * 3. Build-time validation: check target node exists
 * 4. Generate <a> element with data-knowledge-node attribute
 *
 * TODO Phase 3: Full implementation
 * - Integrate with Astro content collection lookups
 * - Build-time validation that referenced nodes exist
 * - Support for [@node-id] inline shorthand
 */

export function remarkWikiLink() {
  return (tree: Root, file: VFile) => {
    // Validate: ensure required dependencies are available at build time
    if (!tree || !file) {
      throw new Error('remark-wiki-link: missing tree or file');
    }

    const warnings: string[] = [];

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined) return;

      const text = node.value;

      // Match [[node-id]] or [[node-id|display-text]]
      const wikiLinkRegex = /\[\[([\w-]+)(?:\|([^\]|]+))?\]\]/g;
      // Match [@node-id] shorthand
      const atLinkRegex = /\[@([\w-]+)\]/g;

      let hasMatch = false;

      // Process [[node-id]] patterns
      let match;
      while ((match = wikiLinkRegex.exec(text)) !== null) {
        hasMatch = true;
        const nodeId = match[1];
        const displayText = match[2] || nodeId;
        warnings.push(`[[wiki-link]] found: ${nodeId} — resolve to /node/${nodeId} in Phase 3`);
      }

      // Process [@node-id] patterns
      while ((match = atLinkRegex.exec(text)) !== null) {
        hasMatch = true;
        const nodeId = match[1];
        warnings.push(`[@wiki-link] found: ${nodeId} — resolve to /node/${nodeId} in Phase 3`);
      }

      if (hasMatch) {
        // TODO Phase 3: Replace text node with proper link nodes
        // For now, log warnings
      }
    });

    if (warnings.length > 0) {
      file.message(`${warnings.length} wiki-link(s) found (not yet resolved)`);
    }
  };
}
