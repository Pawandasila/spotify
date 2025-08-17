'use client'

import axios from "axios";
import toast from "react-hot-toast";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const songServer = "http://localhost:8002/api/v1"; // Song Service

export interface Album {
  id: number;
  title: string;
  artist: string;
  releaseDate: string;
  description: string;
  thumbnail: string;
  createdAt?: string;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  albumId?: number;
  thumbnail?: string;
  duration: string;
  audioUrl: string;
  createdAt?: string;
  playCount?: number;
  genre?: string;
  isActive?: boolean;
  
  album?: Album;
}

export interface Playlist {
  id: number;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

interface SongContextType {
  songs: Song[];
  song: Song | null;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  loading: boolean;
  selectedSong: number | null;
  setSelectedSong: (id: number) => void;
  albums: Album[];
  fetchSingleSong: () => Promise<void>;
  nextSong: () => void;
  prevSong: () => void;
  albumSong: Song[];
  albumData: Album | null;
  fetchAlbumsongs: (id: number) => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
  playSong: (songId: number) => void;
  
  // Playlist functionality
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  currentPlaylistSongs: Song[];
  createPlaylist: (name: string, description?: string, thumbnail?: File) => Promise<boolean>;
  createPlaylistFromDialog: (data: { name: string; description: string; thumbnail?: File }) => Promise<boolean>;
  addSongToPlaylist: (playlistId: number, songId: number) => Promise<boolean>;
  fetchUserPlaylists: () => Promise<void>;
  fetchPlaylistById: (playlistId: number) => Promise<void>;
  fetchPlaylistSongs: (playlistId: number) => Promise<Song[]>;
  fetchPlaylistWithSongs: (playlistId: number) => Promise<void>;
  deletePlaylist: (playlistId: number) => Promise<boolean>;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

interface SongProviderProps {
  children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSong, setSelectedSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [song, setSong] = useState<Song | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [albumSong, setAlbumSong] = useState<Song[]>([]);
  const [albumData, setAlbumData] = useState<Album | null>(null);
  
