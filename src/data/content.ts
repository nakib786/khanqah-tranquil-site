import { Language } from './translations';

type ML<T> = Record<Language, T>;

export interface ScheduleItem { time: string; name: string; description: string; }
export interface Gathering { day: string; title: string; time: string; description: string; }
export interface Event { date: string; title: string; description: string; }
export interface Teaching { slug: string; title: string; date: string; tags: string[]; excerpt: string; content: string; readingTime: number; }
export interface Album { id: string; title: string; imageCount: number; }
export interface LineageEntry { name: string; period: string; description: string; }

export const schedule: ML<ScheduleItem[]> = {
  en: [
    { time: '5:00 AM', name: 'Fajr Prayer', description: 'Morning prayer followed by Quran recitation' },
    { time: '1:00 PM', name: 'Dhuhr Prayer', description: 'Afternoon prayer and short discourse' },
    { time: '4:30 PM', name: 'Asr Prayer', description: 'Afternoon prayer and study circle' },
    { time: '6:30 PM', name: 'Maghrib Prayer', description: 'Evening prayer followed by dhikr session' },
    { time: '8:00 PM', name: 'Isha Prayer', description: 'Night prayer and spiritual discourse' },
  ],
  ur: [
    { time: '5:00 AM', name: 'نمازِ فجر', description: 'صبح کی نماز اور تلاوتِ قرآن' },
    { time: '1:00 PM', name: 'نمازِ ظہر', description: 'دوپہر کی نماز اور مختصر بیان' },
    { time: '4:30 PM', name: 'نمازِ عصر', description: 'عصر کی نماز اور حلقۂ درس' },
    { time: '6:30 PM', name: 'نمازِ مغرب', description: 'مغرب کی نماز اور ذکر کی مجلس' },
    { time: '8:00 PM', name: 'نمازِ عشاء', description: 'عشاء کی نماز اور روحانی بیان' },
  ],
  ar: [
    { time: '5:00 AM', name: 'صلاة الفجر', description: 'صلاة الفجر متبوعة بتلاوة القرآن' },
    { time: '1:00 PM', name: 'صلاة الظهر', description: 'صلاة الظهر وحديث قصير' },
    { time: '4:30 PM', name: 'صلاة العصر', description: 'صلاة العصر وحلقة علم' },
    { time: '6:30 PM', name: 'صلاة المغرب', description: 'صلاة المغرب متبوعة بجلسة ذكر' },
    { time: '8:00 PM', name: 'صلاة العشاء', description: 'صلاة العشاء وحديث روحاني' },
  ],
  hi: [
    { time: '5:00 AM', name: 'फज्र नमाज़', description: 'सुबह की नमाज़ और क़ुरआन तिलावत' },
    { time: '1:00 PM', name: 'ज़ुहर नमाज़', description: 'दोपहर की नमाज़ और संक्षिप्त बयान' },
    { time: '4:30 PM', name: 'अस्र नमाज़', description: 'अस्र की नमाज़ और अध्ययन मंडली' },
    { time: '6:30 PM', name: 'मग़रिब नमाज़', description: 'मग़रिब की नमाज़ और ज़िक्र सत्र' },
    { time: '8:00 PM', name: 'ईशा नमाज़', description: 'ईशा की नमाज़ और आध्यात्मिक बयान' },
  ],
};

