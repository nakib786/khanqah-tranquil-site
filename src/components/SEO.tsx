import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { getLang } from '@/lib/i18n';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  schema?: Record<string, unknown>;
}

const SEO = ({ title, description, image, article, schema }: SEOProps) => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const location = useLocation();
  const t = translations[lang];

  const siteName = t.hero.title + ' - ' + t.hero.fullTitle;

  // Logic to determine default description based on page
  const getPageDescription = () => {
    if (description) return description;

    // Normalize path to get the page name (strip language prefix and trailing slashes)
    const purePath = location.pathname.replace(/^\/(en|ur|ar|hi)(\/|$)/, '').replace(/\/$/, '') || 'home';

    // Mapping path to seo key in translations.ts
    const mapping: Record<string, keyof typeof t.seo> = {
      'home': 'homeDescription',
      'about': 'aboutDescription',
      'activities': 'activitiesDescription',
      'teachings': 'teachingsDescription',
      'gallery': 'galleryDescription',
      'contact': 'contactDescription',
      'iraadat': 'iraadatDescription'
    };

    const key = mapping[purePath];
    return key && t.seo[key] ? (t.seo[key] as string) : t.hero.subtitle;
  };

  const seoDescription = getPageDescription();
  const siteUrl = 'https://almehfuz.org';
  const pathPart = location.pathname.replace(/^\/(en|ur|ar|hi)(\/|$)/, '').replace(/\/$/, '');
  const canonicalUrl = `${siteUrl}${location.pathname}`;

  const seoTitle = title ? `${title} | ${siteName}` : siteName;
  const seoImage = image || `${siteUrl}/logo.png`;

  const getHreflangUrl = (l: string) => {
    return `${siteUrl}/${l}${pathPart ? `/${pathPart}` : ''}`;
  };

  const isRtl = lang === 'ur' || lang === 'ar';

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={canonicalUrl} />
      <html lang={lang} dir={isRtl ? 'rtl' : 'ltr'} />

      <link rel="alternate" href={getHreflangUrl('en')} hrefLang="en" />
      <link rel="alternate" href={getHreflangUrl('ur')} hrefLang="ur" />
      <link rel="alternate" href={getHreflangUrl('ar')} hrefLang="ar" />
      <link rel="alternate" href={getHreflangUrl('hi')} hrefLang="hi" />
      <link rel="alternate" href={getHreflangUrl('en')} hrefLang="x-default" />

      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={article ? 'article' : 'website'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {!schema && !article && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": siteName,
            "@id": `${siteUrl}/#organization`,
            "url": siteUrl,
            "logo": {
              "@type": "ImageObject",
              "url": `${siteUrl}/logo.png`
            },
            "sameAs": [
              "https://facebook.com/almehfuz",
              "https://instagram.com/almehfuz"
            ],
            "description": seoDescription,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Khankah Sharif, Mehfuz Baugh, Thala",
              "addressLocality": "Chikhli",
              "addressRegion": "Gujarat",
              "postalCode": "396521",
              "addressCountry": "IN"
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
