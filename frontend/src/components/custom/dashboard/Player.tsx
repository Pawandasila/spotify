'use client'

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSongData } from "@/context/song.context";

const Player = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { 
    song, 
    isPlaying, 
    setIsPlaying, 
    nextSong, 
    prevSong, 
    fetchSingleSong,
    selectedSong 
  } = useSongData();
  
  const [volume, setVolume] = useState<number>(0.7);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isDraggingProgress, setIsDraggingProgress] = useState<boolean>(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState<boolean>(false);

  // Fetch single song when selectedSong changes
  useEffect(() => {
    if (selectedSong) {
      fetchSingleSong();
    }
  }, [selectedSong, fetchSingleSong]);

  // Auto-play when song changes and isPlaying is true
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && song?.audioUrl) {
      audio.src = song.audioUrl;
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    }
  }, [song, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetaData = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      if (!isDraggingProgress) {
        setProgress(audio.currentTime || 0);
      }
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all' || repeatMode === 'off') {
        nextSong();
      }
    };

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [isDraggingProgress, repeatMode, nextSong, isPlaying]);

  const handlePlayPause = () => {
    if (audioRef.current && song?.audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setProgress(newTime);
  };

  const handleProgressMouseDown = () => {
    setIsDraggingProgress(true);
  };

  const handleProgressMouseUp = () => {
    setIsDraggingProgress(false);
  };

  const handleVolumeMouseDown = () => {
    setIsDraggingVolume(true);
  };

  const handleVolumeMouseUp = () => {
    setIsDraggingVolume(false);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (progress / duration) * 100 || 0;

  return (
    <div className="h-full bg-card/95 backdrop-blur-xl border-t border-border/20 flex items-center px-3 lg:px-4">
      <audio 
        ref={audioRef} 
        src={song?.audioUrl || undefined} 
        preload="metadata"
      />
      
      {/* Left Section - Now Playing */}
      <div className="flex items-center gap-3 min-w-0 flex-1 lg:max-w-[25%]">
        <div className="relative group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={song?.thumbnail || "/window.svg"}
              alt={song?.title || "Album Cover"}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground truncate group cursor-pointer hover:underline">
            {song?.title || "No song selected"}
          </h4>
          <p className="text-xs text-muted-foreground truncate hover:text-foreground hover:underline cursor-pointer">
            {song?.artist || "Unknown Artist"}
          </p>
        </div>
        
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`p-2 rounded-lg transition-all duration-200 hover:bg-muted/20 ${
            isLiked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Center Section - Player Controls */}
      <div className="flex-1 flex flex-col items-center gap-1.5 max-w-[50%] mx-6">
        
        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          {/* Shuffle */}
          <button 
            onClick={() => setIsShuffled(!isShuffled)}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-muted/20 hover:scale-110 ${
              isShuffled ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
          </button>

          {/* Previous */}
          <button 
            onClick={prevSong}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Next */}
          <button 
            onClick={nextSong}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>

          {/* Repeat */}
          <button 
            onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-muted/20 hover:scale-110 relative ${
              repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
            {repeatMode === 'one' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-primary-foreground">1</span>
              </div>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-muted-foreground tabular-nums min-w-[35px]">
            {formatTime(progress)}
          </span>
          
          <div className="flex-1 relative group">
            <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleProgressChange}
              onMouseDown={handleProgressMouseDown}
              onMouseUp={handleProgressMouseUp}
              onTouchStart={handleProgressMouseDown}
              onTouchEnd={handleProgressMouseUp}
              className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
            />
            <div 
              className={`absolute top-1/2 w-3 h-3 bg-foreground rounded-full transition-opacity duration-200 shadow-lg ${
                isDraggingProgress ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{ 
                left: `${progressPercentage}%`, 
                transform: 'translateX(-50%) translateY(-50%)' 
              }}
            />
          </div>
          
          <span className="text-xs text-muted-foreground tabular-nums min-w-[35px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right Section - Volume & Actions */}
      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end lg:max-w-[25%]">
        
        {/* Queue */}
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all duration-200 hover:scale-110">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>

        {/* Devices */}
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all duration-200 hover:scale-110">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Volume */}
        <div className="flex items-center gap-1">
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all duration-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              {volume === 0 ? (
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              ) : volume < 0.5 ? (
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
              ) : (
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              )}
            </svg>
          </button>
          
          <div className="relative group w-20">
            <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              onMouseDown={handleVolumeMouseDown}
              onMouseUp={handleVolumeMouseUp}
              onTouchStart={handleVolumeMouseDown}
              onTouchEnd={handleVolumeMouseUp}
              className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
            />
            <div 
              className={`absolute top-1/2 w-3 h-3 bg-foreground rounded-full transition-opacity duration-200 shadow-lg ${
                isDraggingVolume ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{ 
                left: `${volume * 100}%`, 
                transform: 'translateX(-50%) translateY(-50%)' 
              }}
            />
          </div>
        </div>

        {/* Fullscreen */}
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all duration-200 hover:scale-110">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Player;