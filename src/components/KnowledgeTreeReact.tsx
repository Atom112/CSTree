import React, { useRef, useEffect, useState, useCallback } from 'react';

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

// ============================================================
//  Constants
// ============================================================
const PADDING = 12;
const NODE_H = 22;
const NODE_W = 80;
const BUNDLE_W = 14;
const LEVEL_Y_PAD = 48;
const METRO_D = 4;
const MIN_FAMILY_H = 48;
const C = 16;
const BIG_C = NODE_W + C;

const DIFF_COLORS: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#3b82f6',
  advanced: '#8b5cf6',
};
const DIFF_COLORS_DARK: Record<string, string> = {
  beginner: '#4ade80',
  intermediate: '#60a5fa',
  advanced: '#a78bfa',
};
const DIFF_LABELS: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
};
const ROOT_LINE = '#94a3b8';
const CUR_COLOR = '#2563eb';

type TNode = any;

// ============================================================
//  buildLevels — flat node list → levels[][]
// ============================================================
function buildLevels(nodes: NodeData[]) {
  const parentMap = new Map<string, string | null>();
  nodes.forEach((n) => parentMap.set(n.id, n.parent ?? null));

  // ── Inject virtual "CSTree" root if there are multiple section roots ──
  const sectionRoots = nodes.filter((n) => !n.parent);
  let hasVirtualRoot = false;
  if (sectionRoots.length > 1) {
    hasVirtualRoot = true;
    const vid = '__cstree_root__';
    parentMap.set(vid, null);
    sectionRoots.forEach((n) => parentMap.set(n.id, vid));
  }

  function getDepth(id: string, memo: Map<string, number>): number {
    if (memo.has(id)) return memo.get(id)!;
    const p = parentMap.get(id);
    if (!p) { memo.set(id, 0); return 0; }
    const d = getDepth(p, memo) + 1;
    memo.set(id, d);
    return d;
  }

  const depthMemo = new Map<string, number>();
  const byDepth = new Map<number, TNode[]>();

  // Create virtual root node first
  if (hasVirtualRoot) {
    byDepth.set(0, [{
      id: '__cstree_root__',
      title: 'CSTree',
      level: 0,
      parents: [],
      height: 0, x: 0, y: 0,
      difficulty: 'beginner',
      bundles: [],
      bundles_index: {},
      bundle: undefined,
      isVirtual: true,
    }]);
    depthMemo.set('__cstree_root__', 0);
  }

  nodes.forEach((n) => {
    const d = getDepth(n.id, depthMemo);
    const internal: TNode = {
      id: n.id,
      title: n.title,
      level: d,
      parents: parentMap.get(n.id) ? [parentMap.get(n.id)!] : [],
      height: 0, x: 0, y: 0,
      difficulty: n.difficulty || 'beginner',
      bundles: [], bundles_index: {},
      bundle: undefined,
      isVirtual: false,
    };
    if (!byDepth.has(d)) byDepth.set(d, []);
    byDepth.get(d)!.push(internal);
  });

  const maxD = Math.max(...byDepth.keys());
  const levels: TNode[][] = [];
  for (let d = 0; d <= maxD; d++) levels.push(byDepth.get(d) || []);

  const nodeIndex: Record<string, TNode> = {};
  levels.forEach((l) => l.forEach((n) => (nodeIndex[n.id] = n)));

  return { levels, nodeIndex };
}

