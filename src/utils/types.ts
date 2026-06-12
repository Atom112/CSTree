/**
 * Core type definitions for the CSTree knowledge graph.
 */

export interface NodeData {
  id: string;
  title: string;
  summary: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  parent?: string | null;
  children: string[];
  related: string[];
  prerequisites: string[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  /** Raw body content (when NOT using Astro Collection) */
  body?: string;
}

export type NodeMap = Map<string, NodeData>;

export interface ResolvedGraph {
  nodes: NodeData[];
  nodeMap: NodeMap;
  rootNodes: NodeData[];
  getChildren: (id: string) => NodeData[];
  getBreadcrumbs: (id: string) => NodeData[];
  getSiblings: (id: string) => NodeData[];
  topologicalSort: () => NodeData[];
}

/**
 * Convert Astro Collection entries to NodeData array.
 */
export function fromCollection(
  entries: Array<{ id: string; data: { id: string; [key: string]: unknown } }>
): NodeData[] {
  return entries.map((entry) => ({
    ...entry.data,
    id: entry.data.id,
  }));
}
