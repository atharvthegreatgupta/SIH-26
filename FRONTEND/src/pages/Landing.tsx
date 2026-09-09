import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import shipImage from '../assets/ship.png';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white antialiased select-none">
      
      {/* Plus Jakarta Sans Font Injection */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      {/* ================= FULL BLEED BACKGROUND LAYER ================= */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.img
          src={shipImage}
          alt="Hydraoo Autonomous Vessel"
          className="w-full h-full object-cover object-center will-change-transform origin-center"
          animate={{ 
            scale: [1.04, 1.06, 1.04], 
            y: [0, -8, 0], 
            rotate: [0, 0.18, 0] 
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Subtle Vignette & Reading Contrast Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35 pointer-events-none"></div>
      </div>

      {/* ================= FOREGROUND CONTENT LAYER ================= */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:px-16 md:py-10">

        {/* Top Navigation Bar */}
        <header className="w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3m0 14v3M2 12h3m14 0h3m-3.5-6.5l-2.1 2.1M6.6 17.4l-2.1 2.1m14.9 0l-2.1-2.1M6.6 6.6L4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-base font-semibold tracking-wide text-white">No Wait Freight</span>
          </div>
          
        </header>

        {/* Main Hero Statement (Mid-Left Aligned) */}
        <main className="max-w-2xl mt-4 md:mt-0">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/15 text-slate-300 text-xs font-normal">
            <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Powering Next-Gen Fleet Management</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-white leading-[1.08]">
            Built for Oceans.<br />
            <span className="font-normal text-white">Trusted by fleets.</span>
          </h1>

          {/* CTA & Social Proof Row */}
          <div className="mt-7 flex flex-wrap items-center gap-5">
            {/* Get a Demo CTA Button */}
            <button 
              onClick={() => navigate('/demo')}
              className="flex items-center gap-2.5 pl-5 pr-2 py-2 bg-white/95 hover:bg-white text-slate-900 rounded-full shadow-xl transition-all hover:scale-[1.02] active:scale-95"
            >
              <span className="text-xs font-semibold tracking-tight">Get a Demo</span>
              <span className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center text-white">
                <svg className="w-3 h-3 translate-x-[0.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            
          </div>
        </main>

        {/* Bottom Left Supporting Narrative */}
        <footer className="max-w-md pb-2">
          <p className="text-xs md:text-[13px] text-slate-300/80 font-normal leading-relaxed">
            Delivering dependable maritime intelligence that protects your assets, enhances situational awareness, and drives operational excellence across every mile of your journey.
          </p>
        </footer>

      </div>
    </div>
  );
}