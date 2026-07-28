import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { EASE } from '../constants/animation';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center px-4">
        <motion.div
          className="text-8xl sm:text-9xl font-medium tracking-tighter text-text-muted/20 mb-6 select-none"
          initial={{ opacity: 0, filter: 'blur(8px)', y: 12 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.5, ease: EASE.out }}
        >
          404
        </motion.div>
        <motion.h1
          className="text-2xl sm:text-3xl font-medium mb-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE.out, delay: 0.1 }}
        >
          Page not found
        </motion.h1>
        <motion.p
          className="text-text-muted mb-8 max-w-md mx-auto text-sm leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE.out, delay: 0.15 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE.out, delay: 0.2 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:brightness-110 shadow-soft transition-all"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
