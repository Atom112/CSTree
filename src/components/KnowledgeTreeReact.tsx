import React, { useRef, useEffect, useState, useCallback } from 'react';
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

interface D3PointNode {
  x: number;
  y: number;
  children?: D3PointNode[];
  data: NodeData;
}

const NODE_W = 130;
const NODE_H = 36;
const NODE_RX = 8;

export default function KnowledgeTreeReact({ nodes, currentNodeId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [ready, setReady] = useState(false);
  const dimsRef = useRef({ width: 800, height: 500 });

  // Mark as client-ready (skip SSR hydration mismatch)
  useEffect(() => {
    setReady(true);
  }, []);

  // Measure container
  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const el = containerRef.current;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      dimsRef.current = { width: rect.width, height: rect.height };
    }

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          dimsRef.current = { width, height };
          renderTree();
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ready]);

  // Build and render the D3 tree
  const renderTree = useCallback(() => {
    const svgEl = svgRef.current;
    if (!svgEl || nodes.length === 0) return;

    const { width, height } = dimsRef.current;
    if (width < 100 || height < 100) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    // Filter to valid parent references
    const validNodes = nodes.filter((n) => {
      if (!n.parent) return true;
      return nodes.some((p) => p.id === n.parent);
    });

    // Build hierarchy
    let root: d3.HierarchyNode<NodeData>;
    try {
      root = d3
        .stratify<NodeData>()
        .id((d) => d.id)
        .parentId((d) => (d.parent ? d.parent : null))
        (validNodes);
    } catch {
      svg.append('text')
        .attr('x', width / 2).attr('y', height / 2)
        .attr('text-anchor', 'middle').attr('fill', '#999')
        .text('无法构建知识树层次结构');
      return;
    }

    // Tree layout
    const treeLayout = d3.tree<NodeData>()
      .size([width - 80, height - 100])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 2));

    treeLayout(root);

    // Main group for zoom/pan
    const g = svg.append('g').attr('class', 'tree-group');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => { g.attr('transform', event.transform); });
    svg.call(zoom);

    // Auto-fit: center the tree
    const extent = (root as unknown as d3.HierarchyPointNode<NodeData>);
    const treeWidth = extent.x * 2 + 80;
    const initScale = Math.min(1, (width - 40) / Math.max(treeWidth, 80));
    const initX = Math.max(40, (width - treeWidth * initScale) / 2);
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(initX, 40).scale(initScale)
    );

    // Link generator
    const linkGen = d3.linkHorizontal<[number, number], [number, number]>()
      .x((d) => d[0])
      .y((d) => d[1]);

    // Links (edges)
    g.selectAll('.tree-edge')
      .data(root.links())
      .join('path')
      .attr('class', 'tree-edge')
      .attr('d', (d) => {
        const s = d.source as unknown as d3.HierarchyPointNode<NodeData>;
        const t = d.target as unknown as d3.HierarchyPointNode<NodeData>;
        return linkGen({ source: [s.x, s.y + NODE_H / 2], target: [t.x, t.y - NODE_H / 2] });
      })
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);

    // Node groups
    const nodeGroups = g.selectAll('.tree-node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'tree-node')
      .attr('transform', (d) => {
        const p = d as unknown as d3.HierarchyPointNode<NodeData>;
        return `translate(${p.x - NODE_W / 2},${p.y - NODE_H / 2})`;
      })
      .style('cursor', 'pointer')
      .on('click', (_e, d) => { window.location.href = `/node/${d.data.id}`; });

    // Rect for each node
    nodeGroups.append('rect')
      .attr('width', NODE_W)
      .attr('height', NODE_H)
      .attr('rx', NODE_RX)
      .attr('fill', (d) => {
        if (d.data.id === currentNodeId) return '#2563eb';
        if (!d.parent) return '#f1f5f9';
        return '#ffffff';
      })
      .attr('stroke', (d) => {
        if (d.data.id === currentNodeId) return '#1d4ed8';
        if (!d.parent) return '#cbd5e1';
        return '#e2e8f0';
      })
      .attr('stroke-width', (d) => (d.data.id === currentNodeId ? 2.5 : 1.5))
      .attr('class', 'node-rect');

    // Hover
    nodeGroups.on('mouseenter', function () {
      const d = (this as SVGGElement).__data__ as d3.HierarchyNode<NodeData>;
      if (d.data.id !== currentNodeId) {
        d3.select(this).select('.node-rect')
          .attr('fill', '#dbeafe').attr('stroke', '#93c5fd');
      }
    }).on('mouseleave', function () {
      const d = (this as SVGGElement).__data__ as d3.HierarchyNode<NodeData>;
      d3.select(this).select('.node-rect')
        .attr('fill', d.data.id === currentNodeId ? '#2563eb' : (!d.parent ? '#f1f5f9' : '#ffffff'))
        .attr('stroke', d.data.id === currentNodeId ? '#1d4ed8' : (!d.parent ? '#cbd5e1' : '#e2e8f0'));
    });

    // Text label
    nodeGroups.append('text')
      .attr('x', NODE_W / 2)
      .attr('y', NODE_H / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', (d) => (d.data.id === currentNodeId ? '#ffffff' : '#1e293b'))
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .text((d) => (d.data.title.length > 10 ? d.data.title.slice(0, 9) + '…' : d.data.title));

    // Current-node dot indicator
    if (currentNodeId) {
      const cur = root.descendants().find((d) => d.data.id === currentNodeId);
      if (cur) {
        const p = cur as unknown as d3.HierarchyPointNode<NodeData>;
        g.append('circle')
          .attr('cx', p.x).attr('cy', p.y - NODE_H / 2 - 8)
          .attr('r', 4).attr('fill', '#2563eb');
      }
    }
  }, [nodes, currentNodeId]);

  // Render tree when ready
  useEffect(() => {
    if (!ready) return;
    renderTree();
  }, [ready, renderTree]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] overflow-hidden">
      {ready ? (
        <svg ref={svgRef} className="w-full h-full block" />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          加载知识树...
        </div>
      )}
    </div>
  );
}
