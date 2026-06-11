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

const NODE_W = 136;
const NODE_H = 38;
const NODE_RX = 10;

/** Difficulty → color palette */
const DIFF_COLORS: Record<string, { bg: string; stroke: string; text: string }> = {
  beginner:   { bg: '#dcfce7', stroke: '#86efac', text: '#166534' },
  intermediate: { bg: '#dbeafe', stroke: '#93c5fd', text: '#1e40af' },
  advanced:  { bg: '#ede9fe', stroke: '#c4b5fd', text: '#5b21b6' },
};
const DIFF_COLORS_DARK: Record<string, { bg: string; stroke: string; text: string }> = {
  beginner:   { bg: '#064e3b', stroke: '#059669', text: '#86efac' },
  intermediate: { bg: '#1e3a5f', stroke: '#2563eb', text: '#93c5fd' },
  advanced:  { bg: '#3b1f6e', stroke: '#7c3aed', text: '#c4b5fd' },
};

const ROOT_BG = '#f8fafc';
const ROOT_STROKE = '#cbd5e1';
const ROOT_BG_DARK = '#1e293b';
const ROOT_STROKE_DARK = '#475569';

const CUR_BG = '#2563eb';
const CUR_STROKE = '#1d4ed8';
const CUR_TEXT = '#ffffff';

/**
 * Generate a rounded orthogonal (step) path between two points.
 * Corner radius is adaptive to the available space.
 */
function roundedStepPath(
  sx: number, sy: number,
  tx: number, ty: number,
): string {
  const gap = Math.abs(tx - sx);
  if (gap < 4) {
    // Nearly vertical — straight line
    return `M${sx},${sy}V${ty}`;
  }

  const dir = tx >= sx ? 1 : -1;
  const midY = (sy + ty) / 2;
  const r = Math.min(8, gap / 3, (ty - sy) / 5);

  return [
    `M${sx},${sy}`,
    `V${midY - r}`,
    `Q${sx},${midY} ${sx + dir * r},${midY}`,
    `H${tx - dir * r}`,
    `Q${tx},${midY} ${tx},${midY + r}`,
    `V${ty}`,
  ].join('');
}

// (shadow filters created dynamically inside renderTree)

