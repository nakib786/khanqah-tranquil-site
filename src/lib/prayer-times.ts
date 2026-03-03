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

// fallback data and helpers --------------------------------------------------

// month names taken from common islamic/umm al-qura listings; the english
// transliterations below are intentionally simple and readable. we don't
// expect perfect phonetics, only consistency across devices.
const ISLAMIC_MONTH_NAMES_EN = [
    'Muharram',
    'Safar',
    'Rabi\u2019 I',
    'Rabi\u2019 II',
    'Jumada I',
    'Jumada II',
    'Rajab',
    'Sha\u2019ban',
    'Ramadan',
    'Shawwal',
    'Dhu\u2019l-Qi\u2019dah',
    'Dhu\u2019l-Hijjah',
];

// Arabic names for months. they match the sequence above and are used when we
// cannot rely on Intl for the arabic output, for example on older phones.
const ISLAMIC_MONTH_NAMES_AR = [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الثاني',
    'جمادى الأولى',
    'جمادى الثانية',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
];

// convert a Gregorian date to a (rough) Islamic date. this algorithm is based
// on the one documented on Wikipedia and elsewhere; it produces the
// astronomic/arithmetical Islamic calendar rather than relying on
// Intl/`islamic-umalqura`. the result may differ by a day from the official
// Umm al-Qura table but it is consistent across platforms and never falls
// back to September.
interface IslamicDateParts {
    year: number;
    month: number; // 1–12
    day: number; // 1–30
}

// simplified conversion algorithm based on the widely published formula
// described on the Wikipedia "Islamic calendar" page. this version computes
// the Julian day directly from a Gregorian date and then derives the
// corresponding Islamic year/month/day. it behaves correctly for our ranges
// and avoids the strange fractional-day bug we saw earlier.

function islamicLeap(year: number): boolean {
    // leap years are 2,5,7,10,13,16,18,21,24,26,29 in a 30‑year cycle
    const mod = ((year * 11) + 14) % 30;
    return mod < 11;
}

function islamicYearDays(year: number): number {
    return 354 + (islamicLeap(year) ? 1 : 0);
}

function getIslamicParts(date: Date): IslamicDateParts {
    // normalise to IST so that midnight boundaries match our schedule
    const inIST = getTodayInISTDate(date);
    const msPerDay = 24 * 60 * 60 * 1000;
    // epoch of Islamic calendar: 1 Muharram, year 1 corresponds to
    // July 16, 622 (Julian). use UTC to avoid timezone shifts.
    const epoch = Date.UTC(622, 6, 16);
    const daysSinceEpoch = Math.floor((inIST.getTime() - epoch) / msPerDay);

    // compute year using arithmetical formula
    const yearIslamic = Math.floor((30 * daysSinceEpoch + 10646) / 10631);

    function daysUntilIslamicYear(y: number): number {
        return 354 * (y - 1) + Math.floor((3 + 11 * y) / 30);
    }

    const yearStart = daysUntilIslamicYear(yearIslamic);
    const monthIslamic = Math.min(
        12,
        Math.ceil((daysSinceEpoch - yearStart + 1) / 29.5)
    );
    const dayIslamic =
        daysSinceEpoch - yearStart - Math.floor(29.5 * (monthIslamic - 1)) + 1;

    return {
        year: yearIslamic,
        month: monthIslamic,
        day: dayIslamic,
    };
}

// ---------- exported helpers ----------------------------------------------

/**
 * Returns the current Islamic date formatted in english (weekday included).
 * Uses the browser's `Intl` implementation if it supports the Umm al-Qura
 * calendar; otherwise it falls back to a simple deterministic algorithm. The
 * primary motivation for the fallback is that some mobile browsers (especially
 * older Android/iOS versions) do not recognise the `islamic-umalqura` calendar
 * specifier and will silently return a Gregorian date instead (September,
 * etc.).
 */
// A small offset (in days) can be supplied by callers to correct for
// regional sighting differences. Umm al-Qura is used by default, which is
// typically one or two days ahead of the local moon sighting in South Asia.
// Pass a negative number (e.g. `-1`) when you know your community is observing
// the month later than the calculated day.
// default offset applied when no explicit value is provided. this can be
// overridden by passing a second argument to `getIslamicDate`/`getIslamicDateArabic`
// or by configuring your build (see README) if you prefer a per‑environment
// value. the offset is typically -1 or -2 for South Asian countries where the
// Umm al‑Qura calendar runs ahead of the local sighting.
export const DEFAULT_ISLAMIC_OFFSET = -2;

