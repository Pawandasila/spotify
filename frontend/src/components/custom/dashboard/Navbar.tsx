"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useAuth } from "@/context/auth.context";

const Navbar = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, logoutUser, loading } = useAuth();

  const logoutUserHandler = async () => {
    await logoutUser();
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filters = [
    { id: "All", label: "All", icon: "🎵" },
    { id: "Music", label: "Music", icon: "🎶" },
    { id: "Podcasts", label: "Podcasts", icon: "🎙️" },
    { id: "Playlists", label: "Playlists", icon: "📂" },
    { id: "Artists", label: "Artists", icon: "👨‍🎤" },
    { id: "Albums", label: "Albums", icon: "💿" }
  ];

  return (
    <div className="p-2 lg:p-4">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-6">
        
        {/* Left Side - Navigation & Search */}
        <div className="flex items-center gap-4 flex-1">
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button className="group w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105">
              <svg className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="group w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105">
              <svg className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md flex-1">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className={`w-5 h-5 transition-colors duration-200 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="What do you want to listen to?"
                className="w-full pl-12 pr-4 py-3 bg-card/60 backdrop-blur-xl border border-border/30 rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>
        </div>

        {/* Right Side - User Actions */}
        <div className="flex items-center gap-3">
          
          {/* Premium Badge */}
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-primary/25">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-sm">Premium</span>
          </button>

          {/* Notifications */}
          <button className="relative w-10 h-10 bg-card/60 hover:bg-card/80 backdrop-blur-xl border border-border/30 hover:border-primary/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 group">
            <svg className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full border border-card"></div>
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1 pr-3 bg-card/60 hover:bg-card/80 backdrop-blur-xl border border-border/30 hover:border-primary/30 rounded-full transition-all duration-200 hover:scale-105 group outline-none">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-muted text-foreground font-semibold">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      getUserInitials()
                    )}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {loading ? (
                    <div className="w-12 h-4 bg-muted/50 rounded animate-pulse"></div>
                  ) : (
                    user?.name || "User"
                  )}
                </span>
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-4" align="end">
              <DropdownMenuLabel>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" alt={user?.name || "User"} />
                    <AvatarFallback className="bg-muted text-foreground font-semibold">
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        getUserInitials()
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    {loading ? (
                      <>
                        <div className="w-20 h-4 bg-muted/50 rounded animate-pulse"></div>
                        <div className="w-24 h-3 bg-muted/30 rounded animate-pulse"></div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || "user@example.com"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className={`cursor-pointer text-destructive focus:text-destructive ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={loading ? undefined : logoutUserHandler}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {loading ? "Loading..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-md hover:shadow-primary/10 whitespace-nowrap ${
              activeFilter === filter.id
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                : 'bg-card/60 hover:bg-card/80 backdrop-blur-xl border border-border/30 hover:border-primary/30 text-foreground hover:text-primary'
            }`}
          >
            <span className="text-sm">{filter.icon}</span>
            <span className="text-sm">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;