import type { Root, Link, Text } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * remark-wiki-link plugin
 *
 * Transforms wiki-link syntax in markdown into proper anchor tags:
 *   [[node-id]]           → <a href="/node/node-id" data-kn="node-id">node-id</a>
 *   [[node-id|显示文字]]    → <a href="/node/node-id" data-kn="node-id">显示文字</a>
 *   [@node-id]            → <a href="/node/node-id" data-kn="node-id">node-id</a>
 *
 * The plugin does NOT have access to node titles at parse time,
 * so [[node-id]] falls back to the kebab-case id as display text.
 * Content authors should always use [[node-id|中文标题]] for best readability.
 *
 * For [@node-id], display text falls back to node-id.
 * This syntax is intended for cases where the surrounding sentence
 * provides context so the node-id alone suffices as a visual hint.
 */

const WIKI_LINK_RE = /\[\[([\w-]+)(?:\|([^\[\]|]+))?\]\]/g;
const AT_LINK_RE = /\[@([\w-]+)\]/g;

interface WikiMatch {
  index: number;
  0: string;
  1: string;
  2?: string;
  type: 'wiki' | 'at';
}

export function remarkWikiLink() {
  return (tree: Root): void => {
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Root | undefined) => {
      if (!parent || index === undefined) return;

      const text = node.value;

      // Collect all wiki-link and at-link matches, sorted by position
      const matches: WikiMatch[] = [];

      let m: RegExpExecArray | null;
      WIKI_LINK_RE.lastIndex = 0;
      while ((m = WIKI_LINK_RE.exec(text)) !== null) {
        matches.push({ index: m.index, 0: m[0], 1: m[1], 2: m[2], type: 'wiki' });
      }

      AT_LINK_RE.lastIndex = 0;
      while ((m = AT_LINK_RE.exec(text)) !== null) {
        matches.push({ index: m.index, 0: m[0], 1: m[1], type: 'at' });
      }

      if (matches.length === 0) return;

      matches.sort((a, b) => a.index - b.index);

      // Build replacement nodes: interleave text and link nodes
      const nodes: Array<Text | Link> = [];
      let cursor = 0;

      for (const match of matches) {
        // Text before this match
        if (match.index > cursor) {
          nodes.push({
            type: 'text',
            value: text.slice(cursor, match.index),
          } as Text);
        }

        const nodeId = match[1];
        const displayText = match[2] ?? nodeId;

        nodes.push({
          type: 'link',
          url: `/node/${nodeId}`,
          data: { knowledgeNode: nodeId },
          children: [{ type: 'text', value: displayText }] as Text[],
        } as Link);

        cursor = match.index + match[0].length;
      }

      // Text after the last match
      if (cursor < text.length) {
        nodes.push({
          type: 'text',
          value: text.slice(cursor),
        } as Text);
      }

      // Replace the original text node with the fragment
      parent.children.splice(index, 1, ...nodes);

      // Tell visit to skip past the inserted nodes to avoid re-processing them
      return index + nodes.length;
    });
  };
}