  // Playlist state
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentPlaylistSongs, setCurrentPlaylistSongs] = useState<Song[]>([]);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${songServer}/songs/songs`);
      console.log(data)
      setSongs(data.data || data);
      if (data.data && data.data.length > 0) {
        setSelectedSong(data.data[0].id);
      } else if (data.length > 0) {
        setSelectedSong(data[0].id);
      }
      setIsPlaying(false);
    } catch (error) {
      console.log("error fetching songs" , error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSingleSong = useCallback(async () => {
    if (!selectedSong) return;
    try {
      const { data } = await axios.get(`${songServer}/songs/songs/${selectedSong}`);
      setSong(data.data || data);
    } catch (error) {
      console.log(error);
    }
  }, [selectedSong]);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${songServer}/songs/albums`);
      console.log(data);
      setAlbums(data.data || data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextSong = useCallback(() => {
    if (index === songs.length - 1) {
      setIndex(0);
      setSelectedSong(songs[0]?.id);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
      setSelectedSong(songs[index + 1]?.id);
    }
  }, [index, songs]);

  const prevSong = useCallback(() => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setSelectedSong(songs[index - 1]?.id);
    }
  }, [index, songs]);

  const playSong = useCallback((songId: number) => {
    setSelectedSong(songId);
    setIsPlaying(true);
    
    // Find the song in current songs or currentPlaylistSongs
    const allSongs = [...songs, ...currentPlaylistSongs];
    const songIndex = allSongs.findIndex(s => s.id === songId);
    if (songIndex !== -1) {
      setIndex(songIndex);
      setSong(allSongs[songIndex]);
    }
    
    toast.success('Now playing!');
  }, [songs, currentPlaylistSongs]);

  const fetchAlbumsongs = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${songServer}/albums/${id}/songs`);
      
      if (data.data) {
        setAlbumData(data.data.album);
        setAlbumSong(data.data.songs);
      } else {
        setAlbumData(data.album);
        setAlbumSong(data.songs);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Playlist functions
  const createPlaylist = useCallback(async (name: string, description?: string, thumbnail?: File): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (description) formData.append('description', description);
      formData.append('isPublic', 'true'); // Set as public as requested
      
      const tokenData = localStorage.getItem('auth_tokens');
      const userData = localStorage.getItem('auth_user');
      
      if (tokenData && userData) {
        const tokens = JSON.parse(tokenData);
        const parsedUser = JSON.parse(userData);
        formData.append('userId', parsedUser.id);

        if (thumbnail) formData.append('thumbnail', thumbnail);
        
        const { data } = await axios.post(
          `${songServer}/playlists`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${tokens.access}`
            }
          }
        );

        if (data.data) {
          setPlaylists(prev => [...prev, data.data]);
          return true;
        }
        return false;
      } else {
        console.error('No user data found');
        return false;
      }
    } catch (error) {
      console.error('Create playlist error:', error);
      return false;
    }
  }, []);

  const createPlaylistFromDialog = useCallback(async (data: { name: string; description: string; thumbnail?: File }): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('isPublic', 'true'); // Set as public as requested
      
      const userData = localStorage.getItem('auth_user');
      const tokenData = localStorage.getItem('auth_tokens');
      
      if (userData && tokenData) {
        const user = JSON.parse(userData);
        const tokens = JSON.parse(tokenData);
        formData.append('userId', user.id);
        
        if (data.thumbnail) formData.append('thumbnail', data.thumbnail);

        const { data: responseData } = await axios.post(
          `${songServer}/playlists`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${tokens.access}`
            }
          }
        );

        if (responseData.data) {
          setPlaylists(prev => [...prev, responseData.data]);
          toast.success('Playlist created successfully!');
          return true;
        }
        return false;
      } else {
        toast.error('No user data found');
        return false;
      }
    } catch (error) {
      console.error('Create playlist error:', error);
      toast.error('Failed to create playlist');
      return false;
    }
  }, []);

  const fetchUserPlaylists = useCallback(async (): Promise<void> => {
    try {
      const userData = localStorage.getItem('auth_user');
      const tokenData = localStorage.getItem('auth_tokens');
      
      if (!userData || !tokenData) return;
      
      const user = JSON.parse(userData);
      const tokens = JSON.parse(tokenData);
      
      const { data } = await axios.get(`${songServer}/playlists/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      });
      console.log("data fetch" , data)
      
      setPlaylists(data.data || data);
    } catch (error) {
      console.error('Fetch playlists error:', error);
    }
  }, []);

  const fetchPlaylistById = useCallback(async (playlistId: number): Promise<void> => {
    try {
      const userData = localStorage.getItem('auth_user');
      const tokenData = localStorage.getItem('auth_tokens');
      
      if (!userData || !tokenData) return;
      
      const tokens = JSON.parse(tokenData);
      
      const { data } = await axios.get(`${songServer}/playlists/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      });
      setCurrentPlaylist(data.data || data);
    } catch (error) {
      console.error('Fetch playlist error:', error);
    }
  }, []);

  const fetchPlaylistSongs = useCallback(async (playlistId: number): Promise<Song[]> => {
    try {
      const userData = localStorage.getItem('auth_user');
      const tokenData = localStorage.getItem('auth_tokens');
      
      if (!userData || !tokenData) return [];
      
      const tokens = JSON.parse(tokenData);
      
      const { data } = await axios.get(`${songServer}/playlists/${playlistId}/songs`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      });
      
      // Return the songs array from the response
      const songs = data.data?.songs || [];
      setCurrentPlaylistSongs(songs); // Update context state
      return songs;
    } catch (error) {
      console.error('Fetch playlist songs error:', error);
      setCurrentPlaylistSongs([]); // Clear on error
      return [];
    }
  }, []);

  const fetchPlaylistWithSongs = useCallback(async (playlistId: number): Promise<void> => {
    try {
      // Fetch both playlist details and songs concurrently
      await Promise.all([
        fetchPlaylistById(playlistId),
        fetchPlaylistSongs(playlistId)
      ]);
    } catch (error) {
      console.error('Fetch playlist with songs error:', error);
    }
  }, [fetchPlaylistById, fetchPlaylistSongs]);

  const addSongToPlaylist = useCallback(async (playlistId: number, songId: number): Promise<boolean> => {
    try {
      const userData = localStorage.getItem('auth_user');
      const tokenData = localStorage.getItem('auth_tokens');
      
      if (!userData || !tokenData) {
        console.error('No user data found');
        return false;
      }

      const user = JSON.parse(userData);
      const tokens = JSON.parse(tokenData);
      
      await axios.post(
        `${songServer}/playlists/${playlistId}/songs`,
        { 
          songId,
          userId: user.id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens.access}`
          }
        }
      );

      return true;
    } catch (error) {
      console.error('Add song to playlist error:', error);
      return false;
    }
  }, []);

  const deletePlaylist = useCallback(async (playlistId: number): Promise<boolean> => {
    try {
      const userData = localStorage.getItem('auth_user');
      const tokenData = localStorage.getItem('auth_tokens');
      
      if (!userData || !tokenData) {
        console.error('No user data found');
        return false;
      }

      const user = JSON.parse(userData);
      const tokens = JSON.parse(tokenData);
      
      await axios.delete(
        `${songServer}/playlists/${playlistId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens.access}`
          },
          data: {
            userId: user.id
          }
        }
      );

      // Remove from local state
      setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
      if (currentPlaylist?.id === playlistId) {
        setCurrentPlaylist(null);
      }

      return true;
    } catch (error) {
      console.error('Delete playlist error:', error);
      return false;
    }
  }, [currentPlaylist]);

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
    fetchUserPlaylists();
  }, [fetchSongs, fetchAlbums, fetchUserPlaylists]);
  return (
    <SongContext.Provider
      value={{
        songs,
        selectedSong,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        loading,
        albums,
        fetchSingleSong,
        song,
        nextSong,
        prevSong,
        fetchAlbumsongs,
        albumData,
        albumSong,
        fetchSongs,
        fetchAlbums,
        playSong,
        
        // Playlist functionality
        playlists,
        currentPlaylist,
        currentPlaylistSongs,
        createPlaylist,
        createPlaylistFromDialog,
        addSongToPlaylist,
        fetchUserPlaylists,
        fetchPlaylistById,
        fetchPlaylistSongs,
        fetchPlaylistWithSongs,
        deletePlaylist,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongData = (): SongContextType => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSongData must be used within a songProvider");
  }
  return context;
};