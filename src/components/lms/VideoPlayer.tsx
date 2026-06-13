"use client";

import React, { useState } from "react";
import { PlayCircle, ShieldAlert } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string; // e.g. https://www.youtube.com/watch?v=abc or vimeo ID or Mux ID
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title = "Lesson Video" }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper to parse YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Helper to parse Vimeo ID
  const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/(?:video\/)?([0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const ytId = getYouTubeId(videoUrl);
  const vimeoId = getVimeoId(videoUrl);

  // 1. YouTube Embed Render
  if (ytId) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-800 bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?rel=0&autoplay=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  // 2. Vimeo Embed Render
  if (vimeoId || (/^\d+$/.test(videoUrl))) {
    const id = vimeoId || videoUrl;
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-800 bg-black">
        <iframe
          src={`https://player.vimeo.com/video/${id}?autoplay=0&byline=0&portrait=0&title=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  // 3. Mux or Mock native player fallback (if it's a stream URL or playback ID)
  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gold-500/10 bg-slate-950 flex flex-col items-center justify-center p-6 text-center group">
      {!isPlaying ? (
        <div className="space-y-4">
          <button
            onClick={() => setIsPlaying(true)}
            className="p-5 bg-gold-500 hover:bg-gold-600 rounded-full text-primary shadow-lg hover:shadow-gold-500/20 transition-all cursor-pointer transform hover:scale-105 inline-flex items-center justify-center"
          >
            <PlayCircle className="h-8 w-8 fill-current" />
          </button>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">
              {title}
            </h4>
            <p className="text-[10px] text-gold-500 uppercase tracking-widest">
              Secured Mux Video Stream (ID: {videoUrl.substring(0, 8)}...)
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-slate-900 flex flex-col items-center justify-center space-y-3">
          <ShieldAlert className="h-10 w-10 text-gold-500" />
          <p className="text-xs text-slate-350">
            Playback session authorized. Custom HLS player decryption mock.
          </p>
          <button
            onClick={() => setIsPlaying(false)}
            className="text-[10px] font-bold text-gold-500 border border-gold-500/20 px-3 py-1.5 rounded-full hover:bg-gold-500/10"
          >
            Close Video
          </button>
        </div>
      )}
    </div>
  );
};
