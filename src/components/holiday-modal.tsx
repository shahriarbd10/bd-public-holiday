"use client";

import { useState } from "react";
import { X, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";

export function HolidayModal({ isOpen, onClose, holidays, relativeTime }: any) {
  if (!isOpen || !holidays || holidays.length === 0) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto transform transition-all border border-slate-200 dark:border-slate-800 scale-100 opacity-100 relative">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 pb-10">
             <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
               {holidays.map((holiday: any, index: number) => {
                 const isMoon = holiday.name.includes("Eid") || holiday.name.includes("Shab") || holiday.name.includes("Ashura");
                 return (
                   <div key={index} className={index > 0 ? "pt-6 border-t border-slate-100 dark:border-slate-800" : ""}>
                     <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-100 dark:border-brand-800 shrink-0">
                         <CalendarIcon className="w-6 h-6" />
                       </div>
                       <h2 className="text-xl md:text-2xl font-outfit font-bold text-slate-900 dark:text-white leading-tight">
                         {holiday.name}
                       </h2>
                     </div>

                     {/* Dependent flag */}
                     {isMoon ? (
                         <p className="text-brand-600 dark:text-brand-400 text-sm font-medium mb-4">
                            * This holiday is subject to moon sighting.
                         </p>
                     ) : null}

                     <div className="flex items-start gap-3">
                       <div className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-bold mt-0.5 shrink-0">i</div>
                       <div>
                         <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Type</p>
                         <p className="text-sm text-slate-600 dark:text-slate-400">{holiday.type}</p>
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>

             <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="flex items-start gap-3">
                 <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                 <div>
                   <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Date Observed</p>
                   <p className="text-sm text-slate-600 dark:text-slate-400">{holidays[0].date}, 2026</p>
                   <p className="text-xs font-semibold text-brand-600 tracking-wide uppercase mt-1">({relativeTime})</p>
                 </div>
               </div>

               <div className="flex items-start gap-3">
                 <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                 <div>
                   <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Location</p>
                   <p className="text-sm text-slate-600 dark:text-slate-400">Bangladesh (National)</p>
                 </div>
               </div>
             </div>

             <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors shadow-lg shadow-brand-500/20"
                >
                  Close Explorer
                </button>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