export const gatherings: ML<Gathering[]> = {
  en: [
    { day: 'Thursday', title: 'Night of Dhikr', time: '8:00 PM – 10:00 PM', description: 'Weekly remembrance circle with spiritual songs and collective meditation.' },
    { day: 'Friday', title: "Jumu'ah Discourse", time: '1:00 PM – 2:00 PM', description: 'Weekly sermon and guidance on living a meaningful spiritual life.' },
    { day: 'Sunday', title: 'Morning Dars', time: '10:00 AM – 11:30 AM', description: 'Teaching circle covering classical spiritual texts and their application.' },
  ],
  ur: [
    { day: 'جمعرات', title: 'ذکر کی رات', time: '8:00 PM – 10:00 PM', description: 'روحانی نغموں اور اجتماعی مراقبے کے ساتھ ہفتہ وار ذکر کی محفل۔' },
    { day: 'جمعہ', title: 'جمعہ بیان', time: '1:00 PM – 2:00 PM', description: 'معنی خیز روحانی زندگی گزارنے پر ہفتہ وار خطبہ اور رہنمائی۔' },
    { day: 'اتوار', title: 'صبح کا درس', time: '10:00 AM – 11:30 AM', description: 'کلاسیکی روحانی متون اور ان کے اطلاق پر درس۔' },
  ],
  ar: [
    { day: 'الخميس', title: 'ليلة الذكر', time: '8:00 PM – 10:00 PM', description: 'حلقة ذكر أسبوعية مع الأناشيد الروحانية والتأمل الجماعي.' },
    { day: 'الجمعة', title: 'خطبة الجمعة', time: '1:00 PM – 2:00 PM', description: 'خطبة أسبوعية وإرشاد حول العيش حياة روحانية ذات معنى.' },
    { day: 'الأحد', title: 'درس الصباح', time: '10:00 AM – 11:30 AM', description: 'حلقة تعليمية تغطي النصوص الروحانية الكلاسيكية وتطبيقاتها.' },
  ],
  hi: [
    { day: 'गुरुवार', title: 'ज़िक्र की रात', time: '8:00 PM – 10:00 PM', description: 'आध्यात्मिक गीतों और सामूहिक ध्यान के साथ साप्ताहिक ज़िक्र की महफ़िल।' },
    { day: 'शुक्रवार', title: 'जुमा बयान', time: '1:00 PM – 2:00 PM', description: 'सार्थक आध्यात्मिक जीवन जीने पर साप्ताहिक ख़ुत्बा और मार्गदर्शन।' },
    { day: 'रविवार', title: 'सुबह का दर्स', time: '10:00 AM – 11:30 AM', description: 'शास्त्रीय आध्यात्मिक ग्रंथों और उनके अनुप्रयोग पर शिक्षण मंडली।' },
  ],
};

export const events: ML<Event[]> = {
  en: [
    { date: '15 Mar 2026', title: 'Annual Urs Gathering', description: 'A three-day spiritual gathering commemorating the legacy of our spiritual masters with dhikr, lectures, and community meals.' },
    { date: '27 Sep 2026', title: 'Mawlid Celebration', description: 'A joyous celebration of the birth of the Prophet ﷺ with poetry, nasheeds, and scholarly talks.' },
    { date: '01 Mar 2026', title: 'Ramadan Special Program', description: 'Daily Iftar gatherings, Tarawih prayers, and nightly spiritual discourses throughout the blessed month.' },
  ],
  ur: [
    { date: '15 Mar 2026', title: 'سالانہ عرس مبارک', description: 'ہمارے روحانی اساتذہ کی وراثت کی یاد میں تین روزہ روحانی اجتماع، ذکر، لیکچرز اور اجتماعی کھانے کے ساتھ۔' },
    { date: '27 Sep 2026', title: 'میلاد النبی ﷺ', description: 'نبی کریم ﷺ کی ولادت کی خوشی میں شاعری، نعتوں اور علمی گفتگو کا پروگرام۔' },
    { date: '01 Mar 2026', title: 'رمضان المبارک پروگرام', description: 'روزانہ افطار، تراویح اور ماہِ مبارک میں ہر رات روحانی بیانات۔' },
  ],
  ar: [
    { date: '15 Mar 2026', title: 'العرس السنوي', description: 'تجمع روحاني لمدة ثلاثة أيام لإحياء إرث مشايخنا مع الذكر والمحاضرات والطعام المشترك.' },
    { date: '27 Sep 2026', title: 'احتفال المولد النبوي', description: 'احتفال بهيج بمولد النبي ﷺ مع الشعر والأناشيد والمحاضرات العلمية.' },
    { date: '01 Mar 2026', title: 'برنامج رمضان', description: 'إفطار يومي وصلاة التراويح ومحاضرات روحانية ليلية طوال الشهر المبارك.' },
  ],
  hi: [
    { date: '15 Mar 2026', title: 'वार्षिक उर्स', description: 'हमारे आध्यात्मिक गुरुओं की विरासत की स्मृति में तीन दिवसीय आध्यात्मिक सभा, ज़िक्र, व्याख्यान और सामूहिक भोजन।' },
    { date: '27 Sep 2026', title: 'मीलाद उन्नबी ﷺ', description: 'नबी करीम ﷺ के जन्म की खुशी में कविता, नशीद और विद्वानों की बातचीत का कार्यक्रम।' },
    { date: '01 Mar 2026', title: 'रमज़ान विशेष कार्यक्रम', description: 'दैनिक इफ्तार, तरावीह नमाज़ और मुबारक महीने में हर रात आध्यात्मिक बयान।' },
  ],
};

