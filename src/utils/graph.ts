import type { NodeData, NodeMap, ResolvedGraph } from './types';

/**
 * Build an id→node lookup map from the raw node array.
 */
export function getNodeMap(nodes: NodeData[]): NodeMap {
  const map = new Map<string, NodeData>();
  for (const node of nodes) {
    map.set(node.id, node);
  }
  return map;
}

/**
 * Get the breadcrumb chain from node → root.
 * Returns [node, parent, grandparent, ..., root].
 */
export function getBreadcrumbs(nodeId: string, nodeMap: NodeMap): NodeData[] {
  const chain: NodeData[] = [];
  let currentId: string | undefined = nodeId;
  let guard = 0;
  while (currentId && guard < 100) {
    const node = nodeMap.get(currentId);
    if (!node) break;
    chain.push(node);
    currentId = node.parent ?? undefined;
    guard++;
  }
  return chain;
}

/**
 * Get siblings of a node (nodes sharing the same parent), sorted by `order`.
 * Excludes the node itself.
 */
export function getSiblings(nodeId: string, nodeMap: NodeMap): NodeData[] {
  const node = nodeMap.get(nodeId);
  if (!node) return [];
  const parentId = node.parent;
  return Array.from(nodeMap.values())
    .filter((n) => n.parent === parentId && n.id !== nodeId)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get the previous/next sibling for navigation.
 */
export function getNavSiblings(nodeId: string, nodeMap: NodeMap): {
  prev: NodeData | null;
  next: NodeData | null;
} {
  const siblings = getSiblings(nodeId, nodeMap);
  const node = nodeMap.get(nodeId);
  if (!node) return { prev: null, next: null };

  const idx = siblings.findIndex((s) => s.id === nodeId);
  return {
    prev: idx > 0 ? siblings[idx - 1] : null,
    next: idx < siblings.length - 1 ? siblings[idx + 1] : null,
  };
}

/**
 * Get children of a node.
 * Resolves both `children` field in frontmatter AND
 * auto-derives from other nodes' `parent` pointing to this node.
 * Deduplicated and sorted by `order`.
 */
export function getChildren(nodeId: string, nodeMap: NodeMap): NodeData[] {
  const explicit = (nodeMap.get(nodeId)?.children ?? []).map((cid) => nodeMap.get(cid)).filter(Boolean) as NodeData[];
  const implicit = Array.from(nodeMap.values())
    .filter((n) => n.parent === nodeId)
    .filter((n) => !explicit.find((e) => e.id === n.id));

  const seen = new Set<string>();
  return [...explicit, ...implicit]
    .filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Topological sort of all nodes based on prerequisites.
 * Returns nodes in learning order (prerequisites first).
 * Throws if a cycle is detected.
 */
export function topologicalSort(nodes: NodeData[]): NodeData[] {
  const nodeMap = getNodeMap(nodes);
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const result: NodeData[] = [];

  function visit(nodeId: string) {
    if (inStack.has(nodeId)) {
      throw new Error(`Circular prerequisite detected: "${nodeId}"`);
    }
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    inStack.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (node) {
      for (const prereqId of node.prerequisites) {
        visit(prereqId);
      }
      result.push(node);
    }

    inStack.delete(nodeId);
  }

  // Sort by order first for deterministic processing
  const sorted = [...nodes].sort((a, b) => a.order - b.order);

  for (const node of sorted) {
    if (!visited.has(node.id)) {
      visit(node.id);
    }
  }

  return result;
}

/**
 * Build the full resolved graph from raw nodes.
 * Auto-derives children, validates references, ordered.
 */
export function resolveGraph(nodes: NodeData[]): ResolvedGraph {
  const nodeMap = getNodeMap(nodes);
  const rootNodes = Array.from(nodeMap.values())
    .filter((n) => !n.parent)
    .sort((a, b) => a.order - b.order);

  return {
    nodes,
    nodeMap,
    rootNodes,
    getChildren: (id: string) => getChildren(id, nodeMap),
    getBreadcrumbs: (id: string) => getBreadcrumbs(id, nodeMap),
    getSiblings: (id: string) => getSiblings(id, nodeMap),
    topologicalSort: () => topologicalSort(nodes),
  };
}

/**
 * Validate the graph structure.
 * Returns errors and warnings arrays instead of throwing.
 */
export function validateGraph(nodes: NodeData[]): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const nodeIds = new Set(nodes.map((n) => n.id));

  for (const node of nodes) {
    // Validate parent
    if (node.parent && !nodeIds.has(node.parent)) {
      errors.push(`[${node.id}] parent "${node.parent}" does not exist`);
    }

    // Validate children (explicit in frontmatter)
    for (const childId of node.children) {
      if (!nodeIds.has(childId)) {
        errors.push(`[${node.id}] child "${childId}" does not exist`);
      }
    }

    // Validate related
    for (const relatedId of node.related) {
      if (!nodeIds.has(relatedId)) {
        errors.push(`[${node.id}] related "${relatedId}" does not exist`);
      }
    }

    // Validate prerequisites
    for (const prereqId of node.prerequisites) {
      if (!nodeIds.has(prereqId)) {
        errors.push(`[${node.id}] prerequisite "${prereqId}" does not exist`);
      }
    }
  }

  // Detect circular prerequisites
  const visited = new Set<string>();
  const inStack = new Set<string>();

  function detectCycle(nodeId: string): boolean {
    if (inStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);
    inStack.add(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      for (const prereqId of node.prerequisites) {
        if (detectCycle(prereqId)) {
          errors.push(`Circular prerequisite detected involving "${nodeId}" -> "${prereqId}"`);
          return true;
        }
      }
    }

    inStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    detectCycle(node.id);
  }

  // Warn about nodes with parent set but not in parent's children list
  for (const node of nodes) {
    if (node.parent) {
      const parent = nodes.find((n) => n.id === node.parent);
      if (parent && !parent.children.includes(node.id)) {
        warnings.push(`[${node.id}] parent "${node.parent}" does not include this node in its children list`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
