"use client";

import React, { useEffect, useState } from 'react';
import { useSongData, type Song } from '@/context/song.context';
import Image from 'next/image';
import PlayButton from '@/components/custom/PlayButton';
import toast from 'react-hot-toast';

const PlaylistPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { currentPlaylist, fetchPlaylistById, fetchPlaylistSongs, loading } = useSongData();
  const [isLoading, setIsLoading] = useState(true);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);

  useEffect(() => {
    const loadPlaylist = async () => {
      const resolvedParams = await params;
      if (resolvedParams.id) {
        setIsLoading(true);
        try {
          await fetchPlaylistById(parseInt(resolvedParams.id));
          const songs = await fetchPlaylistSongs(parseInt(resolvedParams.id));
          setPlaylistSongs(songs);
        } catch (error) {
          console.error('Error fetching playlist:', error);
          toast.error('Failed to load playlist');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPlaylist();
  }, [params, fetchPlaylistById, fetchPlaylistSongs]);

  if (isLoading || loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="flex gap-6 mb-8">
            <div className="w-64 h-64 bg-muted/30 rounded-lg"></div>
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-muted/30 rounded w-20"></div>
              <div className="h-8 bg-muted/30 rounded w-80"></div>
              <div className="h-4 bg-muted/30 rounded w-60"></div>
              <div className="h-4 bg-muted/30 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPlaylist) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Playlist Not Found</h1>
          <p className="text-muted-foreground">The playlist you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex-1 p-6">
      {/* Playlist Header */}
      <div className="flex gap-6 mb-8">
        {/* Playlist Thumbnail */}
        <div className="w-64 h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          {currentPlaylist.thumbnail ? (
            <Image
              src={currentPlaylist.thumbnail}
              alt={currentPlaylist.name}
              width={256}
              height={256}
              className="w-full h-full object-cover"
              onError={() => {
                // Handle image error
              }}
            />
          ) : (
            <svg className="w-20 h-20 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          )}
        </div>

        {/* Playlist Info */}
        <div className="flex-1 flex flex-col justify-end">
          <p className="text-sm font-medium text-muted-foreground mb-2">Playlist</p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {currentPlaylist.name}
          </h1>
          {currentPlaylist.description && (
            <p className="text-muted-foreground mb-4 text-lg">
              {currentPlaylist.description}
            </p>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Created on {formatDate(currentPlaylist.createdAt)}</span>
            <span>•</span>
            <span>{currentPlaylist.isPublic ? 'Public' : 'Private'} playlist</span>
            <span>•</span>
            <span>{playlistSongs.length} songs</span>
          </div>
        </div>
      </div>

      {/* Play Controls */}
      <div className="flex items-center gap-4 mb-8">
        <button className="w-14 h-14 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105">
          <svg className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        
        <button className="w-8 h-8 text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        <button className="w-8 h-8 text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>

      {/* Songs List Header */}
      <div className="grid grid-cols-[auto_4fr_2fr_1fr_auto] gap-4 px-4 py-2 border-b border-muted/20 text-sm text-muted-foreground mb-4">
        <div className="w-4">#</div>
        <div>Title</div>
        <div>Album</div>
        <div>Duration</div>
        <div className="w-4"></div>
      </div>

      {/* Songs List */}
      <div className="space-y-1">
        {playlistSongs.length > 0 ? (
          playlistSongs.map((song, index) => (
            <div
              key={song.id}
              className="grid grid-cols-[auto_4fr_2fr_1fr_auto] gap-4 px-4 py-2 hover:bg-muted/10 rounded-lg group transition-colors"
            >
              <div className="w-4 flex items-center justify-center text-muted-foreground text-sm">
                <span className="group-hover:hidden">{index + 1}</span>
                <button className="hidden group-hover:block w-4 h-4">
                  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted/30 rounded flex items-center justify-center">
                  {song.thumbnail ? (
                    <Image
                      src={song.thumbnail}
                      alt={song.title}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-medium text-foreground">{song.title}</div>
                  <div className="text-sm text-muted-foreground">{song.artist}</div>
                </div>
              </div>

              <div className="flex items-center text-muted-foreground">
                {song.album?.title || 'Unknown Album'}
              </div>

              <div className="flex items-center text-muted-foreground text-sm">
                {song.duration || '0:00'}
              </div>

              <div className="flex items-center">
                <PlayButton 
                  songId={song.id}
                  type="song"
                  size="sm"
                  showBothIcons={true}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No songs in this playlist</h3>
            <p className="text-muted-foreground">Add some songs to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;