const enTeachings: Teaching[] = [
  { slug: 'path-of-remembrance', title: 'The Path of Remembrance', date: 'Jan 15, 2026', tags: ['Dhikr', 'Spirituality'], excerpt: 'Exploring the transformative power of divine remembrance and its role in purifying the heart and soul.', readingTime: 5, content: 'The remembrance of the Divine (dhikr) is the foundation of the spiritual path. It is through constant awareness and invocation that the heart finds its rest and the soul discovers its true nature. The great masters of the Qadri order have always emphasized that dhikr is not merely a practice of the tongue, but a state of the heart.\n\nWhen the seeker engages in dhikr with sincerity and presence, the veils between the servant and the Creator begin to thin. The heart, once clouded by worldly distractions, starts to reflect the light of divine attributes. This is the beginning of true spiritual awakening—a journey from forgetfulness to remembrance, from darkness to light.' },
  { slug: 'understanding-tawakkul', title: 'Understanding Tawakkul', date: 'Jan 8, 2026', tags: ['Faith', 'Spirituality'], excerpt: 'A deep look into the concept of trust in the Divine and how it transforms our relationship with the world.', readingTime: 7, content: 'Tawakkul, or trust in the Divine, is one of the highest stations of the spiritual path. It does not mean abandoning effort or planning, but rather placing ultimate reliance on the wisdom and mercy of the Creator while fulfilling our responsibilities in this world.\n\nThe one who truly practices tawakkul finds a profound sense of peace in every circumstance. Whether in ease or difficulty, abundance or scarcity, the heart remains anchored in the certainty that the Divine plan is always perfect. This trust liberates the soul from anxiety and fear, replacing them with gratitude and contentment.' },
  { slug: 'etiquette-of-the-seeker', title: 'The Etiquette of the Seeker', date: 'Dec 28, 2025', tags: ['Knowledge', 'Purification'], excerpt: 'Essential manners and attitudes for those embarking on the journey of spiritual learning and growth.', readingTime: 6, content: 'The spiritual path demands not only knowledge but also refined character and proper etiquette (adab). The great scholars have taught that adab is the foundation upon which all spiritual progress is built. Without proper manners toward the Divine, toward one\'s teacher, and toward fellow seekers, knowledge remains barren.\n\nA true seeker approaches learning with humility, recognizing that the ocean of divine knowledge is infinite and our understanding is but a drop. They honor their teachers, respect their fellow students, and maintain a constant state of gratitude for the opportunity to learn and grow on this blessed path.' },
  { slug: 'purification-of-the-heart', title: 'Purification of the Heart', date: 'Dec 15, 2025', tags: ['Purification', 'Spirituality'], excerpt: 'Understanding the process of cleansing the heart from spiritual ailments and cultivating noble qualities.', readingTime: 8, content: 'The purification of the heart (tazkiyat al-nafs) is the central concern of the spiritual path. Just as the body requires physical nourishment and care, the heart requires spiritual attention and cleansing. The diseases of the heart—such as envy, arrogance, attachment to the world, and heedlessness—are obstacles on the journey to the Divine.\n\nThe process of purification involves both removing negative qualities and cultivating positive ones. Through sincere repentance, regular dhikr, service to others, and the guidance of a qualified spiritual mentor, the seeker gradually transforms the heart from a place of darkness into a mirror reflecting divine light.' },
  { slug: 'light-of-knowledge', title: 'The Light of Knowledge', date: 'Dec 1, 2025', tags: ['Knowledge', 'Community'], excerpt: 'The importance of sacred knowledge in illuminating the path of the seeker and benefiting the community.', readingTime: 5, content: 'Sacred knowledge (ilm) is described as light—it illuminates the path ahead and dispels the darkness of ignorance. In the Islamic tradition, seeking knowledge is not merely an intellectual exercise but a sacred duty and an act of worship that brings one closer to the Creator.\n\nThe scholars of our tradition have always emphasized that knowledge must be accompanied by action and sincerity. Knowledge without practice is like a tree without fruit, and practice without knowledge is like a building without foundation. The seeker of knowledge must approach learning with the intention of drawing nearer to the Divine and serving the community.' },
  { slug: 'community-and-brotherhood', title: 'Community and Brotherhood in Faith', date: 'Nov 20, 2025', tags: ['Community', 'Faith'], excerpt: 'The bonds of spiritual brotherhood and how they strengthen the individual and the community.', readingTime: 6, content: 'The bonds of brotherhood and sisterhood in faith are among the greatest blessings of the spiritual path. In the Khanqah, we witness how individuals from diverse backgrounds come together united by their love for the Divine and their commitment to spiritual growth.\n\nA strong spiritual community provides support during times of difficulty, celebrates moments of joy, and creates an environment where each individual can flourish. The Prophet ﷺ taught that the believers are like one body—when one part suffers, the whole body responds with care and compassion. This is the vision we strive to realize in our community.' },
];

