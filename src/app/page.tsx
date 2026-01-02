"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { VideoWithFallback } from "./VideoWithFallback";
import camsData from "./cams.json";

export default function Home() {
  // State
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);
  const [autoSwitchOpen, setAutoSwitchOpen] = useState(false);
  const [autoSwitchIndex, setAutoSwitchIndex] = useState<number>(0);
  const [musicMuted, setMusicMuted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const cams = camsData;

  // Auto-switch logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoSwitchOpen) {
      interval = setInterval(() => {
        setAutoSwitchIndex((prev) => (prev + 1) % cams.length);
      }, 10000); // Switch every 10s
    }
    return () => clearInterval(interval);
  }, [autoSwitchOpen, cams.length]);

  // Audio start logic
  useEffect(() => {
    if (typeof window === "undefined" || musicStarted) return;
    const startMusic = () => {
      if (audioRef.current) {
        audioRef.current.muted = musicMuted;
        audioRef.current.play().catch(() => { });
        setMusicStarted(true);
      }
    };
    window.addEventListener("pointerdown", startMusic, { once: true });
    return () => window.removeEventListener("pointerdown", startMusic);
  }, [musicMuted, musicStarted]);

  // Toggle music wrapper
  const toggleMusic = () => {
    setMusicMuted((prev) => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  };

  const activeCam = fullscreenIdx !== null ? cams[fullscreenIdx] :
    (autoSwitchOpen ? cams[autoSwitchIndex] : null);

  return (
    <main className="min-h-screen relative p-6 pb-20">
      {/* Subtle texture overlay for depth */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating Glass Navbar */}
      <nav className="sticky top-4 z-50 max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex items-center justify-between animate-entrance shadow-[0_8px_32px_rgba(0,0,0,0.4)]" suppressHydrationWarning>
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 animate-logo">
            <Image src="/monitor.png" alt="Logo" fill className="object-contain invert brightness-200 drop-shadow-lg" unoptimized />
          </div>
          <h1 className="font-display font-bold text-xl tracking-wide text-zoo-text drop-shadow-sm">
            ZOO <span className="text-zoo-primary drop-shadow-[0_0_8px_rgba(241,191,152,0.5)]">MONITOR</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoSwitchOpen(true)}
            className="glass-button rounded-full px-5 py-2.5 flex items-center gap-2.5 text-sm font-semibold text-zoo-primary hover:scale-105 transition-transform"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-zoo-primary animate-pulse-glow shadow-[0_0_8px_rgba(241,191,152,0.8)]" />
            Cycle Mode
          </button>

          <button
            onClick={toggleMusic}
            className="glass-button w-11 h-11 rounded-full flex items-center justify-center text-zoo-primary hover:scale-110 transition-transform relative group"
            aria-label="Toggle Music"
          >
            <Image
              src={musicMuted ? "/music-muted.png" : "/music.png"}
              width={22}
              height={22}
              alt="Music"
              className="invert brightness-200 transition-transform group-hover:scale-110"
              unoptimized
            />
            {!musicMuted && (
              <span className="absolute inset-0 rounded-full bg-zoo-primary/20 animate-ping opacity-75" suppressHydrationWarning />
            )}
          </button>
        </div>
      </nav>

      {/* Grid Content */}
      <section className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-10 relative">
        {cams.map((cam, idx) => (
          <div
            key={cam.id}
            onClick={() => setFullscreenIdx(idx)}
            className="group glass-panel rounded-3xl overflow-hidden cursor-pointer relative h-64 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(241,191,152,0.25)] animate-entrance border border-transparent hover:border-zoo-primary/30"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Media Layer */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500">
              {cam.type === "video" ? (
                <VideoWithFallback src={cam.link} poster={cam.poster} name={cam.name} />
              ) : cam.type === "img" ? (
                <Image 
                  src={cam.link} 
                  alt={cam.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  loading="lazy"
                  unoptimized 
                />
              ) : cam.type === "iframe" ? (
                <iframe 
                  src={cam.link.includes('mute=') ? cam.link : `${cam.link}${cam.link.includes('?') ? '&' : '?'}mute=1`}
                  title={cam.name} 
                  className="w-full h-full border-none pointer-events-none"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen={false}
                />
              ) : null}
            </div>

            {/* Gradient Overlay for Text - Enhanced */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />


            {/* Content Layer */}
            <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between z-10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${cam.type === 'video' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]'}`}></span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/90 drop-shadow-sm">
                    {cam.type === 'video' ? 'Live Feed' : cam.type === 'iframe' ? 'YouTube' : 'Video'}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-zoo-primary transition-all duration-300 drop-shadow-lg group-hover:drop-shadow-[0_0_12px_rgba(241,191,152,0.6)]">
                  {cam.name}
                </h3>
              </div>

              <div className="w-9 h-9 rounded-full glass-button flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ml-3 flex-shrink-0">
                <Image src="/expand.png" width={16} height={16} alt="Open" className="invert brightness-200" unoptimized />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center mt-20 mb-8 text-zoo-muted text-sm opacity-70">
        <p className="font-display tracking-wide">
          San Diego Zoo Monitor • <span className="text-zoo-primary/80">Designed with love by Kavinayan</span>
        </p>
      </footer>

      {/* Audio Element */}
      <audio ref={audioRef} src="/music.mp3" loop muted={musicMuted} className="hidden" />

      {/* Fullscreen Modal (Unified for both manual and auto-switch) */}
      {(fullscreenIdx !== null || autoSwitchOpen) && activeCam && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 animate-in fade-in duration-500">
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => { setFullscreenIdx(null); setAutoSwitchOpen(false); }} 
          />

          <div className="relative w-[95vw] h-[85vh] max-w-7xl rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col animate-in zoom-in-95 duration-500">
            {/* Header - No blur */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
              <div className="flex-1 min-w-0 flex items-center gap-4">
                <h2 className="font-display text-xl font-bold text-white drop-shadow-lg whitespace-nowrap truncate">
                  {activeCam.name}
                </h2>
                <span className="text-zoo-primary opacity-90 text-xs font-mono tracking-wider whitespace-nowrap">
                  {autoSwitchOpen ? `🔄 AUTO CYCLE MODE` : '📺 LIVE VIEW'}
                </span>
              </div>
              <button
                onClick={() => { setFullscreenIdx(null); setAutoSwitchOpen(false); }}
                className="glass-button w-12 h-12 rounded-full flex items-center justify-center hover:bg-zoo-primary/30 hover:scale-110 transition-all duration-300 ml-4 flex-shrink-0"
                aria-label="Close"
              >
                <Image src="/close.png" width={24} height={24} alt="Close" className="invert brightness-200" unoptimized />
              </button>
            </div>

            {/* Main Content - Crystal clear, no blur */}
            <div className="flex-1 bg-black relative rounded-b-[2rem] overflow-hidden">
              {activeCam.type === "video" ? (
                <VideoWithFallback src={activeCam.link} poster={activeCam.poster} name={activeCam.name} />
              ) : activeCam.type === "img" ? (
                <div className="relative w-full h-full">
                  <Image src={activeCam.link} alt={activeCam.name} fill className="object-contain" unoptimized />
                </div>
              ) : activeCam.type === "iframe" ? (
                <iframe 
                  src={activeCam.link.includes('mute=') ? activeCam.link : `${activeCam.link}${activeCam.link.includes('?') ? '&' : '?'}mute=1`}
                  title={activeCam.name} 
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen={false}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