export default function KnowledgeTreeReact({ nodes, currentNodeId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [ready, setReady] = useState(false);
  const dimsRef = useRef({ width: 800, height: 500 });

  // Mark as client-ready
  useEffect(() => { setReady(true); }, []);

  // Measure & render
  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const el = containerRef.current;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      dimsRef.current = { width: rect.width, height: rect.height };
    }
    renderTree();

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        dimsRef.current = { width: r.width, height: r.height };
        renderTree();
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ready]);

  const renderTree = useCallback(() => {
    const svgEl = svgRef.current;
    if (!svgEl || nodes.length === 0) return;

    const { width, height } = dimsRef.current;
    if (width < 100 || height < 100) return;

    // Detect dark mode
    const isDark = document.documentElement.classList.contains('dark');

    // ── Build hierarchy ──
    const validNodes = nodes.filter((n) => !n.parent || nodes.some((p) => p.id === n.parent));
    let root: d3.HierarchyNode<NodeData>;
    try {
      root = d3.stratify<NodeData>()
        .id((d) => d.id)
        .parentId((d) => (d.parent ? d.parent : null))(validNodes);
    } catch {
      return;
    }

    // ── Layout ──
    // Count max nodes per depth to auto-space crowded levels
    const depthCounts: Record<number, number> = {};
    root.each((d) => { depthCounts[d.depth] = (depthCounts[d.depth] || 0) + 1; });
    const maxAtDepth = Math.max(...Object.values(depthCounts), 1);

    // Dynamic sizing: each node gets at least (NODE_W + gap) px horizontally
    const MIN_NODE_GAP = NODE_W + 48;
    const layoutWidth = Math.max(width - 100, maxAtDepth * MIN_NODE_GAP);

    const treeLayout = d3.tree<NodeData>()
      .size([layoutWidth, height - 120])
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 2.2));
    treeLayout(root);

    // ── SVG ──
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    // Inject filter defs
    svg.node()?.appendChild(
      (document.importNode
        ? document.importNode(
            // Create shadow filter dynamically
            (() => {
              const xmlns = 'http://www.w3.org/2000/svg';
              const defs = document.createElementNS(xmlns, 'defs');

              const filter1 = document.createElementNS(xmlns, 'filter');
              filter1.setAttribute('id', 'kn-shadow');
              filter1.setAttribute('x', '-10%'); filter1.setAttribute('y', '-10%');
              filter1.setAttribute('width', '130%'); filter1.setAttribute('height', '130%');
              const fd1 = document.createElementNS(xmlns, 'feDropShadow');
              fd1.setAttribute('dx', '0'); fd1.setAttribute('dy', '2');
              fd1.setAttribute('stdDeviation', '3');
              fd1.setAttribute('flood-color', '#000'); fd1.setAttribute('flood-opacity', '0.12');
              filter1.appendChild(fd1);
              defs.appendChild(filter1);

              const filter2 = document.createElementNS(xmlns, 'filter');
              filter2.setAttribute('id', 'kn-shadow-current');
              filter2.setAttribute('x', '-20%'); filter2.setAttribute('y', '-20%');
              filter2.setAttribute('width', '150%'); filter2.setAttribute('height', '150%');
              const fd2 = document.createElementNS(xmlns, 'feDropShadow');
              fd2.setAttribute('dx', '0'); fd2.setAttribute('dy', '2');
              fd2.setAttribute('stdDeviation', '6');
              fd2.setAttribute('flood-color', '#2563eb'); fd2.setAttribute('flood-opacity', '0.4');
              filter2.appendChild(fd2);
              defs.appendChild(filter2);

              return defs;
            })(),
            true,
          )
        : null),
    );

    // ── Zoom ──
    const g = svg.append('g').attr('class', 'tree-group');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 4])
      .on('zoom', (event) => { g.attr('transform', event.transform); });
    svg.call(zoom);

    // Auto-fit: center tree horizontally, scale to fit width
    const extent = root as unknown as d3.HierarchyPointNode<NodeData>;
    const treeWidth = extent.x * 2 + NODE_W;
    const initScale = Math.min(1, Math.max(0.3, (width - 40) / Math.max(treeWidth, 80)));
    const initX = Math.max(20, (width - treeWidth * initScale) / 2);
    svg.call(zoom.transform, d3.zoomIdentity.translate(initX, 50).scale(initScale));

    // ── Rounded-step edges ──
    g.selectAll('.tree-edge')
      .data(root.links())
      .join('path')
      .attr('class', 'tree-edge')
      .attr('d', (d) => {
        const s = d.source as unknown as d3.HierarchyPointNode<NodeData>;
        const t = d.target as unknown as d3.HierarchyPointNode<NodeData>;
        return roundedStepPath(s.x, s.y + NODE_H / 2, t.x, t.y - NODE_H / 2);
      })
      .attr('fill', 'none')
      .attr('stroke', isDark ? '#334155' : '#94a3b8')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    // ── Node groups ──
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

    // ── Node rect ──
    nodeGroups.append('rect')
      .attr('width', NODE_W)
      .attr('height', NODE_H)
      .attr('rx', NODE_RX)
      .attr('fill', (d) => {
        if (d.data.id === currentNodeId) return CUR_BG;
        const diff = d.data.difficulty || 'beginner';
        const pal = isDark ? DIFF_COLORS_DARK : DIFF_COLORS;
        if (d.parent) return pal[diff]?.bg ?? pal.beginner.bg;
        return isDark ? ROOT_BG_DARK : ROOT_BG;
      })
      .attr('stroke', (d) => {
        if (d.data.id === currentNodeId) return CUR_STROKE;
        const diff = d.data.difficulty || 'beginner';
        const pal = isDark ? DIFF_COLORS_DARK : DIFF_COLORS;
        if (d.parent) return pal[diff]?.stroke ?? pal.beginner.stroke;
        return isDark ? ROOT_STROKE_DARK : ROOT_STROKE;
      })
      .attr('stroke-width', (d) => (d.data.id === currentNodeId ? 2.5 : 1.5))
      .attr('filter', (d) => (d.data.id === currentNodeId ? 'url(#kn-shadow-current)' : 'url(#kn-shadow)'));

    // ── Hover ──
    nodeGroups.on('mouseenter', function () {
      const d = (this as SVGGElement).__data__ as d3.HierarchyNode<NodeData>;
      if (d.data.id !== currentNodeId) {
        const rect = d3.select(this).select('rect');
        rect.attr('filter', null);
        rect.attr('stroke', '#60a5fa').attr('stroke-width', 2.5);
      }
    }).on('mouseleave', function () {
      const d = (this as SVGGElement).__data__ as d3.HierarchyNode<NodeData>;
      if (d.data.id !== currentNodeId) {
        const rect = d3.select(this).select('rect');
        rect.attr('filter', 'url(#kn-shadow)');
        const diff = d.data.difficulty || 'beginner';
        const pal = isDark ? DIFF_COLORS_DARK : DIFF_COLORS;
        const stroke = d.parent ? (pal[diff]?.stroke ?? pal.beginner.stroke) : (isDark ? ROOT_STROKE_DARK : ROOT_STROKE);
        rect.attr('stroke', stroke).attr('stroke-width', 1.5);
      }
    });

    // ── Difficulty dot (left side) ──
    nodeGroups.append('circle')
      .attr('cx', 10)
      .attr('cy', NODE_H / 2)
      .attr('r', 4)
      .attr('fill', (d) => {
        if (d.data.id === currentNodeId) return '#ffffff';
        const diff = d.data.difficulty || 'beginner';
        const pal = isDark ? DIFF_COLORS_DARK : DIFF_COLORS;
        if (d.parent) return pal[diff]?.stroke ?? pal.beginner.stroke;
        return isDark ? ROOT_STROKE_DARK : ROOT_STROKE;
      })
      .attr('opacity', 0.7);

    // ── Text ──
    nodeGroups.append('text')
      .attr('x', 20)
      .attr('y', NODE_H / 2)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'central')
      .attr('fill', (d) => (d.data.id === currentNodeId ? CUR_TEXT : (isDark ? '#f1f5f9' : '#1e293b')))
      .attr('font-size', '12.5px')
      .attr('font-weight', '600')
      .text((d) => {
        const t = d.data.title;
        return t.length > 10 ? t.slice(0, 9) + '…' : t;
      });

    // ── Child count badge (right side) ──
    nodeGroups.each(function (d) {
      const childCount = d.children?.length ?? 0;
      if (childCount === 0) return;

      const group = d3.select(this);
      const badge = group.append('g')
        .attr('transform', `translate(${NODE_W - 16},${NODE_H / 2})`);

      badge.append('circle')
        .attr('r', 8)
        .attr('fill', d.data.id === currentNodeId ? 'rgba(255,255,255,0.2)' : (isDark ? '#374151' : '#e2e8f0'));

      badge.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .attr('fill', d.data.id === currentNodeId ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'))
        .text(childCount);
    });

    // ── Current-node indicator ──
    if (currentNodeId) {
      const cur = root.descendants().find((d) => d.data.id === currentNodeId);
      if (cur) {
        const p = cur as unknown as d3.HierarchyPointNode<NodeData>;
        g.append('rect')
          .attr('x', p.x - 16)
          .attr('y', p.y - NODE_H / 2 - 12)
          .attr('width', 32)
          .attr('height', 6)
          .attr('rx', 3)
          .attr('fill', CUR_BG);
      }
    }
  }, [nodes, currentNodeId]);

  useEffect(() => {
    if (!ready) return;
    renderTree();
  }, [ready, renderTree]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] overflow-hidden">
      {ready ? (
        <svg ref={svgRef} className="w-full h-full block" style={{ overflow: 'visible' }} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          <span className="animate-pulse">🌳 加载知识树...</span>
        </div>
      )}
    </div>
  );
}