// ============================================================
//  tangledLayout — full Tangled Tree layout algorithm
// ============================================================
function tangledLayout(levels: any[], nodeIndex: Record<string, TNode>, isDark: boolean) {
  // 1. Objectify parents
  levels.forEach((l) => l.forEach((n: TNode) => {
    n.parents = n.parents.map((pid: string) => nodeIndex[pid]).filter(Boolean);
  }));

  // 2. Bundles per level
  levels.forEach((l, i) => {
    const idx: Record<string, any> = {};
    l.forEach((n: TNode) => {
      if (n.parents.length === 0) return;
      const key = n.parents.map((p: TNode) => p.id).sort().join('-X-');
      if (key in idx) {
        idx[key].parents = idx[key].parents.concat(n.parents);
      } else {
        idx[key] = {
          id: key, parents: n.parents.slice(), level: i,
          span: i - Math.min(...n.parents.map((p: TNode) => p.level)),
          links: [],
        };
      }
      n.bundle = idx[key];
    });
    l.bundles = Object.keys(idx).map((k) => idx[k]);
    l.bundles.forEach((b: any, i: number) => (b.i = i));
  });

  // 3. Links
  const links: any[] = [];
  levels.forEach((l) => l.forEach((n: TNode) => n.parents.forEach((p: TNode) => links.push({ source: n, bundle: n.bundle, target: p }))));

  // 4. All bundles
  const allBundles: any[] = [];
  levels.forEach((l) => allBundles.push(...l.bundles));

  // 5. Reverse index (parent → bundles)
  allBundles.forEach((b) => b.parents.forEach((p: TNode) => {
    if (!p.bundles_index) p.bundles_index = {};
    if (!(b.id in p.bundles_index)) p.bundles_index[b.id] = [];
    p.bundles_index[b.id].push(b);
  }));

  // 6. Sort bundles by span
  Object.values(nodeIndex).forEach((n: TNode) => {
    if (n.bundles_index) {
      n.bundles = Object.keys(n.bundles_index).map((k) => n.bundles_index[k]);
      n.bundles.sort((a: any, b: any) => Math.max(...b.map((d: any) => d.span)) - Math.max(...a.map((d: any) => d.span)));
      n.bundles.forEach((b: any, i: number) => (b.i = i));
    } else {
      n.bundles_index = {};
      n.bundles = [];
    }
  });

  // 7. Wire links
  links.forEach((l) => l.bundle.links.push(l));

  // 8. Node heights
  Object.values(nodeIndex).forEach((n: TNode) => (n.height = (Math.max(1, n.bundles.length) - 1) * METRO_D));

  // 9. Position nodes
  let xOff = PADDING, yOff = PADDING;
  levels.forEach((l) => {
    xOff += l.bundles.length * BUNDLE_W;
    yOff += LEVEL_Y_PAD;
    l.forEach((n: TNode) => {
      n.x = n.level * NODE_W + xOff;
      n.y = NODE_H + yOff + n.height / 2;
      yOff += NODE_H + n.height;
    });
  });

  // 10. Position bundles
  let nodeCnt = 0;
  levels.forEach((l) => {
    l.bundles.forEach((b: any) => {
      b.x = Math.max(...b.parents.map((p: TNode) => p.x)) + NODE_W + (l.bundles.length - 1 - b.i) * BUNDLE_W;
      b.y = nodeCnt * NODE_H;
    });
    nodeCnt += l.length;
  });

  // 11. Link geometry (first pass)
  links.forEach((l: any) => {
    l.xt = l.target.x;
    l.yt = (l.target.bundles_index[l.bundle.id]?.i ?? 0) * METRO_D - (l.target.bundles.length * METRO_D) / 2 + METRO_D / 2 + l.target.y;
    l.xb = l.bundle.x;
    l.yb = l.bundle.y;
    l.xs = l.source.x;
    l.ys = l.source.y;
  });

  // 12. Vertical compression
  let yCompress = 0;
  levels.forEach((l) => {
    const minGap = l.bundles.length > 0
      ? Math.min(...l.bundles.map((b: any) => Math.min(...b.links.map((lk: any) => lk.ys - 2 * C - (lk.yt + C)))))
      : 0;
    if (l.bundles.length > 0) yCompress += -MIN_FAMILY_H + minGap;
    l.forEach((n: TNode) => (n.y -= yCompress));
  });

  // 13. Link geometry (second pass)
  links.forEach((l: any) => {
    l.yt = (l.target.bundles_index[l.bundle.id]?.i ?? 0) * METRO_D - (l.target.bundles.length * METRO_D) / 2 + METRO_D / 2 + l.target.y;
    l.ys = l.source.y;
    l.c1 = (l.source.level - l.target.level) > 1 ? Math.min(BIG_C, l.xb - l.xt, l.yb - l.yt) - C : C;
    l.c2 = C;
  });

  // 14. Final dimensions
  const allX = Object.values(nodeIndex).map((n: TNode) => n.x);
  const allY = Object.values(nodeIndex).map((n: TNode) => n.y);
  const layout = {
    width: Math.max(...allX, 0) + NODE_W + 2 * PADDING,
    height: Math.max(...allY, 0) + NODE_H / 2 + 2 * PADDING,
  };

  // 16. Bundle colors (from parent difficulty)
  const palette = isDark ? DIFF_COLORS_DARK : DIFF_COLORS;
  allBundles.forEach((b: any) => {
    const parentDiff = b.parents.length > 0 ? b.parents[0].difficulty || 'beginner' : 'beginner';
    b.color = palette[parentDiff] || palette.beginner;
  });

  return { levels, nodes: Object.values(nodeIndex), links, bundles: allBundles, layout, nodeIndex };
}