const urTeachings: Teaching[] = [
  { slug: 'path-of-remembrance', title: 'ذکر کا راستہ', date: 'Jan 15, 2026', tags: ['ذکر', 'روحانیت'], excerpt: 'ذکرِ الٰہی کی تبدیلی لانے والی طاقت اور دل و روح کی تطہیر میں اس کے کردار کی تلاش۔', readingTime: 5, content: 'ذکرِ الٰہی روحانی راستے کی بنیاد ہے۔ مسلسل آگاہی اور ذکر کے ذریعے ہی دل کو سکون ملتا ہے اور روح اپنی حقیقی فطرت کو پہچانتی ہے۔ قادری سلسلے کے عظیم اساتذہ نے ہمیشہ اس بات پر زور دیا ہے کہ ذکر محض زبان کی مشق نہیں بلکہ دل کی کیفیت ہے۔\n\nجب سالک اخلاص اور حضوری کے ساتھ ذکر میں مشغول ہوتا ہے تو بندے اور خالق کے درمیان پردے ہلکے ہونے لگتے ہیں۔' },
  { slug: 'understanding-tawakkul', title: 'توکل کی حقیقت', date: 'Jan 8, 2026', tags: ['ایمان', 'روحانیت'], excerpt: 'اللہ پر بھروسے کے تصور اور دنیا کے ساتھ ہمارے تعلق کو بدلنے کے طریقے پر گہری نظر۔', readingTime: 7, content: 'توکل، یعنی اللہ پر بھروسا، روحانی راستے کے بلند ترین مقامات میں سے ایک ہے۔ اس کا مطلب کوشش یا منصوبہ بندی چھوڑنا نہیں بلکہ اپنی ذمہ داریاں پوری کرتے ہوئے خالق کی حکمت اور رحمت پر حتمی اعتماد رکھنا ہے۔\n\nجو شخص حقیقی طور پر توکل کی مشق کرتا ہے وہ ہر حال میں گہرے سکون کا تجربہ کرتا ہے۔' },
  { slug: 'etiquette-of-the-seeker', title: 'سالک کے آداب', date: 'Dec 28, 2025', tags: ['علم', 'تزکیہ'], excerpt: 'روحانی تعلیم اور ترقی کے سفر پر نکلنے والوں کے لیے ضروری آداب اور رویے۔', readingTime: 6, content: 'روحانی راستہ نہ صرف علم بلکہ بہتر اخلاق اور مناسب آداب کا بھی تقاضا کرتا ہے۔ عظیم علما نے سکھایا ہے کہ ادب وہ بنیاد ہے جس پر تمام روحانی ترقی استوار ہوتی ہے۔\n\nسچا سالک عاجزی کے ساتھ علم حاصل کرتا ہے، یہ جانتے ہوئے کہ الٰہی علم کا سمندر بے کنار ہے اور ہماری سمجھ ایک قطرے کی مانند ہے۔' },
  { slug: 'purification-of-the-heart', title: 'تزکیۂ قلب', date: 'Dec 15, 2025', tags: ['تزکیہ', 'روحانیت'], excerpt: 'دل کو روحانی بیماریوں سے پاک کرنے اور نیک صفات پیدا کرنے کے عمل کو سمجھنا۔', readingTime: 8, content: 'تزکیۂ نفس روحانی راستے کا مرکزی موضوع ہے۔ جس طرح جسم کو جسمانی غذا اور دیکھ بھال کی ضرورت ہوتی ہے، اسی طرح دل کو روحانی توجہ اور صفائی کی ضرورت ہوتی ہے۔\n\nتزکیے کے عمل میں منفی صفات کو دور کرنا اور مثبت صفات کو پروان چڑھانا دونوں شامل ہیں۔ سچی توبہ، باقاعدہ ذکر، دوسروں کی خدمت اور اہل روحانی مرشد کی رہنمائی کے ذریعے سالک آہستہ آہستہ دل کو تاریکی سے نور کا آئینہ بنا لیتا ہے۔' },
  { slug: 'light-of-knowledge', title: 'علم کا نور', date: 'Dec 1, 2025', tags: ['علم', 'معاشرہ'], excerpt: 'سالک کے راستے کو روشن کرنے اور معاشرے کو فائدہ پہنچانے میں مقدس علم کی اہمیت۔', readingTime: 5, content: 'مقدس علم کو نور سے تعبیر کیا جاتا ہے — یہ آگے کے راستے کو روشن کرتا ہے اور جہالت کی تاریکی کو دور کرتا ہے۔ اسلامی روایت میں علم حاصل کرنا محض ذہنی مشق نہیں بلکہ ایک مقدس فریضہ اور عبادت ہے۔\n\nہماری روایت کے علما نے ہمیشہ اس بات پر زور دیا ہے کہ علم کے ساتھ عمل اور اخلاص ہونا ضروری ہے۔' },
  { slug: 'community-and-brotherhood', title: 'برادری اور ایمانی رشتے', date: 'Nov 20, 2025', tags: ['معاشرہ', 'ایمان'], excerpt: 'روحانی بھائی چارے کے رشتے اور یہ فرد اور معاشرے کو کیسے مضبوط کرتے ہیں۔', readingTime: 6, content: 'ایمانی بھائی چارے اور بہن چارے کے رشتے روحانی راستے کی عظیم ترین نعمتوں میں سے ہیں۔ خانقاہ میں ہم دیکھتے ہیں کہ مختلف پس منظر سے تعلق رکھنے والے لوگ کیسے اللہ سے محبت اور روحانی ترقی کے عزم میں متحد ہوتے ہیں۔\n\nایک مضبوط روحانی معاشرہ مشکل وقت میں سہارا دیتا ہے، خوشی کے لمحات منائی جاتی ہیں، اور ایسا ماحول پیدا ہوتا ہے جہاں ہر فرد ترقی کر سکتا ہے۔' },
];

