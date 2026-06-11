import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * rehype-knowledge-node plugin
 *
 * For all <a> tags linking to /node/{id}:
 * 1. Adds `data-knowledge-node="{id}"` CSS hook attribute
 * 2. Adds `title` attribute with the node ID for native tooltip
 *
 * The `data-knowledge-node` attribute enables:
 * - CSS styling for cross-reference links (dotted underline + distinct color)
 * - Client-side enhancement (hover tooltip with summary — Phase 3+)
 * - Future analytics on cross-reference usage
 */
export function rehypeKnowledgeNode() {
  return (tree: Root): void => {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'a' &&
        node.properties &&
        typeof node.properties.href === 'string' &&
        node.properties.href.startsWith('/node/')
      ) {
        const nodeId = node.properties.href.replace('/node/', '');
        if (nodeId) {
          node.properties['data-knowledge-node'] = nodeId;
          // Native tooltip — shows the node path as fallback
          if (!node.properties.title) {
            node.properties.title = `知识点：${nodeId}`;
          }
        }
      }
    });
  };
}
