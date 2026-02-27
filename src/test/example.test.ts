import { describe, it, expect } from "vitest";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });

  // debug helper: log today's computed value so we can compare with external
  // calendars; this test intentionally has no assertions. remove when
  // troubleshooting is complete.
  it('debug print current islamic date', () => {
      console.log('computed islamic', getIslamicDate());
    console.log('computed arabic', getIslamicDateArabic());
  });
});

import { getIslamicDate, getIslamicDateArabic, getIslamicDateFromAladhan } from '@/lib/prayer-times';

describe('islamic date helpers', () => {
  // a known Ramadan date in 2024; can be freely adjusted when the test
  // becomes outdated. the important thing is that the gregorian month is not
  // itself an islamic month name, so a broken implementation would slip by.
  const sample = new Date('2024-03-25T00:00:00Z');

  it('returns english month name (Ramadan) for sample date', () => {
    const text = getIslamicDate(sample).toLowerCase();
    expect(text).toContain('ramadan');
    // must not accidentally return the gregorian month
    const gregorianMonth = sample.toLocaleDateString('en-US', {
      month: 'long',
      timeZone: 'Asia/Kolkata',
    });
    expect(text).not.toContain(gregorianMonth.toLowerCase());
  });

  it('returns arabic month name (رمضان) for sample date', () => {
      const text = getIslamicDateArabic(sample);
    expect(text).toContain('رمضان');
  });

  it('allows applying a negative offset to move the date earlier', () => {
    // sample date returns Ramadan 3 with no offset; applying -2 should give
    // Ramadan 1.
    const d = new Date('2024-03-27T00:00:00Z');
    const unadjusted = getIslamicDate(d);
    expect(unadjusted.toLowerCase()).toContain('ramadan');
    const adjusted = getIslamicDate(d, -2);
    expect(adjusted.toLowerCase()).toContain('ramadan 1');
  });

  it('falls back to manual algorithm if Intl does not support islamic calendar', () => {
    const realFormatter = Intl.DateTimeFormat;
    // stub the formatter for islamic calendars only; other calls (e.g. the
    // helper that normalises a date to IST) must continue to behave normally.
    (Intl as any).DateTimeFormat = function (locale: string, options: any) {
      if (locale && locale.includes('islamic')) {
        return {
          format: () => 'September 25, 2024',
          resolvedOptions: () => ({ calendar: 'gregory' }),
        } as any;
      }
      // delegate to real formatter for everything else
      return new (realFormatter as any)(locale, options);
    } as any;

    try {
      const text = getIslamicDate(sample).toLowerCase();
      expect(text).toContain('ramadan');
    } finally {
      Intl.DateTimeFormat = realFormatter;
    }
  });

  describe('Aladhan API helper', () => {
    const sampleResponse = {
      code: 200,
      status: 'OK',
      data: {
        timings: {},
        date: {
          readable: '27 Mar 2024',
          timestamp: '1711526400',
          hijri: {
            day: '9',
            month: { number: 9, en: 'Ramadan' },
            year: '1445',
          },
        },
      },
    };

    beforeEach(() => {
      global.fetch = vi.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(sampleResponse) })
      ) as any;
    });

    it('returns hijri date string from API', async () => {
      // pass offset 0 to avoid the default -2 adjustment used in production
      const txt = await getIslamicDateFromAladhan(
        new Date('2024-03-27T00:00:00Z'),
        0
      );
      // formatting is "Weekday, <day> <month> <year>"
      expect(txt.toLowerCase()).toContain('9 ramadan');
    });

    it('applies offset on API result', async () => {
      const txt = await getIslamicDateFromAladhan(
        new Date('2024-03-27T00:00:00Z'),
        -2
      );
      expect(txt.toLowerCase()).toContain('7 ramadan');
    });

    it('throws on non-ok response', async () => {
      (global.fetch as unknown as vi.Mock).mockImplementationOnce(() =>
        Promise.resolve({ ok: false, status: 500 })
      );
      await expect(getIslamicDateFromAladhan()).rejects.toThrow(/Aladhan API error/);
    });
  });
// end of file
});
