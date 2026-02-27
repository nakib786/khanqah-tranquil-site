import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { translations, type Language } from "@/data/translations";
import { getLang } from "@/lib/i18n";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(10);

  const segments = location.pathname.split("/").filter(Boolean);
  const langParam = segments[0] as Language | undefined;
  const lang = getLang(langParam);
  const t = translations[lang];

  const quotes = [
    "“Sometimes losing the path of this world is how Allah guides you back to His.”",
    "“When a road closes, it may be Allah redirecting you to something purer.”",
    "“Being lost can be the beginning of truly seeking your Lord.”",
    "“The heart that feels lost often finds peace in dhikr.”",
  ];

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(quoteTimer);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate(`/${lang}`, { replace: true });
      return;
    }

    const countdownTimer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(countdownTimer);
  }, [secondsLeft, navigate, lang]);

  return (
    <Layout lang={lang}>
      <section className="relative flex flex-1 items-center justify-center pt-32 pb-20 px-4 bg-foreground">
        {/* Top ornamental bar */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-xl mx-auto text-center"
        >
          {/* Floating 404 badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full border border-gold/40 bg-background/70 px-6 py-2 mb-6 shadow-[0_0_40px_rgba(0,0,0,0.12)]"
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="hero-title-fancy text-3xl md:text-4xl text-gold"
            >
              4O4
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="hero-title-fancy text-4xl md:text-5xl lg:text-6xl text-gold mb-3 leading-tight"
          >
            {t.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-6"
          >
            The page you are looking for could not be found.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-sm text-primary-foreground/60 mb-6 max-w-md mx-auto"
          >
            Perhaps the path was mistyped, moved, or no longer exists. Take a moment to reflect on these words
            before you are guided back home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8 px-6 py-4 rounded-2xl border border-gold/30 bg-background/80 shadow-sm"
          >
            <p className="font-arabic text-base md:text-lg text-primary italic">
              {quotes[quoteIndex]}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="text-xs text-primary-foreground/60 mb-8"
          >
            Redirecting you to the home page in{" "}
            <span className="font-semibold text-gold">{secondsLeft}</span> seconds...
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to={`/${lang}`}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gold text-primary-foreground font-medium shadow-lg hover:opacity-90 transition-opacity"
            >
              Go back home
            </Link>
            <Link
              to={`/${lang}/teachings`}
              className="inline-flex items-center px-6 py-3 rounded-lg border border-gold/60 text-primary-foreground font-medium hover:bg-gold/10 transition-colors"
            >
              Explore teachings
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom ornamental bar */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      </section>
    </Layout>
  );
};

export default NotFound;
