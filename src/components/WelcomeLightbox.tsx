import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeLightbox = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => setVisible(false)}
        >
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />

          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--gold)/0.15)_0%,transparent_70%)] pointer-events-none" />

          {/* Corner ornaments */}
          {['top-6 left-6', 'top-6 right-6 rotate-90', 'bottom-6 left-6 -rotate-90', 'bottom-6 right-6 rotate-180'].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-16 h-16 border-t-2 border-l-2 border-gold/30 rounded-tl-xl pointer-events-none`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            />
          ))}

          <motion.div
            className="relative text-center px-8 max-w-lg"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          >
            {/* Bismillah */}
            <motion.p
              className="text-gold/70 text-sm tracking-[0.3em] uppercase mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </motion.p>

            {/* Ornamental line */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
              <span className="text-gold text-xl">✦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
            </motion.div>

            {/* Main greeting */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gold mb-4 font-serif drop-shadow-[0_0_30px_hsl(var(--gold)/0.3)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              السلام عليكم
            </motion.h1>

            <motion.p
              className="text-primary-foreground/90 text-lg md:text-xl font-light mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Peace be upon you
            </motion.p>

            <motion.div
              className="mt-6 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <p className="text-primary-foreground/60 text-sm leading-relaxed italic">
                "Whoever believes in Allah and the Last Day,
                <br />let him speak good or remain silent."
              </p>
              <p className="text-gold/50 text-xs tracking-wider">— Sahih al-Bukhari</p>
            </motion.div>

            {/* Bottom ornament */}
            <motion.div
              className="mt-8 flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <span className="text-gold/40">☪</span>
            </motion.div>

            {/* Tap to dismiss hint */}
            <motion.p
              className="mt-6 text-primary-foreground/30 text-[10px] uppercase tracking-[0.2em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Tap anywhere to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeLightbox;
