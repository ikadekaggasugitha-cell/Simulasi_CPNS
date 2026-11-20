import React from 'react';

const ALLOWED_SVG_TAGS = new Set([
  'svg',
  'g',
  'rect',
  'circle',
  'ellipse',
  'line',
  'polygon',
  'polyline',
  'path',
  'text',
  'defs',
  'pattern',
]);

const ATTR_TO_REACT_PROP: Record<string, string> = {
  viewbox: 'viewBox',
  x: 'x',
  y: 'y',
  x1: 'x1',
  y1: 'y1',
  x2: 'x2',
  y2: 'y2',
  cx: 'cx',
  cy: 'cy',
  r: 'r',
  rx: 'rx',
  ry: 'ry',
  width: 'width',
  height: 'height',
  d: 'd',
  points: 'points',
  fill: 'fill',
  stroke: 'stroke',
  'stroke-width': 'strokeWidth',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  opacity: 'opacity',
  'fill-opacity': 'fillOpacity',
  transform: 'transform',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'font-family': 'fontFamily',
  id: 'id',
  patternunits: 'patternUnits',
  patterntransform: 'patternTransform',
};

export function containsSvgMarkup(text: string): boolean {
  return /<svg\b[\s\S]*?<\/svg>/i.test(text);
}

function isSafeAttrValue(prop: string, val: string): boolean {
  const lower = val.trim().toLowerCase();
  if (lower.includes('javascript:') || lower.includes('data:') || lower.includes('expression(')) {
    return false;
  }
  if (prop === 'fill' || prop === 'stroke') {
    // Allow hex, rgb, named colors, none, or local url(#id)
    if (lower.startsWith('url(') && !/^url\(#[a-z0-9_-]+\)$/i.test(val.trim())) {
      return false;
    }
  }
  return true;
}

function convertDomNodeToReact(node: Node, key: string): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  if (!ALLOWED_SVG_TAGS.has(tag)) {
    return null;
  }

  const props: Record<string, unknown> = { key };
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    const reactProp = ATTR_TO_REACT_PROP[attr.name.toLowerCase()];
    if (!reactProp) continue;
    if (!isSafeAttrValue(reactProp, attr.value)) continue;
    props[reactProp] = attr.value;
  }

  if (tag === 'svg') {
    props.className = 'w-full h-full block';
    props.role = 'img';
    props['aria-label'] = 'Diagram figural TIU';
    if (!props.viewBox) {
      props.viewBox = '0 0 100 100';
    }
  }

  const children: React.ReactNode[] = [];
  for (let i = 0; i < el.childNodes.length; i++) {
    const child = convertDomNodeToReact(el.childNodes[i], `${key}-${i}`);
    if (child !== null && child !== undefined) {
      children.push(child);
    }
  }

  return React.createElement(tag, props, children.length > 0 ? children : undefined);
}

const SafeInlineSvg: React.FC<{ svgMarkup: string; boxClassName: string }> = ({
  svgMarkup,
  boxClassName,
}) => {
  const rendered = React.useMemo(() => {
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
      return null;
    }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgMarkup, 'image/svg+xml');
      const root = doc.documentElement;
      if (!root || root.tagName.toLowerCase() !== 'svg') {
        return null;
      }
      return convertDomNodeToReact(root, 'svg-root');
    } catch {
      return null;
    }
  }, [svgMarkup]);

  if (!rendered) {
    return null;
  }

  return <div className={boxClassName}>{rendered}</div>;
};

interface RichQuestionContentProps {
  content: string;
  variant?: 'prompt' | 'option' | 'compact';
  className?: string;
}

export const RichQuestionContent: React.FC<RichQuestionContentProps> = ({
  content,
  variant = 'prompt',
  className = '',
}) => {
  if (!containsSvgMarkup(content)) {
    return <span className={className}>{content}</span>;
  }

  const parts = content.split(/(<svg\b[\s\S]*?<\/svg>)/gi);

  if (variant === 'option') {
    return (
      <div className={`flex flex-col items-center justify-center gap-1.5 ${className}`}>
        {parts.map((part, idx) => {
          const trimmed = part.trim();
          if (!trimmed) return null;
          if (/^<svg\b/i.test(trimmed)) {
            return (
              <SafeInlineSvg
                key={idx}
                svgMarkup={trimmed}
                boxClassName="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-slate-200 bg-white p-1.5 shrink-0"
              />
            );
          }
          return (
            <span key={idx} className="text-xs font-medium text-slate-600 text-center">
              {trimmed}
            </span>
          );
        })}
      </div>
    );
  }

  const boxSize =
    variant === 'compact'
      ? 'w-14 h-14 rounded-md border border-slate-200 bg-white p-1 shrink-0'
      : 'w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-slate-200 bg-white p-1.5 shadow-2xs shrink-0';

  // Split into lines so introductory prose renders cleanly above the SVG sequence strip
  const lines = content.split('\n');

  return (
    <div className={`space-y-2.5 ${className}`}>
      {lines.map((line, lineIdx) => {
        if (!line.trim()) return null;
        if (!containsSvgMarkup(line)) {
          return (
            <p key={lineIdx} className="leading-relaxed">
              {line}
            </p>
          );
        }

        const lineParts = line.split(/(<svg\b[\s\S]*?<\/svg>)/gi);
        return (
          <div
            key={lineIdx}
            className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-0.5"
          >
            {lineParts.map((part, pIdx) => {
              const trimmed = part.trim();
              if (!trimmed) return null;
              if (/^<svg\b/i.test(trimmed)) {
                return (
                  <SafeInlineSvg
                    key={pIdx}
                    svgMarkup={trimmed}
                    boxClassName={boxSize}
                  />
                );
              }
              const isPlaceholder = /^\[?\s*\?\s*\]?$/.test(trimmed);
              if (isPlaceholder) {
                return (
                  <div
                    key={pIdx}
                    className={`${
                      variant === 'compact' ? 'w-14 h-14 text-base' : 'w-20 h-20 sm:w-24 sm:h-24 text-2xl'
                    } rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50 flex items-center justify-center font-mono font-bold text-blue-900 shrink-0`}
                  >
                    ?
                  </div>
                );
              }
              return (
                <span
                  key={pIdx}
                  className="font-mono font-bold text-slate-500 text-sm sm:text-base px-0.5"
                >
                  {trimmed}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