const arTeachings: Teaching[] = [
  { slug: 'path-of-remembrance', title: 'طريق الذكر', date: 'Jan 15, 2026', tags: ['الذكر', 'الروحانية'], excerpt: 'استكشاف القوة التحويلية للذكر الإلهي ودوره في تطهير القلب والروح.', readingTime: 5, content: 'ذكر الله هو أساس الطريق الروحاني. من خلال الوعي المستمر والدعاء يجد القلب راحته وتكتشف الروح حقيقتها. لقد أكد مشايخ الطريقة القادرية العظام دائماً أن الذكر ليس مجرد ممارسة باللسان، بل هو حال القلب.\n\nعندما ينخرط السالك في الذكر بإخلاص وحضور، تبدأ الحجب بين العبد والخالق في الترقق. القلب الذي كان محجوباً بالمشاغل الدنيوية يبدأ في عكس نور الصفات الإلهية.' },
  { slug: 'understanding-tawakkul', title: 'فهم التوكل', date: 'Jan 8, 2026', tags: ['الإيمان', 'الروحانية'], excerpt: 'نظرة عميقة في مفهوم الثقة بالله وكيف يغير علاقتنا بالعالم.', readingTime: 7, content: 'التوكل على الله هو من أعلى المقامات في الطريق الروحاني. لا يعني ترك السعي أو التخطيط، بل وضع الاعتماد النهائي على حكمة الخالق ورحمته مع أداء مسؤولياتنا في هذا العالم.\n\nمن يمارس التوكل حقاً يجد سكينة عميقة في كل حال. سواء في اليسر أو العسر، يبقى القلب راسخاً في اليقين بأن التدبير الإلهي دائماً كامل.' },
  { slug: 'etiquette-of-the-seeker', title: 'آداب السالك', date: 'Dec 28, 2025', tags: ['العلم', 'التزكية'], excerpt: 'الآداب والمواقف الأساسية لمن يبدأ رحلة التعلم الروحاني والنمو.', readingTime: 6, content: 'يتطلب الطريق الروحاني ليس فقط العلم بل أيضاً الخلق الرفيع والأدب الصحيح. لقد علّم العلماء الكبار أن الأدب هو الأساس الذي يُبنى عليه كل تقدم روحاني.\n\nالسالك الحقيقي يقبل على العلم بتواضع، مدركاً أن بحر العلم الإلهي لا حدود له وأن فهمنا ليس إلا قطرة منه.' },
  { slug: 'purification-of-the-heart', title: 'تزكية القلب', date: 'Dec 15, 2025', tags: ['التزكية', 'الروحانية'], excerpt: 'فهم عملية تطهير القلب من الأمراض الروحانية وتنمية الصفات النبيلة.', readingTime: 8, content: 'تزكية النفس هي المحور الأساسي للطريق الروحاني. كما يحتاج الجسم إلى الغذاء والعناية الجسدية، يحتاج القلب إلى الاهتمام الروحاني والتطهير.\n\nتتضمن عملية التزكية إزالة الصفات السلبية وتنمية الإيجابية. من خلال التوبة الصادقة والذكر المنتظم وخدمة الآخرين وتوجيه المرشد الروحاني المؤهل، يتحول القلب تدريجياً من مكان الظلمة إلى مرآة تعكس النور الإلهي.' },
  { slug: 'light-of-knowledge', title: 'نور العلم', date: 'Dec 1, 2025', tags: ['العلم', 'المجتمع'], excerpt: 'أهمية العلم الشريف في إنارة طريق السالك وفائدة المجتمع.', readingTime: 5, content: 'يوصف العلم الشريف بالنور — ينير الطريق أمامنا ويبدد ظلمة الجهل. في التقليد الإسلامي، طلب العلم ليس مجرد تمرين فكري بل فريضة مقدسة وعبادة تقرب من الخالق.\n\nلقد أكد علماء تقليدنا دائماً أن العلم يجب أن يقترن بالعمل والإخلاص. العلم بلا عمل كالشجرة بلا ثمر، والعمل بلا علم كالبناء بلا أساس.' },
  { slug: 'community-and-brotherhood', title: 'المجتمع والأخوة في الإيمان', date: 'Nov 20, 2025', tags: ['المجتمع', 'الإيمان'], excerpt: 'روابط الأخوة الروحانية وكيف تقوي الفرد والمجتمع.', readingTime: 6, content: 'روابط الأخوة والأختية في الإيمان من أعظم نعم الطريق الروحاني. في الخانقاه نشهد كيف يجتمع أفراد من خلفيات متنوعة متحدين بحبهم لله والتزامهم بالنمو الروحاني.\n\nالمجتمع الروحاني القوي يوفر الدعم في أوقات الصعوبة، ويحتفل بلحظات الفرح، ويخلق بيئة يمكن فيها لكل فرد أن يزدهر.' },
];

