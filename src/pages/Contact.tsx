import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import { MapPin, Phone, Mail, Clock, ChevronDown, CheckCircle2, AlertCircle, Search, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Country {
  code: string;
  country: string;
  flag: string;
}

const defaultCountry: Country = { code: '+91', country: 'India', flag: '🇮🇳' };

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: { sitekey: string; theme?: string; callback?: (token: string) => void }) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
    onloadTurnstileCallback: () => void;
    onTurnstileLoad?: () => void;
  }
}

const Contact = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const isRtl = lang === 'ur' || lang === 'ar';
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    subject: '',
    inquiryType: t.common.inquiryTypes[0],
    message: ''
  });

  const [touched, setTouched] = useState({ email: false });
  const [countries, setCountries] = useState<Country[]>([defaultCountry]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectorRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowCountrySelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Turnstile rendering
  useEffect(() => {
    let widgetId: string | undefined;

    const tryRender = () => {
      const container = document.getElementById('turnstile-widget');
      if (window.turnstile && container) {
        try {
          // Clear any existing content first
          container.innerHTML = '';
          const key = '0x4AAAAAACl95tfAhuODDCb3';
          console.log('Rendering Turnstile with sitekey:', key);
          widgetId = window.turnstile.render('#turnstile-widget', {
            sitekey: key,
            theme: 'light',
          });
          return true;
        } catch (e) {
          console.error('Turnstile render error:', e);
        }
      }
      return false;
    };

    // Listen for the callback from index.html (window.onTurnstileLoad)
    window.onTurnstileLoad = () => {
      console.log('Turnstile load event received in component');
      tryRender();
    };

    if (window.turnstile) {
      tryRender();
    }

    // Backup interval in case callback or immediate check fails
    const intervalId = setInterval(() => {
      if (window.turnstile && !widgetId) {
        if (tryRender()) clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      window.onTurnstileLoad = undefined;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (e) {
          // Ignore removal errors
        }
      }
    };
  }, []);

  // Fetch countries only when dropdown is opened
  useEffect(() => {
    if (showCountrySelector && countries.length <= 1) {
      const fetchCountries = async () => {
        setLoadingCountries(true);
        try {
          const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,flag');
          const data = await response.json();
          const formatted = data
            .map((c: { name: { common: string }; idd: { root?: string; suffixes?: string[] }; flag?: string }) => {
              const root = c.idd.root || '';
              const suffix = c.idd.suffixes && c.idd.suffixes.length === 1 ? c.idd.suffixes[0] : '';
              return {
                code: root + suffix,
                country: c.name.common,
                flag: c.flag || '🌍'
              };
            })
            .filter((c: Country) => c.code && c.country)
            .sort((a: Country, b: Country) => a.country.localeCompare(b.country));

          // Re-map to ensure correct code formatting (no double plus)
          const finalData = formatted.map((c: Country) => ({
            ...c,
            code: c.code.startsWith('+') ? c.code : `+${c.code.replace(/\+/g, '')}`
          }));

          setCountries(finalData);
        } catch (error) {
          console.error('Error fetching countries:', error);
        } finally {
          setLoadingCountries(false);
        }
      };
      fetchCountries();
    }
  }, [showCountrySelector, countries.length]);

  const filteredCountries = useMemo(() => {
    return countries.filter(c =>
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery)
    );
  }, [searchQuery, countries]);

  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(form.email);
  }, [form.email]);

  const handleSubmit = (e: React.FormEvent) => {
    const formData = new FormData(e.target as HTMLFormElement);
    const token = formData.get('cf-turnstile-response');

    if (!token) {
      toast({
        title: "Security Check Required",
        description: "Please complete the security check to send your message.",
        variant: "destructive"
      });
      return;
    }

    if (!isEmailValid) {
      toast({
        title: "Validation Error",
        description: t.common.emailInvalid,
        variant: "destructive"
      });
      return;
    }
    toast({ title: t.contact.successTitle, description: t.contact.successMessage });
    setForm({
      name: '',
      email: '',
      phone: '',
      countryCode: '+91',
      subject: '',
      inquiryType: t.common.inquiryTypes[0],
      message: ''
    });
    setTouched({ email: false });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout lang={lang}>
      <section className="pt-24 pb-12 bg-background/50">
        <div className={`w-full max-w-5xl mx-auto px-4 sm:px-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-3 mb-8"
          >
            <motion.h1
              variants={itemVariants}
              className={`text-2xl md:text-5xl font-bold ${isRtl ? 'leading-normal' : 'leading-tight'}`}
            >
              {t.contact.title}
            </motion.h1>
            <motion.div
              variants={itemVariants}
              className="w-12 h-1 bg-primary rounded-full"
            />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-card border rounded-2xl p-4 sm:p-8 shadow-sm">
                <h2 className="text-lg md:text-2xl font-bold mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  {t.common.formTitle}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Name */}
                    <div className="space-y-1.5 min-w-0">
                      <label className={`block ${isRtl ? 'text-sm' : 'text-xs'} font-semibold px-1 opacity-80 ${isRtl ? 'leading-relaxed' : ''}`}>{t.common.name}</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-muted-foreground/20 hover:border-primary/50"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 min-w-0">
                      <label className={`block ${isRtl ? 'text-sm' : 'text-xs'} font-semibold px-1 opacity-80 ${isRtl ? 'leading-relaxed' : ''}`}>{t.common.email}</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          onBlur={() => setTouched({ ...touched, email: true })}
                          required
                          className={`w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 transition-all border-muted-foreground/20 hover:border-primary/50 ${touched.email
                            ? isEmailValid
                              ? 'border-green-500/50 focus:ring-green-500/20'
                              : 'border-red-500/50 focus:ring-red-500/20'
                            : 'focus:ring-primary/20'
                            }`}
                        />
                        <div className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 flex items-center`}>
                          {touched.email && (
                            isEmailValid
                              ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                              : <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <AnimatePresence>
                        {touched.email && !isEmailValid && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] text-red-500 px-1 mt-1 font-medium"
                          >
                            {t.common.emailInvalid}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5 min-w-0">
                      <label className={`block ${isRtl ? 'text-sm' : 'text-xs'} font-semibold px-1 opacity-80 ${isRtl ? 'leading-relaxed' : ''}`}>{t.common.phone}</label>
                      <div className="flex gap-2">
                        <div className="relative shrink-0 flex items-center" ref={selectorRef}>
                          <div className="flex border border-muted-foreground/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 hover:border-primary/50 transition-all">
                            <button
                              type="button"
                              onClick={() => setShowCountrySelector(!showCountrySelector)}
                              className={`px-2.5 bg-muted/30 hover:bg-muted/50 transition-colors flex items-center gap-1 ${isRtl ? 'border-l' : 'border-r'} border-muted-foreground/10`}
                            >
                              <span className="text-lg">
                                {countries.find(c => c.code === form.countryCode)?.flag || (form.countryCode === '+91' ? '🇮🇳' : '🌍')}
                              </span>
                              <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                            </button>
                            <input
                              type="text"
                              value={form.countryCode}
                              onChange={e => setForm({ ...form, countryCode: e.target.value })}
                              className="w-[60px] bg-background px-1 py-2.5 text-xs focus:outline-none text-center font-bold"
                              placeholder="+X"
                            />
                          </div>

                          <AnimatePresence>
                            {showCountrySelector && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 mt-2 w-[240px] bg-card border rounded-xl shadow-xl z-50 overflow-hidden"
                              >
                                <div className="p-2 border-b border-muted-foreground/10 flex items-center gap-2 bg-muted/20">
                                  <Search className="w-4 h-4 text-muted-foreground" />
                                  <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search country..."
                                    className="bg-transparent text-sm w-full focus:outline-none"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                  />
                                </div>
                                <div className="max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
                                  {loadingCountries ? (
                                    <div className="p-8 text-center">
                                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                      <p className="text-[10px] text-muted-foreground">Loading countries...</p>
                                    </div>
                                  ) : filteredCountries.length > 0 ? (
                                    filteredCountries.map((c, idx) => (
                                      <button
                                        key={`${c.code}-${c.country}-${idx}`}
                                        type="button"
                                        onClick={() => {
                                          setForm({ ...form, countryCode: c.code });
                                          setShowCountrySelector(false);
                                          setSearchQuery('');
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary/10 rounded-lg transition-colors text-sm ${isRtl ? 'text-right' : 'text-left'}`}
                                      >
                                        <span className="text-xl shrink-0">{c.flag}</span>
                                        <span className="flex-1 truncate">{c.country}</span>
                                        <span className="text-muted-foreground font-medium">{c.code}</span>
                                      </button>
                                    ))
                                  ) : (
                                    <div className="p-4 text-center text-xs text-muted-foreground">
                                      {t.teachings.noResults || "No country found."}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <input
                          type="tel"
                          placeholder={t.common.phonePlaceholder}
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          className="flex-1 min-w-0 px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-muted-foreground/20 hover:border-primary/50"
                        />
                      </div>
                    </div>

                    {/* Inquiry Type */}
                    <div className="space-y-1.5 min-w-0">
                      <label className={`block ${isRtl ? 'text-sm' : 'text-xs'} font-semibold px-1 opacity-80 ${isRtl ? 'leading-relaxed' : ''}`}>{t.common.inquiryType}</label>
                      <div className="relative">
                        <select
                          value={form.inquiryType}
                          onChange={e => setForm({ ...form, inquiryType: e.target.value })}
                          className={`w-full appearance-none ${isRtl ? 'pl-10 pr-3' : 'pr-10 pl-3'} py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border-muted-foreground/20 hover:border-primary/50`}
                        >
                          {t.common.inquiryTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <ChevronDown className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none`} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block ${isRtl ? 'text-sm' : 'text-xs'} font-semibold px-1 opacity-80 ${isRtl ? 'leading-relaxed' : ''}`}>{t.common.subject}</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-muted-foreground/20 hover:border-primary/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block ${isRtl ? 'text-sm' : 'text-xs'} font-semibold px-1 opacity-80 ${isRtl ? 'leading-relaxed' : ''}`}>{t.common.message}</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all border-muted-foreground/20 hover:border-primary/50"
                    />
                  </div>

                  <div className="py-2 min-h-[65px]">
                    <div id="turnstile-widget" className="cf-turnstile"></div>
                  </div>

                  <div className="pt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full md:w-auto px-10 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {t.common.send}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </span>
                  {t.common.contactInfo}
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="text-sm">
                      <p className="font-semibold mb-1">{t.nav.contact}</p>
                      <p className="text-muted-foreground leading-relaxed">{t.contact.address}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="text-sm">
                      <p className="font-semibold mb-2">{t.common.phone}</p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`tel:${t.contact.phone.replace(/\s+/g, '')}`}
                          className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium border border-primary/10"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {t.common.call}
                        </a>
                        <a
                          href={`https://wa.me/${t.contact.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors font-medium border border-green-500/10"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                          </svg>
                          {t.common.whatsApp}
                        </a>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2 opacity-60">{t.contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-sm">
                      <p className="font-semibold mb-1">{t.common.email}</p>
                      <a
                        href={`mailto:${t.contact.email}`}
                        className="text-primary hover:underline font-medium transition-all flex items-center gap-2"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {t.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl aspect-[4/3] overflow-hidden border shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2212.391064109656!2d73.06278859838102!3d20.78228114052743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0ed158806d347%3A0x55cc4ceb9ed2ef98!2sMehfuz%20Baugh%2C%20Thala%2C%20Chikhli%2C%20Gujarat%20396521%2C%20India!5e1!3m2!1sen!2sca!4v1772161842171!5m2!1sen!2sca"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Al Mehfuz Location"
                  className="grayscale hover:grayscale-0 transition-all duration-700 brightness-95 hover:brightness-100"
                />
              </div>

              <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg shadow-primary/10 islamic-pattern">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t.common.visitingHours}
                </h2>
                <div className="space-y-4">
                  {t.contact.hours.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm opacity-95">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                      <p className="font-medium">{h}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