// ============================================================
//  React component
// ============================================================
export default function KnowledgeTreeReact({ nodes, currentNodeId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const layoutRef = useRef<any>(null);
  const viewRef = useRef({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef<{ sx: number; sy: number; vx: number; vy: number; moved: boolean } | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const nodeIndexRef = useRef<Record<string, TNode>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  // ---- Apply current view transform to the SVG content group ----
  const applyView = useCallback(() => {
    const g = svgRef.current?.querySelector('.tree-content') as SVGGElement;
    if (!g) return;
    const v = viewRef.current;
    g.setAttribute('transform', `translate(${v.x},${v.y}) scale(${v.scale})`);
  }, []);

  // ---- Compute layout, render content, auto-fit ----
  const renderTree = useCallback(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container || nodes.length === 0) return;

    const isDark = document.documentElement.classList.contains('dark');
    const { levels, nodeIndex } = buildLevels(nodes);
    const tl = tangledLayout(levels, nodeIndex, isDark);
    layoutRef.current = tl;
    nodeIndexRef.current = tl.nodeIndex;

    // Build SVG content
    const pal = isDark ? DIFF_COLORS_DARK : DIFF_COLORS;
    let html = `<style>
      .tree-content { vector-effect: non-scaling-stroke; }
      .link { fill: none; transition: opacity 0.2s; }
      .link-bg { stroke: #ffffff; }
      .dark .link-bg { stroke: #111827; }
      .node-group { cursor: pointer; transition: opacity 0.2s; }
      .virtual-root { cursor: default; }
      .node-hit { fill: transparent; }
      .node-line { stroke-linecap: round; vector-effect: non-scaling-stroke; transition: stroke-width 0.2s; }
      .node-text { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; user-select: none; }
      .badge-text { font-family: system-ui, sans-serif; font-size: 9px; font-weight: 700; user-select: none; }
      .dark .node-text { fill: #cbd5e1 !important; }
      .dark .badge-text { fill: #94a3b8 !important; }
      /* 🌟 Hover path highlighting */
      .node-group.dimmed { opacity: 0.15 !important; }
      .node-group.dimmed .node-line { stroke-width: 1.5 !important; }
      .link.dimmed { opacity: 0.06 !important; }
      .node-group.highlighted .node-line { stroke-width: 4.5 !important; filter: brightness(1.2); }
      .node-group.highlighted > text.node-text { font-size: 13px; }
      .link.highlighted { opacity: 1 !important; }
      .link.highlighted + .link.highlighted { stroke-width: 3 !important; }
    </style>
    <g class="tree-content">`;

    // Bundles (edges)
    tl.bundles.forEach((b: any) => {
      b.links.forEach((l: any) => {
        let d = `M${l.xt} ${l.yt}L${l.xb - l.c1} ${l.yt}A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}L${l.xb} ${l.ys - l.c2}A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}L${l.xs} ${l.ys}`;
        const sid = l.source?.id || '';
        const tid = l.target?.id || '';
        html += `<path class="link link-bg" d="${d}" stroke-width="5" data-sid="${sid}" data-tid="${tid}"/>`;
        html += `<path class="link" d="${d}" stroke="${b.color}" stroke-width="2" data-sid="${sid}" data-tid="${tid}"/>`;
      });
    });

    // Nodes
    tl.nodes.forEach((n: TNode) => {
      const isVirtual = n.isVirtual;
      const isCurrent = n.id === currentNodeId;

      if (isVirtual) {
        // ── Virtual root: special rendering (no click, distinct style) ──
        const vx = n.x, vy = n.y;
        const cFill = isDark ? '#1e293b' : '#f1f5f9';
        const cStroke = isDark ? '#475569' : '#94a3b8';
        const cText = isDark ? '#f1f5f9' : '#1e293b';
        html += `<g class="virtual-root" style="cursor:default">`;
        // Background pill for the root label
        html += `<rect x="${vx - 32}" y="${vy - 12}" width="64" height="24" rx="12" fill="${cFill}" stroke="${cStroke}" stroke-width="1.5"/>`;
        html += `<text x="${vx}" y="${vy + 4}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12px" font-weight="700" fill="${cText}">CSTree</text>`;
        html += `</g>`;
        return;
      }

      const lineColor = isCurrent ? CUR_COLOR : n.parents.length === 0 ? ROOT_LINE : (pal[n.difficulty] || pal.beginner);
      const lineY1 = n.y - n.height / 2;
      const lineY2 = n.y + n.height / 2;
      const label = n.title.length > 10 ? n.title.slice(0, 9) + '…' : n.title;
      const childCount = Object.values(nodeIndex).filter((nd: any) => nd.parents.some((p: TNode) => p.id === n.id)).length;

      // Hit area rect (large click target)
      const hitX = n.x - 8;
      const hitY = lineY1 - 22;
      const hitW = NODE_W + 20;
      const hitH = Math.max(lineY2 - lineY1 + 28, 36);

      html += `<g class="node-group">`;
      html += `<rect class="node-hit" data-id="${n.id}" x="${hitX}" y="${hitY}" width="${hitW}" height="${hitH}" rx="6"/>`;

      // Visible node line
      const lineW = isCurrent ? 4 : 2.5;
      html += `<path class="node-line" stroke="${lineColor}" stroke-width="${lineW}" d="M${n.x} ${lineY1} L${n.x} ${lineY2}"/>`;

      // Difficulty dot at top (larger for leaf nodes)
      const isLeaf = childCount === 0;
      html += `<circle cx="${n.x}" cy="${lineY1}" r="${isLeaf ? 6 : 4}" fill="${lineColor}" opacity="0.9"/>`;

      // Current node indicator (small blue bar above dot)
      if (isCurrent) {
        html += `<rect x="${n.x - 12}" y="${lineY1 - 10}" width="24" height="4" rx="2" fill="${CUR_COLOR}"/>`;
      }

      // Label text
      html += `<text class="node-text" data-id="${n.id}" x="${n.x + 8}" y="${lineY1 - 5}" fill="${isDark ? '#cbd5e1' : '#334155'}">${label}</text>`;

      // Child count badge
      if (childCount > 0) {
        html += `<circle cx="${n.x}" cy="${lineY2}" r="7" fill="${isDark ? '#374151' : '#e2e8f0'}" stroke="${lineColor}" stroke-width="1"/>`;
        html += `<text class="badge-text" x="${n.x}" y="${lineY2}" text-anchor="middle" dominant-baseline="central" fill="${isDark ? '#94a3b8' : '#64748b'}">${childCount}</text>`;
      }

      html += `</g>`;
    });

    html += `</g>`;
    svg.innerHTML = html;

    // Auto-fit
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const fitS = Math.min((containerW - 40) / Math.max(tl.layout.width, 100), (containerH - 40) / Math.max(tl.layout.height, 100), 1);
    const initScale = Math.max(0.15, fitS);
    viewRef.current = { x: (containerW - tl.layout.width * initScale) / 2, y: 30, scale: initScale };
    applyView();
  }, [nodes, currentNodeId, applyView]);

  // ---- Re-render when ready ----
  useEffect(() => {
    if (!ready) return;
    renderTree();
  }, [ready, renderTree]);

  // ---- Hover path highlighting helpers ----
  const getAncestorSet = useCallback((id: string): Set<string> => {
    const ancestors = new Set<string>();
    let cur: string | undefined = id;
    while (cur) {
      ancestors.add(cur);
      const nd: any = nodeIndexRef.current[cur];
      if (!nd || !nd.parents || nd.parents.length === 0) break;
      cur = nd.parents[0]?.id;
    }
    return ancestors;
  }, []);

  const highlightPath = useCallback((id: string) => {
    const ancestors = getAncestorSet(id);
    const svg = svgRef.current;
    if (!svg) return;

    svg.querySelectorAll<SVGGElement>('.node-group[data-id]').forEach((el) => {
      const nid = el.getAttribute('data-id');
      if (!nid || nid === '__cstree_root__') return;
      if (ancestors.has(nid)) {
        el.classList.remove('dimmed');
        el.classList.add('highlighted');
      } else {
        el.classList.add('dimmed');
        el.classList.remove('highlighted');
      }
    });

    svg.querySelectorAll<SVGPathElement>('.link[data-sid]').forEach((el) => {
      const sid = el.getAttribute('data-sid');
      const tid = el.getAttribute('data-tid');
      if ((sid && ancestors.has(sid)) || (tid && ancestors.has(tid))) {
        el.classList.remove('dimmed');
        el.classList.add('highlighted');
      } else {
        el.classList.add('dimmed');
        el.classList.remove('highlighted');
      }
    });
  }, [getAncestorSet]);

  const clearHighlights = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.querySelectorAll<SVGGElement>('.node-group.dimmed, .node-group.highlighted').forEach((el) => {
      el.classList.remove('dimmed', 'highlighted');
    });
    svg.querySelectorAll<SVGPathElement>('.link.dimmed, .link.highlighted').forEach((el) => {
      el.classList.remove('dimmed', 'highlighted');
    });
    hoveredIdRef.current = null;
  }, []);

  // ---- Zoom / Pan event handlers ----
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !ready) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const v = viewRef.current;
      const delta = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      const ns = Math.max(0.15, Math.min(4, v.scale * delta));
      viewRef.current = {
        x: mx - (mx - v.x) * (ns / v.scale),
        y: my - (my - v.y) * (ns / v.scale),
        scale: ns,
      };
      applyView();
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      dragRef.current = { sx: e.clientX, sy: e.clientY, vx: viewRef.current.x, vy: viewRef.current.y, moved: false };
      svg.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.sx;
      const dy = e.clientY - dragRef.current.sy;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragRef.current.moved = true;
      if (dragRef.current.moved) {
        viewRef.current.x = dragRef.current.vx + dx;
        viewRef.current.y = dragRef.current.vy + dy;
        applyView();
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const wasDrag = dragRef.current.moved;
      const target = e.target as Element;
      dragRef.current = null;
      svg.style.cursor = 'default';

      if (!wasDrag) {
        // Click: find data-id on the target or a parent (skip virtual root)
        const el = target.closest('[data-id]') as HTMLElement | null;
        if (el) {
          const id = el.getAttribute('data-id');
          if (id && id !== '__cstree_root__') window.location.href = `/node/${id}`;
        }
      }
    };

    const handleMouseLeave = () => {
      dragRef.current = null;
      svg.style.cursor = 'default';
      clearHighlights();
    };

    const handleMouseOver = (e: MouseEvent) => {
      // Ignore during drag
      if (dragRef.current?.moved) return;
      const target = e.target as Element;
      const group = target.closest('[data-id]') as HTMLElement | null;
      if (!group) return;
      const id = group.getAttribute('data-id');
      if (!id || id === '__cstree_root__') return;
      if (id === hoveredIdRef.current) return;
      hoveredIdRef.current = id;
      highlightPath(id);
    };

    svg.addEventListener('wheel', handleWheel, { passive: false });
    svg.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    svg.addEventListener('mouseleave', handleMouseLeave);
    svg.addEventListener('mouseover', handleMouseOver);

    return () => {
      svg.removeEventListener('wheel', handleWheel);
      svg.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      svg.removeEventListener('mouseleave', handleMouseLeave);
      svg.removeEventListener('mouseover', handleMouseOver);
    };
  }, [ready, applyView, highlightPath, clearHighlights]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] relative overflow-hidden">
      {ready ? (
        <>
          <svg ref={svgRef} className="w-full h-full block" style={{ cursor: 'default', background: 'transparent' }} />

          {/* ── Fixed legend (top-right, outside zoom/pan) ── */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 px-3 py-2 rounded-lg text-xs select-none pointer-events-none z-10
            bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm border border-black/10 dark:border-white/10">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
              const c = DIFF_COLORS[level];
              return (
                <div key={level} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span style={{
                    display: 'inline-block',
                    width: 10, height: 10,
                    borderRadius: '50%',
                    backgroundColor: c,
                    opacity: 0.85,
                  }} />
                  <span>{DIFF_LABELS[level]}</span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          <span className="animate-pulse">🌳 加载知识树...</span>
        </div>
      )}
    </div>
  );
}
