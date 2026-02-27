import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { gatherings, events } from '@/data/content';
import { getLang } from '@/lib/i18n';
import { getLocalizedSchedule } from '@/lib/prayer-times';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

const Activities = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const scheduleItems = getLocalizedSchedule(lang);

  return (
    <Layout lang={lang}>
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-12">
            {t.activities.title}
          </motion.h1>

          {/* Daily Schedule */}
          <h2 className="text-2xl font-bold mb-4">{t.activities.dailySchedule}</h2>
          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse min-w-[480px]">
              <thead>
                <tr className="bg-secondary">
                  <th className="text-start p-3 text-sm font-medium border-b">{t.activities.prayer}</th>
                  <th className="text-start p-3 text-sm font-medium border-b">{t.activities.time}</th>
                  <th className="text-start p-3 text-sm font-medium border-b">{t.activities.details}</th>
                </tr>
              </thead>
              <tbody>
                {scheduleItems.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-primary">{item.time}</td>
                    <td className="p-3 text-muted-foreground text-sm">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Weekly Gatherings */}
          <h2 className="text-2xl font-bold mb-4">{t.activities.weeklyGatherings}</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {gatherings[lang].map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-lg p-5"
              >
                <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">{g.day}</span>
                <h3 className="font-semibold mt-3 mb-1">{g.title}</h3>
                <p className="text-sm text-primary mb-2">{g.time}</p>
                <p className="text-sm text-muted-foreground">{g.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Upcoming Events */}
          <h2 className="text-2xl font-bold mb-4">{t.activities.upcomingEvents}</h2>
          <div className="space-y-4 mb-12">
            {events[lang].map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 items-start bg-card border rounded-lg p-5"
              >
                <div className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-center shrink-0 min-w-[70px]">
                  <div className="text-lg font-bold leading-tight">{event.date.split(' ')[0]}</div>
                  <div className="text-xs opacity-80">{event.date.split(' ').slice(1).join(' ')}</div>
                </div>
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Etiquette */}
          <h2 className="text-2xl font-bold mb-4">{t.activities.etiquetteTitle}</h2>
          <div className="bg-accent rounded-lg p-6">
            <ul className="space-y-2">
              {t.activities.etiquette.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Activities;
