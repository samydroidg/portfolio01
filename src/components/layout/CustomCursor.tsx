import { useEffect, useRef, useState } from 'react';

type CursorVariant = 'default' | 'button' | 'link' | 'image' | 'project' | 'text';

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const dot = useRef({ x: 0, y: 0 });
  const ringEl = useRef<HTMLDivElement>(null);
  const dotEl = useRef<HTMLDivElement>(null);
  const glowEl = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const handleMouse = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, [role="button"]');
      const isInput = target.closest('input, textarea, select');
      const isImage = target.closest('img, [class*="cover"]');
      const isProject = target.closest('[class*="project"], [class*="Project"]');

      if (clickable && isProject) setVariant('project');
      else if (clickable || isInput) setVariant('button');
      else if (isImage) setVariant('image');
      else if (target.closest('p, h1, h2, h3, h4, span, label')) setVariant('text');
      else setVariant('default');
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      dot.current.x += (pos.current.x - dot.current.x) * 0.35;
      dot.current.y += (pos.current.y - dot.current.y) * 0.35;

      if (ringEl.current) {
        ringEl.current.style.transform = `translate(${ring.current.x - 14}px, ${ring.current.y - 14}px)`;
      }
      if (dotEl.current) {
        dotEl.current.style.transform = `translate(${dot.current.x - 4}px, ${dot.current.y - 4}px)`;
      }
      if (glowEl.current) {
        glowEl.current.style.transform = `translate(${pos.current.x - 100}px, ${pos.current.y - 100}px)`;
      }

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseover', handleOver);
      cancelAnimationFrame(raf.current);
    };
  }, [isTouch]);

  const sizeMap: Record<CursorVariant, number> = {
    default: 28,
    button: 20,
    link: 24,
    image: 40,
    project: 36,
    text: 8,
  };

  const borderMap: Record<CursorVariant, string> = {
    default: 'var(--color-accent)',
    button: 'var(--color-accent)',
    link: 'var(--color-accent)',
    image: 'white',
    project: 'var(--color-accent)',
    text: 'transparent',
  };

  const bgMap: Record<CursorVariant, string> = {
    default: 'transparent',
    button: 'var(--color-accent)',
    link: 'transparent',
    image: 'rgba(255,255,255,0.2)',
    project: 'var(--color-accent)',
    text: 'var(--color-accent)',
  };

  if (isTouch) return null;

  return (
    <>
      {/* Glow */}
      <div
        ref={glowEl}
        className="fixed top-0 left-0 w-[200px] h-[200px] pointer-events-none z-[9997]"
        style={{
          background: `radial-gradient(circle, ${variant === 'image' ? 'rgba(255,255,255,0.08)' : 'var(--color-accent) 0%, transparent 70%'})`,
          opacity: variant === 'default' ? 0.06 : variant === 'image' ? 0.12 : 0.1,
          transition: 'background 0.2s ease, opacity 0.2s ease',
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringEl}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: `${sizeMap[variant]}px`,
          height: `${sizeMap[variant]}px`,
          border: `1px solid ${borderMap[variant]}`,
          backgroundColor: bgMap[variant],
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.15s ease, background-color 0.15s ease',
          mixBlendMode: variant === 'image' ? 'difference' : 'normal',
          backdropFilter: variant === 'image' ? 'invert(1)' : 'none',
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotEl}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
        style={{
          backgroundColor: variant === 'image' ? 'white' : 'var(--color-accent)',
          transition: 'background-color 0.15s ease',
          mixBlendMode: variant === 'image' ? 'difference' : 'normal',
        }}
      />
    </>
  );
}