const hiTeachings: Teaching[] = [
  { slug: 'path-of-remembrance', title: 'ज़िक्र का रास्ता', date: 'Jan 15, 2026', tags: ['ज़िक्र', 'आध्यात्मिकता'], excerpt: 'ईश्वरीय स्मरण की परिवर्तनकारी शक्ति और हृदय व आत्मा की शुद्धि में इसकी भूमिका।', readingTime: 5, content: 'ईश्वर का स्मरण (ज़िक्र) आध्यात्मिक मार्ग की नींव है। निरंतर जागरूकता और आह्वान के माध्यम से ही हृदय को विश्राम मिलता है और आत्मा अपनी सच्ची प्रकृति को पहचानती है। क़ादरी सिलसिले के महान गुरुओं ने हमेशा इस बात पर ज़ोर दिया है कि ज़िक्र केवल ज़बान की क्रिया नहीं बल्कि दिल की अवस्था है।\n\nजब साधक ईमानदारी और उपस्थिति के साथ ज़िक्र में लगता है, तो बंदे और रचयिता के बीच के पर्दे पतले होने लगते हैं।' },
  { slug: 'understanding-tawakkul', title: 'तवक्कुल की समझ', date: 'Jan 8, 2026', tags: ['ईमान', 'आध्यात्मिकता'], excerpt: 'ईश्वर पर भरोसे की अवधारणा और यह दुनिया के साथ हमारे संबंध को कैसे बदलती है।', readingTime: 7, content: 'तवक्कुल, यानी ईश्वर पर भरोसा, आध्यात्मिक मार्ग के उच्चतम मक़ामों में से एक है। इसका अर्थ प्रयास या योजना छोड़ना नहीं, बल्कि अपनी ज़िम्मेदारियाँ पूरी करते हुए रचयिता की बुद्धि और दया पर अंतिम भरोसा रखना है।\n\nजो व्यक्ति सच्चे तवक्कुल का अभ्यास करता है, वह हर परिस्थिति में गहरी शांति पाता है।' },
  { slug: 'etiquette-of-the-seeker', title: 'साधक के आदाब', date: 'Dec 28, 2025', tags: ['ज्ञान', 'तज़किया'], excerpt: 'आध्यात्मिक शिक्षा और विकास की यात्रा पर निकलने वालों के लिए आवश्यक शिष्टाचार और दृष्टिकोण।', readingTime: 6, content: 'आध्यात्मिक मार्ग न केवल ज्ञान बल्कि परिष्कृत चरित्र और उचित शिष्टाचार (अदब) की भी माँग करता है। महान विद्वानों ने सिखाया है कि अदब वह नींव है जिस पर सारी आध्यात्मिक प्रगति बनी है।\n\nसच्चा साधक विनम्रता के साथ ज्ञान प्राप्त करता है, यह जानते हुए कि ईश्वरीय ज्ञान का सागर अनंत है और हमारी समझ बस एक बूँद है।' },
  { slug: 'purification-of-the-heart', title: 'हृदय की शुद्धि', date: 'Dec 15, 2025', tags: ['तज़किया', 'आध्यात्मिकता'], excerpt: 'हृदय को आध्यात्मिक बीमारियों से शुद्ध करने और उत्तम गुणों को विकसित करने की प्रक्रिया।', readingTime: 8, content: 'हृदय की शुद्धि (तज़कियत अल-नफ़्स) आध्यात्मिक मार्ग का केंद्रीय विषय है। जैसे शरीर को भौतिक पोषण और देखभाल की आवश्यकता होती है, वैसे ही हृदय को आध्यात्मिक ध्यान और शुद्धि की आवश्यकता होती है।\n\nशुद्धि की प्रक्रिया में नकारात्मक गुणों को दूर करना और सकारात्मक गुणों को विकसित करना दोनों शामिल हैं। सच्चे तौबा, नियमित ज़िक्र, दूसरों की सेवा और योग्य आध्यात्मिक मार्गदर्शक के मार्गदर्शन से साधक धीरे-धीरे हृदय को अंधकार से दिव्य प्रकाश का दर्पण बना लेता है।' },
  { slug: 'light-of-knowledge', title: 'ज्ञान का प्रकाश', date: 'Dec 1, 2025', tags: ['ज्ञान', 'समुदाय'], excerpt: 'साधक के मार्ग को रोशन करने और समुदाय को लाभ पहुँचाने में पवित्र ज्ञान का महत्व।', readingTime: 5, content: 'पवित्र ज्ञान (इल्म) को प्रकाश कहा गया है — यह आगे के मार्ग को रोशन करता है और अज्ञान के अंधकार को दूर करता है। इस्लामी परंपरा में ज्ञान प्राप्त करना केवल बौद्धिक अभ्यास नहीं बल्कि एक पवित्र कर्तव्य और इबादत है।\n\nहमारी परंपरा के विद्वानों ने हमेशा इस बात पर ज़ोर दिया है कि ज्ञान के साथ अमल और इख़लास होना चाहिए।' },
  { slug: 'community-and-brotherhood', title: 'समुदाय और ईमानी भाईचारा', date: 'Nov 20, 2025', tags: ['समुदाय', 'ईमान'], excerpt: 'आध्यात्मिक भाईचारे के बंधन और ये व्यक्ति और समुदाय को कैसे मज़बूत करते हैं।', readingTime: 6, content: 'ईमान में भाईचारे और बहनापे के बंधन आध्यात्मिक मार्ग की सबसे बड़ी नेमतों में से हैं। ख़ानक़ाह में हम देखते हैं कि विविध पृष्ठभूमि के लोग कैसे अल्लाह से प्रेम और आध्यात्मिक विकास के संकल्प में एकजुट होते हैं।\n\nएक मज़बूत आध्यात्मिक समुदाय कठिन समय में सहारा देता है, खुशी के पलों का जश्न मनाता है, और ऐसा वातावरण बनाता है जहाँ हर व्यक्ति फल-फूल सकता है।' },
];

