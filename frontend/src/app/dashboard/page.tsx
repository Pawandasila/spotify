'use client';

import React, { useEffect } from "react";
import { 
  QuickPlayCard, 
  NewReleaseCard, 
  RecentlyPlayedCard 
} from "@/components/custom/dashboard";
import { useSongData } from "@/context/song.context";

const DashboardPage = () => {
  const { albums, fetchAlbums, songs, fetchSongs, loading, playSong } = useSongData();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
  }, [fetchAlbums, fetchSongs]);

  // Handle play button clicks
  const handlePlay = async (songId?: number, albumId?: number, playlistId?: number, type?: string) => {
    console.log(`Playing ${type}:`, { songId, albumId, playlistId });
    
    if (type === "song" && songId) {
      playSong(songId);
    } else if (type === "album" && albumId) {
      // Handle album play - could play first song of album
      console.log(`Playing album ${albumId}`);
      // You could fetch album songs and play the first one
    }
  };

  // Convert albums to quick play items format
  const quickPlayItems = albums.slice(0, 6).map(album => ({
    id: album.id,
    name: album.title,
    image: album.thumbnail,
    type: "album"
  }));

  // Convert songs to recently played items format
  const recentlyPlayedItems = songs.slice(0, 10).map(song => ({
    id: song.id,
    name: song.title,
    image: song.thumbnail || "/window.svg",
    artist: song.artist
  }));

  // Fallback data if no albums loaded yet
  const fallbackQuickPlayItems = [
    { id: 1, name: "Liked Songs", image: "/window.svg", type: "playlist" },
    { id: 2, name: "Dj", image: "/window.svg", type: "artist" },
    { id: 3, name: "Raat", image: "/window.svg", type: "album" },
    { id: 4, name: "Sahiba", image: "/window.svg", type: "album" },
    { id: 5, name: "Old is gold", image: "/window.svg", type: "playlist" },
    { id: 6, name: "New", image: "/window.svg", type: "playlist" }
  ];

  // Fallback data for songs
  const fallbackRecentlyPlayed = [
    { id: 1, name: "Dj", image: "/window.svg" },
    { id: 2, name: "Aditya Rikhari", image: "/window.svg" },
    { id: 3, name: "Sahiba", image: "/window.svg" },
    { id: 4, name: "New", image: "/window.svg" },
    { id: 5, name: "Raat", image: "/window.svg" }
  ];

  const newReleases = [
    {
      id: 1,
      title: "Chill Mardi",
      artist: "Diljit Dosanjh, Prashan...",
      image: "/window.svg",
      type: "Single"
    }
  ];

  // const madeForYou = [
  //   {
  //     id: 1,
  //     title: "Daily Mix",
  //     subtitle: "O1",
  //     description: "Pritam, Vishal-Shekhar, Badshah an...",
  //     image: "/window.svg"
  //   },
  //   {
  //     id: 2,
  //     title: "Daily Mix",
  //     subtitle: "O2", 
  //     description: "Guru Randhawa, Harrdy Sandhu, Kara...",
  //     image: "/window.svg"
  //   }
  // ];

  return (
    <div className="space-y-8">
      
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Good morning</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg p-3 flex items-center gap-4 animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted/60 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            (quickPlayItems.length > 0 ? quickPlayItems : fallbackQuickPlayItems).map((item) => (
              <QuickPlayCard
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                type={item.type}
                onClick={() => console.log(`Clicked album: ${item.name}`)}
                onPlay={handlePlay}
              />
            ))
          )}
        </div>
      </div>

      {/* New Release Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">New release from</h2>
        </div>
        
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">D</span>
          </div>
          <span className="text-2xl font-bold ">
            Diljit Dosanjh
          </span>
        </div>

        {newReleases.map((release) => (
          <NewReleaseCard
            key={release.id}
            id={release.id}
            title={release.title}
            artist={release.artist}
            image={release.image}
            type={release.type}
            onClick={() => console.log(`Clicked new release: ${release.title}`)}
          />
        ))}
      </div>

      {/* Made For You Section */}
      {/* <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Made For</h2>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Show all
          </button>
        </div>
        
        <div className="flex items-center gap-3 text-muted-foreground mb-4">
          <span className="text-2xl font-bold ">
            pawvan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {madeForYou.map((item) => (
            <MadeForYouCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              description={item.description}
              image={item.image}
              onClick={() => console.log(`Clicked made for you: ${item.title} ${item.subtitle}`)}
            />
          ))}
        </div>
      </div> */}

      {/* Recently Played Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Songs For you</h2>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Show all
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading ? (
            // Show loading skeleton while fetching songs
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="space-y-3 animate-pulse">
                <div className="w-full aspect-square bg-muted rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted/60 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            (recentlyPlayedItems.length > 0 ? recentlyPlayedItems : fallbackRecentlyPlayed).map((item) => (
              <RecentlyPlayedCard
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                onClick={() => console.log(`Clicked song: ${item.name}`)}
                onPlay={handlePlay}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
