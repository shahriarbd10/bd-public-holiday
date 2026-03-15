"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = [
  {
    url: "/images/sundarbans.png",
    caption: "Sundarbans Mangrove Forest",
  },
  {
    url: "/images/coxs_bazar.png",
    caption: "Cox's Bazar Beach",
  },
  {
    url: "/images/sajek_valley.png",
    caption: "Sajek Valley",
  },
  {
    url: "/images/kaptai_lake.png",
    caption: "Kaptai Lake, Rangamati",
  }
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000); // 5 seconds auto-transition
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl mb-12 shadow-2xl isolate">
      {/* Background Images with Crossfade */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={IMAGES[currentIndex].url}
          alt={IMAGES[currentIndex].caption}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover -z-20"
        />
      </AnimatePresence>

      {/* High-end Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent -z-10" />

      {/* Hero Content */}
      <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 md:pb-16 flex flex-col justify-end h-full w-full max-w-5xl mx-auto z-10 text-center md:text-left">
        
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-medium text-white mb-6 w-fit mx-auto md:mx-0 shadow-lg"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400"></span>
          </span>
          {IMAGES[currentIndex].caption}
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-outfit font-extrabold tracking-tight text-white mb-4 leading-[1.1] drop-shadow-xl">
          Discover the Beauty <br className="hidden md:block" />
          <span className="text-brand-300">Bangladesh Holidays</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-0 max-w-2xl leading-relaxed drop-shadow-md">
          A definitive guide to public holidays, beautifully paired with the natural wonders 
          of the country. Always fresh, always synced.
        </p>

        {/* Carousel Indicators */}
        <div className="flex items-center gap-2 mt-8 justify-center md:justify-start">
            {IMAGES.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-brand-400' : 'w-4 bg-white/40 hover:bg-white/70'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
