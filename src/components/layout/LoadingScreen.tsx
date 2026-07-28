import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useMousePosition';
import { DURATION, EASE } from '../../constants/animation';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem('loaded'));
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem('loaded', 'true');
      setDone(true);
      setTimeout(() => setVisible(false), 400);
    }, reduced ? 200 : 1600);
    return () => clearTimeout(timer);
  }, [visible, reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE.inOut }}
        >
          <motion.div className="text-center">
            <motion.p
              className="text-2xl sm:text-3xl font-medium tracking-tight"
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: EASE.out }}
            >
              Portfolio
            </motion.p>
            <motion.div
              className="mt-6 mx-auto h-[2px] rounded-full bg-gradient-to-r from-accent/20 via-accent to-accent/20"
              initial={{ width: 0 }}
              animate={done ? { width: 64 } : { width: [0, 64, 64, 0] }}
              transition={
                done
                  ? { duration: 0.3, ease: EASE.out }
                  : { duration: 1.4, times: [0, 0.4, 0.6, 1], ease: 'easeInOut' }
              }
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
