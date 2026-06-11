import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface NodeData {
  id: string;
  title: string;
  summary: string;
  parent?: string | null;
  children: string[];
  difficulty?: string;
}

interface Props {
  nodes: NodeData[];
  currentNodeId?: string;
}

interface D3HierarchyNode extends d3.HierarchyNode<NodeData> {
  x: number;
  y: number;
}

/** Node dimensions */
const NODE_W = 130;
const NODE_H = 36;
const NODE_RX = 8;

export default function KnowledgeTreeReact({ nodes, currentNodeId }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Observe container resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    ro.observe(el);
    // Initial size
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setDimensions({ width: rect.width, height: rect.height });
    }

    return () => ro.disconnect();
  }, []);

  // Render D3 tree
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Build hierarchy from flat node list
    const stratify = d3
      .stratify<NodeData>()
      .id((d) => d.id)
      .parentId((d) => (d.parent ? d.parent : null));

    // Need to filter out nodes that reference non-existent parents
    // to avoid stratify errors
    const validNodes = nodes.filter((n) => {
      if (!n.parent) return true;
      return nodes.some((p) => p.id === n.parent);
    });

    let root: d3.HierarchyNode<NodeData>;

    try {
      root = stratify(validNodes);
    } catch {
      // Fallback: treat all nodes without a valid hierarchy
      return;
    }

    // Tree layout
    const treeLayout = d3
      .tree<NodeData>()
      .size([width - 80, height - 100])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 2));

    treeLayout(root);

    // Zoom behavior
    const g = svg.append('g').attr('class', 'tree-group');

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Center the tree initially
    const treeWidth = (root as unknown as D3HierarchyNode).x * 2;
    const initialScale = Math.min(1, (width - 40) / Math.max(treeWidth, 1));
    const initialX = (width - treeWidth * initialScale) / 2;
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(initialX, 40).scale(initialScale)
    );

    // Draw edges (parent → child paths)
    const linkGen = d3
      .link<d3.HierarchyPointLink<NodeData>, [number, number]>()
      .x((d) => d[0])
      .y((d) => d[1]);

    g.selectAll('.tree-edge')
      .data(root.links())
      .join('path')
      .attr('class', 'tree-edge')
      .attr('d', (d) => {
        const source = d.source as unknown as D3HierarchyNode;
        const target = d.target as unknown as D3HierarchyNode;
        return linkGen({
          source: [source.x, source.y + NODE_H / 2],
          target: [target.x, target.y - NODE_H / 2],
        });
      })
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const nodeGroups = g
      .selectAll('.tree-node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'tree-node')
      .attr(
        'transform',
        (d) =>
          `translate(${(d as unknown as D3HierarchyNode).x - NODE_W / 2}, ${(d as unknown as D3HierarchyNode).y - NODE_H / 2})`
      )
      .style('cursor', 'pointer')
      .on('click', (_event, d) => {
        window.location.href = `/node/${d.data.id}`;
      });

    // Node background rect
    const isCurrent = (d: d3.HierarchyNode<NodeData>) =>
      d.data.id === currentNodeId;

    nodeGroups
      .append('rect')
      .attr('width', NODE_W)
      .attr('height', NODE_H)
      .attr('rx', NODE_RX)
      .attr('fill', (d) => {
        if (isCurrent(d)) return '#2563eb';
        if (!d.parent) return '#f1f5f9';
        return '#ffffff';
      })
      .attr('stroke', (d) => {
        if (isCurrent(d)) return '#1d4ed8';
        if (!d.parent) return '#cbd5e1';
        return '#e2e8f0';
      })
      .attr('stroke-width', (d) => (isCurrent(d) ? 2.5 : 1.5))
      .attr('class', 'node-rect')
      .style('transition', 'fill 0.15s, stroke 0.15s');

    // Hover effect
    nodeGroups
      .on('mouseenter', function () {
        if (!currentNodeId || this.__data__?.data?.id !== currentNodeId) {
          d3.select(this)
            .select('.node-rect')
            .attr('fill', '#dbeafe')
            .attr('stroke', '#93c5fd');
        }
      })
      .on('mouseleave', function () {
        const d = this.__data__ as d3.HierarchyNode<NodeData>;
        d3.select(this)
          .select('.node-rect')
          .attr('fill', () => {
            if (d.data.id === currentNodeId) return '#2563eb';
            if (!d.parent) return '#f1f5f9';
            return '#ffffff';
          })
          .attr('stroke', () => {
            if (d.data.id === currentNodeId) return '#1d4ed8';
            if (!d.parent) return '#cbd5e1';
            return '#e2e8f0';
          });
      });

    // Node title text
    nodeGroups
      .append('text')
      .attr('x', NODE_W / 2)
      .attr('y', NODE_H / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', (d) => (isCurrent(d) ? '#ffffff' : '#1e293b'))
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .text((d) => {
        const title = d.data.title;
        return title.length > 10 ? title.slice(0, 9) + '…' : title;
      });

    // Current node indicator
    if (currentNodeId) {
      const currentData = root.descendants().find((d) => d.data.id === currentNodeId);
      if (currentData) {
        const node = currentData as unknown as D3HierarchyNode;
        g.append('circle')
          .attr('cx', node.x)
          .attr('cy', node.y - NODE_H / 2 - 8)
          .attr('r', 4)
          .attr('fill', '#2563eb')
          .attr('class', 'current-indicator');
      }
    }
  }, [nodes, currentNodeId, dimensions]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px] overflow-hidden"
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      {nodes.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400">
          暂无知识节点
        </div>
      )}
    </div>
  );
}
