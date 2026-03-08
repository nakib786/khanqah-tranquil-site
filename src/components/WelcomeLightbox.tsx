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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => setVisible(false)}
        >
          <motion.div
            className="relative bg-primary rounded-2xl border border-gold/30 shadow-[0_0_60px_-10px_hsl(var(--gold)/0.3)] px-10 py-8 max-w-sm mx-4 text-center overflow-hidden"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pattern overlay */}
            <div className="absolute inset-0 islamic-pattern opacity-15 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--gold)/0.1)_0%,transparent_70%)] pointer-events-none" />

            {/* Corner accents */}
            {['top-2 left-2', 'top-2 right-2 rotate-90', 'bottom-2 left-2 -rotate-90', 'bottom-2 right-2 rotate-180'].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-8 h-8 border-t border-l border-gold/25 rounded-tl-lg pointer-events-none`} />
            ))}

            <div className="relative">
              <p className="text-gold/60 text-[11px] tracking-[0.25em] uppercase mb-3">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>

              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold/40" />
                <span className="text-gold text-sm">✦</span>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold/40" />
              </div>

              <h1 className="text-3xl font-bold text-gold mb-1.5 font-serif drop-shadow-[0_0_20px_hsl(var(--gold)/0.25)]">
                السلام عليكم
              </h1>
              <p className="text-primary-foreground/80 text-sm mb-4">Peace be upon you</p>

              <p className="text-primary-foreground/50 text-xs leading-relaxed italic">
                "Whoever believes in Allah and the Last Day, let him speak good or remain silent."
              </p>
              <p className="text-gold/40 text-[10px] mt-1 tracking-wider">— Sahih al-Bukhari</p>

              <p className="text-gold/30 mt-4">☪</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeLightbox;
