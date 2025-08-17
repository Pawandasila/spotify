import React, { useState } from "react";
import Image from "next/image";
import { useSongData } from "@/context/song.context";
import toast from "react-hot-toast";

interface PlayButtonProps {
  songId?: number;
  albumId?: number;
  playlistId?: number;
  type?: "song" | "album" | "playlist";
  size?: "sm" | "md" | "lg";
  onPlay?: (songId?: number, albumId?: number, playlistId?: number, type?: string) => void;
  onAddToPlaylist?: (songId?: number, albumId?: number, type?: string) => void;
  className?: string;
  showBothIcons?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({ 
  songId,
  albumId,
  playlistId,
  type = "song",
  size = "md",
  onPlay,
  onAddToPlaylist,
  className = "",
  showBothIcons = true
}) => {
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);
  const { playlists, addSongToPlaylist, playSong } = useSongData();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (songId) {
      playSong(songId);
    } else {
      onPlay?.(songId, albumId, playlistId, type);
    }
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (songId) {
      setShowPlaylistSelector(true);
    } else {
      onAddToPlaylist?.(songId, albumId, type);
    }
  };

  const handlePlaylistSelect = async (selectedPlaylistId: number) => {
    if (songId) {
      try {
        const success = await addSongToPlaylist(selectedPlaylistId, songId);
        if (success) {
          toast.success('Song added to playlist successfully!');
        } else {
          toast.error('Failed to add song to playlist. Please try again.');
        }
      } catch {
        toast.error('An error occurred while adding the song.');
      }
    }
    setShowPlaylistSelector(false);
  };

  return (
    <div className="flex items-center gap-2">
      {showBothIcons ? (
        <div className="flex items-center gap-2">
          <button 
            className={`${sizeClasses[size]} cursor-pointer bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105`}
            onClick={handlePlay}
          >
            <svg 
              className={`${iconSizes[size]} text-primary-foreground ml-0.5`} 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          
          <button 
            className={`${sizeClasses[size]} cursor-pointer bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105`}
            onClick={handleAddToPlaylist}
          >
            <svg 
              className={`${iconSizes[size]} text-secondary-foreground`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      ) : (
        <button 
          className={`${sizeClasses[size]} cursor-pointer bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 ${className}`}
          onClick={handlePlay}
        >
          <svg 
            className={`${iconSizes[size]} text-primary-foreground ml-0.5`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      )}

      {/* Playlist Selector Modal */}
      {showPlaylistSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPlaylistSelector(false)}>
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add to Playlist</h3>
              <button
                onClick={() => setShowPlaylistSelector(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {playlists && playlists.length > 0 ? (
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handlePlaylistSelect(playlist.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/20 text-left transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      {playlist.thumbnail ? (
                        <Image
                          src={playlist.thumbnail}
                          alt={playlist.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <svg className="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{playlist.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {playlist.isPublic ? 'Public' : 'Private'} playlist
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No playlists found</p>
                <p className="text-xs mt-1">Create a playlist first to add songs</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayButton;
