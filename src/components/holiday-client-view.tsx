"use client";

import { useState, useEffect } from "react";
import { MapPin, CalendarDays, Moon, CheckCircle2 } from "lucide-react";
import { parse, isPast, intervalToDuration } from "date-fns";
import { HeroCarousel } from "./hero-carousel";
import { HolidayModal } from "./holiday-modal";
import { CalendarGrid } from "./calendar-grid";

export function HolidayClientView({ initialHolidays, source }: { initialHolidays: any[], source: string }) {
  const [selectedHoliday, setSelectedHoliday] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getRelativeTime = (dateStr: string, formatType: 'short' | 'long' = 'long') => {
    try {
      const [monthStr, dayStr] = dateStr.split(' ');
      const monthIndex = new Date(`${monthStr} 1, 2026`).getMonth() + 1;
      const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
      const formattedDay = dayStr.padStart(2, '0');
      
      const parsedDate = new Date(`2026-${formattedMonth}-${formattedDay}T00:00:00`);

      if (isPast(parsedDate)) {
        return "Already passed";
      }
      
      const now = new Date();
      const duration = intervalToDuration({ start: now, end: parsedDate });
      
      const parts = [];
      const m = duration.months || 0;
      const d = duration.days || 0;

      if (formatType === 'short') {
        if (m > 0) parts.push(`${m}M`);
        if (d > 0 && m === 0) parts.push(`${d}D`); // Only show days in short format if < 1 month
        if (parts.length === 0) return "Soon";
        return `in ${parts.join(" ")}`;
      } else {
        if (m > 0) parts.push(`${m} month${m > 1 ? 's' : ''}`);
        if (d > 0) parts.push(`${d} day${d > 1 ? 's' : ''}`);
        if (parts.length === 0) return "in less than a day";
        return `in ${parts.join(" and ")}`;
      }
    } catch {
      return "Date unknown";
    }
  };

  const isMoonDependent = (name: string) => {
    const lower = name.toLowerCase();
    return lower.includes('eid') || lower.includes('shab') || lower.includes('ashura');
  };

  return (
    <>
      <HeroCarousel />
      
      <section className="max-w-5xl mx-auto pb-20">
        <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
            <h2 className="text-2xl font-outfit font-bold flex items-center gap-3">
              <CalendarDays className="text-brand-500" />
              Upcoming Holidays in 2026
            </h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-lg text-xs md:text-sm bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 font-medium flex items-center gap-1 border border-brand-200 dark:border-brand-800">
                <MapPin className="w-4 h-4" />
                Bangladesh
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-10 mt-8">
            {/* Calendar View Full Width */}
            <div className="w-full">
              <CalendarGrid 
                 holidays={initialHolidays} 
                 onSelectHoliday={(h: any[], dateKey: string) => {
                    const relTime = mounted ? getRelativeTime(h[0].date) : "...";
                    setSelectedHoliday({ holidays: h, relativeTime: relTime });
                 }} 
              />
            </div>

            {/* List View Cards in Grid */}
            <div className="w-full space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xl md:text-2xl font-bold font-outfit text-slate-900 dark:text-white px-2">
                All Holidays
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {initialHolidays.length > 0 ? (
              initialHolidays.map((holiday, idx) => {
                const isMoon = isMoonDependent(holiday.name);
                const relativeTimeShort = mounted ? getRelativeTime(holiday.date, 'short') : "...";
                const relativeTimeLong = mounted ? getRelativeTime(holiday.date, 'long') : "...";

                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedHoliday({ holidays: [holiday], relativeTime: relativeTimeLong })}
                    className="cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-5 rounded-2xl bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-4 md:gap-5 w-full">
                      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-900/30 dark:group-hover:text-brand-400 transition-colors shrink-0">
                        <span className="text-xs md:text-sm font-semibold uppercase">{holiday.date.split(' ')[0]}</span>
                        <span className="text-xl font-bold font-outfit leading-none">{holiday.date.split(' ')[1] || ''}</span>
                      </div>
                      <div className="w-full">
                        <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-0.5 md:mb-1 flex items-start justify-between gap-3">
                            <span className="whitespace-normal break-words leading-tight">{holiday.name}</span>
                            {isMoon && <Moon className="w-4 h-4 text-amber-500 fill-amber-100 dark:fill-amber-900/40 opacity-70 shrink-0 mt-1" />}
                        </h3>
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis mr-2">{holiday.type}</p>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg shrink-0">
                                {relativeTimeShort === "Already passed" ? (
                                    <>
                                       <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                       <span className="text-[10px] md:text-xs font-semibold">Passed</span>
                                    </>
                                ) : (
                                    <span className="text-[10px] md:text-xs font-semibold">{relativeTimeShort}</span>
                                )}
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-10 text-slate-500 w-full min-h-[150px] flex items-center justify-center">
                No holidays data available right now.
              </div>
            )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HolidayModal 
        isOpen={Boolean(selectedHoliday)} 
        onClose={() => setSelectedHoliday(null)} 
        holidays={selectedHoliday?.holidays}
        relativeTime={selectedHoliday?.relativeTime}
      />
    </>
  );
}
