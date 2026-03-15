"use client";

import { useState, useMemo } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  parse,
  addMonths,
  subMonths
} from "date-fns";
import { Moon, ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarGrid({ holidays, onSelectHoliday, currentMonth = new Date(2026, new Date().getMonth()) }: any) {
  // Convert holidays array into a localized Map for O(1) lookups
  const holidaysMap = useMemo(() => {
    const map = new Map<string, any[]>();
    holidays.forEach((h: any) => {
      try {
        // Direct string parsing to avoid JS Timezone shifting "Feb 04" to "Feb 03 11:00 PM"
        const [monthStr, dayStr] = h.date.split(' ');
        const monthIndex = new Date(`${monthStr} 1, 2026`).getMonth() + 1;
        const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
        const formattedDay = dayStr.padStart(2, '0');
        const key = `2026-${formattedMonth}-${formattedDay}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(h);
      } catch (e) {
        // Skip invalid dates
      }
    });
    return map;
  }, [holidays]);

  const [displayMonth, setDisplayMonth] = useState(currentMonth);

  // Generate calendar grid dates
  const monthStart = startOfMonth(displayMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const dateKey = format(day, "yyyy-MM-dd");
      const dayHolidays = holidaysMap.get(dateKey) || [];
      const hasHoliday = dayHolidays.length > 0;
      const isCurrentMonth = isSameMonth(day, monthStart);

      days.push(
        <div
          key={day.toString()}
          onClick={() => hasHoliday ? onSelectHoliday(dayHolidays, dateKey) : null}
          className={`
            relative p-2 min-h-[100px] border-b border-r border-slate-200 dark:border-slate-800 transition-colors
            ${!isCurrentMonth ? "bg-slate-50/50 dark:bg-slate-900/20 text-slate-400 dark:text-slate-600" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"}
            ${hasHoliday ? "cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-900/20" : ""}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${hasHoliday && isCurrentMonth ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}`}>
              {formattedDate}
            </span>
          </div>
          
          <div className="mt-2 space-y-1">
            {dayHolidays.map((h, i) => {
              const isMoon = h.name.toLowerCase().includes('eid') || h.name.toLowerCase().includes('shab') || h.name.toLowerCase().includes('ashura');
              return (
                <div 
                  key={i} 
                  className="px-1.5 py-1 flex items-start gap-1 bg-brand-100 dark:bg-brand-900/40 text-[10px] sm:text-[11px] leading-[1.15] font-medium text-brand-700 dark:text-brand-300 rounded-md shadow-sm border border-brand-200 dark:border-brand-800 w-full overflow-hidden"
                  title={h.name}
                >
                  {isMoon && <Moon className="w-2.5 h-2.5 text-amber-500 shrink-0 mt-[2px]" />}
                  <span className="line-clamp-2 whitespace-normal break-words text-left">{h.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-4 text-slate-900 dark:text-white">
          <button 
            onClick={() => setDisplayMonth(subMonths(displayMonth, 1))} 
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg md:text-xl font-bold font-outfit w-32 md:w-36 text-center">
            {format(displayMonth, "MMMM yyyy")}
          </h3>
          <button 
            onClick={() => setDisplayMonth(addMonths(displayMonth, 1))} 
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 text-xs font-bold rounded-lg uppercase tracking-wider">
          Calendar View
        </span>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
        {weekDays.map((d) => (
          <div key={d} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex flex-col">
        {rows}
      </div>
    </div>
  );
}