export const teachings: ML<Teaching[]> = { en: enTeachings, ur: urTeachings, ar: arTeachings, hi: hiTeachings };

export const albums: ML<Album[]> = {
  en: [
    { id: 'khanqah', title: 'Khanqah Premises', imageCount: 6 },
    { id: 'gatherings', title: 'Spiritual Gatherings', imageCount: 8 },
    { id: 'events', title: 'Special Events', imageCount: 5 },
  ],
  ur: [
    { id: 'khanqah', title: 'خانقاہ کا احاطہ', imageCount: 6 },
    { id: 'gatherings', title: 'روحانی مجالس', imageCount: 8 },
    { id: 'events', title: 'خصوصی پروگرام', imageCount: 5 },
  ],
  ar: [
    { id: 'khanqah', title: 'حرم الخانقاه', imageCount: 6 },
    { id: 'gatherings', title: 'المجالس الروحانية', imageCount: 8 },
    { id: 'events', title: 'الفعاليات الخاصة', imageCount: 5 },
  ],
  hi: [
    { id: 'khanqah', title: 'ख़ानक़ाह परिसर', imageCount: 6 },
    { id: 'gatherings', title: 'आध्यात्मिक सभाएँ', imageCount: 8 },
    { id: 'events', title: 'विशेष कार्यक्रम', imageCount: 5 },
  ],
};

