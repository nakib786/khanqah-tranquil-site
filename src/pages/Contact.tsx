import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Contact = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t.contact.successTitle, description: t.contact.successMessage });
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <Layout lang={lang}>
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-12">
            {t.contact.title}
          </motion.h1>

          <div className="grid md:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.common.name}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.common.email}</label>
                <input
                  type="text"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.common.message}</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {t.common.send}
              </button>
            </form>

            <div className="space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <h2 className="font-semibold mb-4">{t.common.contactInfo}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span className="text-muted-foreground">{t.contact.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">{t.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">{t.contact.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                <span className="text-muted-foreground text-sm">{t.common.mapPlaceholder}</span>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {t.common.visitingHours}
                </h2>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {t.contact.hours.map((h, i) => (
                    <p key={i}>{h}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