export function getIslamicDate(
    baseDate: Date = new Date(),
    offsetDays: number = DEFAULT_ISLAMIC_OFFSET
): string {
    const today = getTodayInISTDate(baseDate);
    // Apply offset by shifting the date before formatting
    const adjusted = new Date(today.getTime() + offsetDays * 24 * 60 * 60 * 1000);
    try {
        const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
            timeZone: IST_TIME_ZONE,
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
        });
        const formatted = formatter.format(adjusted);
        const options = formatter.resolvedOptions();
        if (options.calendar && options.calendar.startsWith('islamic')) {
            return formatted;
        }
    } catch {
        // fallthrough to manual fallback
    }

    // manual formatting
    let { year, month, day } = getIslamicParts(today);
    if (offsetDays !== 0) {
        // apply offset by shifting the day; if we roll out of the current month,
        // adjust month/year accordingly. the offset is small (usually ±1) so a
        // simple loop suffices.
        day += offsetDays;
        while (day < 1) {
            month -= 1;
            if (month < 1) {
                year -= 1;
                month = 12;
            }
            // assume previous month has 30 days (safe for small offsets)
            day += 30;
        }
        while (day > 30) {
            day -= 30;
            month += 1;
            if (month > 12) {
                year += 1;
                month = 1;
            }
        }
    }
    const weekday = today.toLocaleDateString('en-US', {
        weekday: 'long',
        timeZone: IST_TIME_ZONE,
    });
    const monthName = ISLAMIC_MONTH_NAMES_EN[month - 1];
    return `${weekday}, ${day} ${monthName} ${year}`;
}

export function getIslamicDateArabic(
    baseDate: Date = new Date(),
    offsetDays: number = DEFAULT_ISLAMIC_OFFSET
): string {
    const today = getTodayInISTDate(baseDate);
    const adjusted = new Date(today.getTime() + offsetDays * 24 * 60 * 60 * 1000);
    try {
        const formatter = new Intl.DateTimeFormat('ar-u-ca-islamic-umalqura', {
            timeZone: IST_TIME_ZONE,
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        const formatted = formatter.format(adjusted);
        const options = formatter.resolvedOptions();
        if (options.calendar && options.calendar.startsWith('islamic')) {
            return formatted;
        }
    } catch {
        // fall back to manual
    }

    let { year, month, day } = getIslamicParts(today);
    if (offsetDays !== 0) {
        day += offsetDays;
        while (day < 1) {
            month -= 1;
            if (month < 1) {
                year -= 1;
                month = 12;
            }
            day += 30;
        }
        while (day > 30) {
            day -= 30;
            month += 1;
            if (month > 12) {
                year += 1;
                month = 1;
            }
        }
    }
    const monthName = ISLAMIC_MONTH_NAMES_AR[month - 1];
    return `${day} ${monthName} ${year}`;
}

// ---------------------------------------------------------------------------
// External API helpers
// ---------------------------------------------------------------------------

/**
 * Fetches the current Islamic date from the Aladhan prayer-times API for the
 * Navsari coordinates. The endpoint returns both gregorian and hijri data;
 * we only care about the hijri portion. The result is formatted similarly to
 * `getIslamicDate` so consumers can swap between them without changing the
 * UI.
 *
 * The function respects the same `offsetDays` mechanism as the local helper.
 * If the network request fails for any reason, the promise rejects and
 * callers should fall back to the built‑in computation.
 */
export async function getIslamicDateFromAladhan(
    baseDate: Date = new Date(),
    offsetDays: number = DEFAULT_ISLAMIC_OFFSET
): Promise<string> {
    const today = getTodayInISTDate(baseDate);
    const timestamp = Math.floor(today.getTime() / 1000);

    // Using the "timings" endpoint with a unix timestamp ensures we get the
    // timing data for the correct local day. The API will auto‑convert to
    // the provided coordinates (Navsari) using method 2 (Islamic Society of
    // North America) which is reasonably accurate and similar to Karachi.
    const url = new URL('https://api.aladhan.com/v1/timings/' + timestamp);
    url.searchParams.set('latitude', NAVSARI_COORDINATES.latitude.toString());
    url.searchParams.set('longitude', NAVSARI_COORDINATES.longitude.toString());
    url.searchParams.set('method', '2');
    url.searchParams.set('timezonestring', IST_TIME_ZONE);

    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error(`Aladhan API error: ${res.status}`);
    }
    const body = await res.json();
    // safe navigation in case structure changes
    const hijri = body?.data?.date?.hijri;
    if (!hijri) {
        throw new Error('Aladhan API returned unexpected format');
    }

    let day = Number(hijri.day);
    let monthName = hijri.month?.en || ISLAMIC_MONTH_NAMES_EN[Number(hijri.month?.number) - 1];
    let year = Number(hijri.year);
    const weekday = today.toLocaleDateString('en-US', {
        weekday: 'long',
        timeZone: IST_TIME_ZONE,
    });

    // apply offset if requested
    if (offsetDays !== 0) {
        day += offsetDays;
        while (day < 1) {
            monthName = ISLAMIC_MONTH_NAMES_EN[(ISLAMIC_MONTH_NAMES_EN.indexOf(monthName) + 11) % 12];
            day += 30;
            if (monthName === 'Dhu\u2019l-Hijjah') {
                year -= 1;
            }
        }
        while (day > 30) {
            day -= 30;
            monthName = ISLAMIC_MONTH_NAMES_EN[(ISLAMIC_MONTH_NAMES_EN.indexOf(monthName) + 1) % 12];
            if (monthName === 'Muharram') {
                year += 1;
            }
        }
    }

    return `${weekday}, ${day} ${monthName} ${year}`;
}