export const lineage: ML<LineageEntry[]> = {
  en: [
    { name: 'Shaykh Abdul Qadir al-Jilani (RA)', period: '1077 – 1166 CE', description: 'The founder of the Qadri order, known as the Sultan of Saints, whose teachings continue to inspire millions worldwide.' },
    { name: 'Shaykh Abu Bakr ibn Abdullah', period: '1200 – 1275 CE', description: 'A distinguished successor who expanded the teachings across the Indian subcontinent.' },
    { name: 'Shaykh Muhammad al-Mehfuz', period: '1850 – 1935 CE', description: 'The founder of this Khanqah, known for his deep spiritual insight and service to the community.' },
    { name: 'Shaykh Ahmad al-Qadri', period: '1920 – 2005 CE', description: 'A beloved spiritual guide who modernized the Khanqah while preserving its sacred traditions.' },
  ],
  ur: [
    { name: 'شیخ عبدالقادر جیلانی (رضی اللہ عنہ)', period: '1077 – 1166 عیسوی', description: 'قادری سلسلے کے بانی، سلطان الاولیا کے نام سے مشہور، جن کی تعلیمات دنیا بھر میں لاکھوں لوگوں کو متاثر کرتی رہتی ہیں۔' },
    { name: 'شیخ ابوبکر بن عبداللہ', period: '1200 – 1275 عیسوی', description: 'ایک ممتاز جانشین جنہوں نے برصغیر میں تعلیمات کو پھیلایا۔' },
    { name: 'شیخ محمد المحفوظ', period: '1850 – 1935 عیسوی', description: 'اس خانقاہ کے بانی، گہری روحانی بصیرت اور خدمتِ خلق کے لیے مشہور۔' },
    { name: 'شیخ احمد القادری', period: '1920 – 2005 عیسوی', description: 'ایک محبوب روحانی رہنما جنہوں نے مقدس روایات کو محفوظ رکھتے ہوئے خانقاہ کو جدید بنایا۔' },
  ],
  ar: [
    { name: 'الشيخ عبد القادر الجيلاني (رضي الله عنه)', period: '1077 – 1166 م', description: 'مؤسس الطريقة القادرية، المعروف بسلطان الأولياء، الذي لا تزال تعاليمه تلهم الملايين حول العالم.' },
    { name: 'الشيخ أبو بكر بن عبد الله', period: '1200 – 1275 م', description: 'خليفة متميز نشر التعاليم عبر شبه القارة الهندية.' },
    { name: 'الشيخ محمد المحفوظ', period: '1850 – 1935 م', description: 'مؤسس هذه الخانقاه، المعروف ببصيرته الروحانية العميقة وخدمته للمجتمع.' },
    { name: 'الشيخ أحمد القادري', period: '1920 – 2005 م', description: 'مرشد روحاني محبوب حدّث الخانقاه مع الحفاظ على تقاليدها المقدسة.' },
  ],
  hi: [
    { name: 'शैख़ अब्दुल क़ादिर जीलानी (रज़ि.)', period: '1077 – 1166 ई.', description: 'क़ादरी सिलसिले के संस्थापक, सुल्तान अल-औलिया के नाम से प्रसिद्ध, जिनकी शिक्षाएँ दुनिया भर में लाखों लोगों को प्रेरित करती हैं।' },
    { name: 'शैख़ अबू बक्र इब्न अब्दुल्लाह', period: '1200 – 1275 ई.', description: 'एक प्रतिष्ठित उत्तराधिकारी जिन्होंने भारतीय उपमहाद्वीप में शिक्षाओं का प्रसार किया।' },
    { name: 'शैख़ मुहम्मद अल-मेहफ़ूज़', period: '1850 – 1935 ई.', description: 'इस ख़ानक़ाह के संस्थापक, गहरी आध्यात्मिक अंतर्दृष्टि और सामुदायिक सेवा के लिए प्रसिद्ध।' },
    { name: 'शैख़ अहमद अल-क़ादरी', period: '1920 – 2005 ई.', description: 'एक प्रिय आध्यात्मिक मार्गदर्शक जिन्होंने पवित्र परंपराओं को संरक्षित रखते हुए ख़ानक़ाह का आधुनिकीकरण किया।' },
  ],
};
