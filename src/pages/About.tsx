import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { lineage } from '@/data/content';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

const About = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const lineageData = lineage[lang];

  return (
    <Layout lang={lang}>
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8"
          >
            {t.about.title}
          </motion.h1>

          <p className="text-muted-foreground leading-relaxed text-lg mb-12">{t.about.history}</p>

          <h2 className="text-2xl font-bold mb-4">{t.about.missionTitle}</h2>
          <ul className="space-y-3 mb-12">
            {t.about.mission.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted-foreground">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-8">{t.about.lineageTitle}</h2>
          <div className="space-y-0 mb-12">
            {lineageData.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-primary shrink-0 mt-1" />
                  {i < lineageData.length - 1 && <div className="w-0.5 bg-primary/20 flex-1 min-h-[40px]" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold">{entry.name}</h3>
                  <span className="text-sm text-primary">{entry.period}</span>
                  <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-accent rounded-lg p-8 text-center">
            <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-sm">
              {t.about.imageAlt}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
