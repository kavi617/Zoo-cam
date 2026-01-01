import React, { useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  poster?: string;
  nightVisionClass?: string;
  name: string;
};

export function VideoWithFallback({ src, poster, nightVisionClass = "", name }: Props) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zoo-surface/50 backdrop-blur-sm rounded-inherit p-8 text-center animate-in fade-in glass-panel">
        <div className="w-16 h-16 rounded-full glass-button flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-zoo-primary opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="text-zoo-primary font-display font-bold text-lg drop-shadow-sm">Unable to load stream</div>
        <div className="text-zoo-muted text-sm mt-2">Try refreshing the page or fullscreen the video.</div>
      </div>
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      playsInline
      controls={false}
      className={`w-full h-full object-cover transition-all duration-700 rounded-inherit ${nightVisionClass}`}
      onError={() => setError(true)}
    />
  );
}