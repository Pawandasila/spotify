"use client";

import React, { useState } from 'react';
import { useSongData, type Song, type Album } from '@/context/song.context';
import Image from 'next/image';
import PlayButton from '@/components/custom/PlayButton';

type SearchResult = (Song | Album) & {
  type: 'song' | 'album';
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { songs, albums } = useSongData();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredSongs = songs.filter(song => 
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase())
    );

    const filteredAlbums = albums.filter(album =>
      album.title.toLowerCase().includes(query.toLowerCase()) ||
      album.artist.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults([
      ...filteredSongs.map(song => ({ ...song, type: 'song' as const })),
      ...filteredAlbums.map(album => ({ ...album, type: 'album' as const }))
    ]);
  };

  return (
    <div className="flex-1 p-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Search</h1>
        
        {/* Search Input */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full pl-10 pr-4 py-3 bg-muted/20 border border-muted/40 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Search results for &quot;{searchQuery}&quot;
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="space-y-1">
              {searchResults.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-muted/10 rounded-lg group transition-colors"
                >
                  <div className="w-12 h-12 rounded bg-muted/30 flex items-center justify-center overflow-hidden">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{item.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.type === 'song' ? 'Song' : 'Album'} • {item.artist}
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayButton
                      songId={item.type === 'song' ? item.id : undefined}
                      albumId={item.type === 'album' ? item.id : undefined}
                      type={item.type}
                      size="sm"
                      showBothIcons={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground">Try searching for something else</p>
            </div>
          )}
        </div>
      )}

      {/* No Search Query */}
      {!searchQuery && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Search for music</h3>
          <p className="text-muted-foreground">Find your favorite songs, albums, and artists</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
