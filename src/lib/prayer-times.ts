import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';
import { Language } from '@/data/translations';

export const NAVSARI_COORDINATES = new Coordinates(20.9467, 72.9520);

export function getPrayerTimesForNavsari(date: Date = new Date()): PrayerTimes {
    const params = CalculationMethod.Karachi();
    params.madhab = Madhab.Hanafi;
    return new PrayerTimes(NAVSARI_COORDINATES, date, params);
}

export function formatTime(date: Date, lang: string = 'en'): string {
    return date.toLocaleTimeString(lang === 'en' ? 'en-US' : 'en-GB', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
    });
}

export interface ScheduleItem {
    time: string;
    name: string;
    description: string;
}

const names: Record<Language, string[]> = {
    en: ['Fajr Prayer', 'Dhuhr Prayer', 'Asr Prayer', 'Maghrib Prayer', 'Isha Prayer'],
    ur: ['نمازِ فجر', 'نمازِ ظہر', 'نمازِ عصر', 'نمازِ مغرب', 'نمازِ عشاء'],
    ar: ['صلاة الفجر', 'صلاة الظهر', 'صلاة العصر', 'صلاة المغرب', 'صلاة العشاء'],
    hi: ['फज्र नमाज़', 'ज़ुहर नमाज़', 'अस्र नमाज़', 'मग़रिब नमाज़', 'ईशा नमाज़'],
};

const descriptions: Record<Language, string[]> = {
    en: [
        'Morning prayer followed by Quran recitation',
        'Afternoon prayer and short discourse',
        'Afternoon prayer and study circle',
        'Evening prayer followed by dhikr session',
        'Night prayer and spiritual discourse',
    ],
    ur: [
        'صبح کی نماز اور تلاوتِ قرآن',
        'دوپہر کی نماز اور مختصر بیان',
        'عصر کی نماز اور حلقۂ درس',
        'مغرب کی نماز اور ذکر کی مجلس',
        'عشاء کی نماز اور روحانی بیان',
    ],
    ar: [
        'صلاة الفجر متبوعة بتلاوة القرآن',
        'صلاة الظهر وحديث قصير',
        'صلاة العصر وحلقة علم',
        'صلاة المغرب متبوعة بجلسة ذكر',
        'صلاة العشاء وحديث روحاني',
    ],
    hi: [
        'सुबह की नमाज़ और क़ुरआन तिलावत',
        'दोपहर की नमाज़ और संक्षिप्त बयान',
        'अस्र की नमाज़ और अध्ययन मंडली',
        'मग़रिब की नमाज़ और ज़िक्र सत्र',
        'ईशा की नमाज़ और आध्यात्मिक बयान',
    ],
};

export function getLocalizedSchedule(lang: Language): ScheduleItem[] {
    const times = getPrayerTimesForNavsari();
    const prayerDates = [
        times.fajr,
        times.dhuhr,
        times.asr,
        times.maghrib,
        times.isha,
    ];

    return prayerDates.map((date, i) => ({
        time: formatTime(date, lang),
        name: names[lang][i],
        description: descriptions[lang][i],
    }));
}
