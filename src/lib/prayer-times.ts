import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';
import { Language } from '@/data/translations';

export const NAVSARI_COORDINATES = new Coordinates(20.9467, 72.9520);
export const IST_TIME_ZONE = 'Asia/Kolkata';

function getDatePartsInTimeZone(date: Date, timeZone: string): { year: number; month: number; day: number } {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(date);

    const year = Number(parts.find((p) => p.type === 'year')?.value);
    const month = Number(parts.find((p) => p.type === 'month')?.value);
    const day = Number(parts.find((p) => p.type === 'day')?.value);

    return { year, month, day };
}

export function getTodayInISTDate(baseDate: Date = new Date()): Date {
    const { year, month, day } = getDatePartsInTimeZone(baseDate, IST_TIME_ZONE);
    // Intentionally create a local Date using IST calendar day.
    // This ensures the prayer schedule aligns to the IST day even if the viewer is in another timezone.
    return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function getPrayerTimesForNavsari(date: Date = getTodayInISTDate()): PrayerTimes {
    const params = CalculationMethod.Karachi();
    params.madhab = Madhab.Hanafi;
    return new PrayerTimes(NAVSARI_COORDINATES, date, params);
}

export function formatTime(date: Date, lang: string = 'en'): string {
    return date.toLocaleTimeString(lang === 'en' ? 'en-US' : 'en-GB', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: IST_TIME_ZONE,
    });
}

export interface ScheduleItem {
    time: string;
    name: string;
    prayerDate: Date;
}

const names: Record<Language, string[]> = {
    en: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'],
    ur: ['فجر', 'ظہر', 'عصر', 'مغرب', 'عشاء'],
    ar: ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'],
    hi: ['फज्र', 'ज़ुहर', 'अस्र', 'मग़रिब', 'ईशा'],
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
        prayerDate: date,
    }));
}

export function getNextPrayer(items: ScheduleItem[]): { name: string; diff: number } | null {
    const now = new Date();
    for (const item of items) {
        if (item.prayerDate > now) {
            return { name: item.name, diff: item.prayerDate.getTime() - now.getTime() };
        }
    }
    return null;
}

export function getIslamicDate(): string {
    try {
        const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
            timeZone: IST_TIME_ZONE,
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
        });
        return formatter.format(new Date());
    } catch {
        return '';
    }
}

export function getIslamicDateArabic(): string {
    try {
        const formatter = new Intl.DateTimeFormat('ar-u-ca-islamic-umalqura', {
            timeZone: IST_TIME_ZONE,
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        return formatter.format(new Date());
    } catch {
        return '';
    }
}
