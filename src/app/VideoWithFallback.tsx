import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Props = {
  src: string;
  poster?: string;
  nightVisionClass?: string;
  name: string;
};

export function VideoWithFallback({ src, poster, nightVisionClass = "", name }: Props) {
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const maxRetries = 5;
  const retryDelay = 3000; // 3 seconds

  // Auto-retry on error
  useEffect(() => {
    if (error && retryCount < maxRetries) {
      retryTimeoutRef.current = setTimeout(() => {
        if (videoRef.current) {
          setError(false);
          setIsLoading(true);
          setRetryCount(prev => prev + 1);
          // Force reload by changing src
          const currentSrc = videoRef.current.src;
          videoRef.current.src = '';
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.src = src;
              videoRef.current.load();
            }
          }, 100);
        }
      }, retryDelay);
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [error, retryCount, src]);

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    setError(false);
    setRetryCount(0); // Reset retry count on successful load
  };

  if (error && retryCount >= maxRetries) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zoo-surface/50 backdrop-blur-sm rounded-inherit p-8 text-center animate-in fade-in glass-panel">
        <div className="w-16 h-16 rounded-full glass-button flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-zoo-primary opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="text-zoo-primary font-display font-bold text-lg drop-shadow-sm">Unable to load stream</div>
        <div className="text-zoo-muted text-sm mt-2">Stream unavailable. Will retry automatically.</div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="w-8 h-8 border-2 border-zoo-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        controls={false}
        preload="metadata"
        className={`w-full h-full object-cover transition-all duration-700 rounded-inherit ${nightVisionClass}`}
        onError={handleError}
        onLoadedData={handleLoadedData}
        onCanPlay={handleLoadedData}
      />
    </>
  );
}