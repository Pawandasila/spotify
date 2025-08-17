"use client";

import { Logo } from "@/components/custom/logo";
import { useState } from "react";
import { useSongData } from "@/context/song.context";
import Image from "next/image";
import CreatePlaylistDialog from "./CreatePlaylistDialog";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [selectedFilter, setSelectedFilter] = useState("Playlists");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  const router = useRouter();

  // Get playlists from context
  const { playlists, loading, createPlaylistFromDialog } = useSongData();

  // Handle create playlist with dialog
  const handleCreatePlaylist = async (data: {
    name: string;
    description: string;
    thumbnail?: File;
  }) => {
    setIsCreatingPlaylist(true);
    try {
      const success = await createPlaylistFromDialog(data);
      if (success) {
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const mainMenuItems = [
    {
      id: "Home",
      label: "Home",
      href:"/dashboard",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      )
    },
    {
      id: "Search",
      label: "Search",
      href: "/dashboard/search",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    }
  ];

  const libraryFilters = ["Playlists", "Artists"];

  // Create library items from real playlists
  const createLibraryItems = () => {
    const items = [
      { 
        id: "liked-songs", 
        title: "Liked Songs", 
        type: "Playlist",
        count: "Your liked songs",
        author: "",
        image: "💚",
        gradient: "from-purple-500 to-pink-500",
        isPublic: false,
        description: undefined
      }
    ];

    // Add real playlists from context - only if playlists exist
    if (playlists && playlists.length > 0) {
      const playlistItems = playlists.map(playlist => ({
        id: `playlist-${playlist.id}`,
        title: playlist.name || "Untitled Playlist",
        type: "Playlist",
        author: "You",
        image: playlist.thumbnail && playlist.thumbnail.trim() !== "" ? playlist.thumbnail : null,
        description: playlist.description,
        isPublic: playlist.isPublic,
        createdAt: playlist.createdAt,
        count: playlist.isPublic ? "Public playlist" : "Private playlist",
        gradient: undefined
      }));
      
      return [...items, ...playlistItems];
    }

    return items;
  };

  const libraryItems = createLibraryItems();

  const filteredItems = libraryItems.filter(item => 
    selectedFilter === "Playlists" ? item.type === "Playlist" : item.type === "Artist"
  );
  

  return (
    <div className="h-full flex flex-col">
      
      {/* Top Navigation Section - Fixed */}
      <div className="bg-card/80 backdrop-blur-xl rounded-lg m-2 mb-0 flex-shrink-0">
        <div className="p-3">
          {/* Logo */}
          <div className="mb-3">
            <Logo size="sm" showText={true} />
          </div>

          {/* Main Navigation */}
          <div className="space-y-1">
            {mainMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  if (item.href) {
                    router.push(item.href);
                  }
                }}
                className={`w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-all duration-200 group ${
                  activeItem === item.id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`transition-colors duration-200 ${
                  activeItem === item.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {item.icon}
                </div>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Library Section - Expandable with Constrained Height */}
      <div className="flex-1 bg-card/80 backdrop-blur-xl rounded-lg m-2 mt-2 flex flex-col min-h-0 max-h-[calc(100vh-200px)]">
        
        {/* Library Header - Fixed */}
        <div className="p-3 pb-0 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <h3 className="text-sm font-semibold text-foreground">Your Library</h3>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all duration-200"
                title="Create playlist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 mb-3">
            {libraryFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedFilter === filter
                    ? 'bg-foreground text-background'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search and Sort */}
          <div className="flex items-center justify-between mb-3">
            <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
              <span>Recents</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Library Items */}
        <div className="flex-1 overflow-y-auto scrollbar-spotify px-3 pb-3">
          {loading ? (
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-muted/40 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted/40 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-muted/30 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.length && filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    // Extract numeric ID for playlists
                    if (item.type === "Playlist" && item.id.startsWith("playlist-")) {
                      const playlistId = item.id.replace("playlist-", "");
                      router.push(`/dashboard/playlist/${playlistId}`);
                    }
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/20 transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                    {item.gradient ? (
                      <div className={`w-full h-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-lg`}>
                        {item.image}
                      </div>
                    ) : item.image && typeof item.image === 'string' && item.image.trim() !== '' && item.image.startsWith('http') ? (
                      <Image
                        src={item.image} 
                        alt={item.title}
                        height={100}
                        width={100}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/window.svg';
                        }}
                      />
                    ) : (
                      <Image
                        src="/window.svg"
                        alt={item.title}
                        height={100}
                        width={100}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.type}
                      {item.author && ` • ${item.author}`}
                      {item.count && ` • ${item.count}`}
                      {item.isPublic !== undefined && ` • ${item.isPublic ? 'Public' : 'Private'}`}
                    </p>
                  </div>
                </div>
              ))}
              {filteredItems.length === 1 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No {selectedFilter.toLowerCase()} found</p>
                  <p className="text-xs mt-1">Create your first playlist to get started</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Playlist Dialog */}
      <CreatePlaylistDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreatePlaylist}
        isLoading={isCreatingPlaylist}
      />
    </div>
  );
};

export default Sidebar;
