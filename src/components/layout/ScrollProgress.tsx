import { motion, useScroll, useSpring } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useMousePosition';

export default function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  if (reduced) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1px] z-[60] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent), transparent)',
      }}
    />
  );
}
