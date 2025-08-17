"use client";

import Navbar from "@/components/custom/dashboard/Navbar";
import Player from "@/components/custom/dashboard/Player";
import Sidebar from "@/components/custom/dashboard/Sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col">
   
      {/* Top Content Area (Sidebar + Main Content) */}
      <div className="flex-1 flex gap-2 p-2 min-h-0">
        
        {/* Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="h-full bg-card rounded-lg border border-border overflow-hidden">
            <Sidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="h-full bg-card rounded-lg border border-border overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-none">
              {/* Navbar at the top of content area */}
              <div className="bg-card border-b border-border sticky top-0 z-20">
                <Navbar />
              </div>
              
              {/* Content Container */}
              <div className="p-6 lg:p-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Player */}
      <div className="h-22 flex-shrink-0 px-2 pb-2">
        <div className="h-full bg-card rounded-lg border border-border overflow-hidden">
          <Player />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className="lg:hidden fixed inset-0 z-50 hidden"
        id="mobile-sidebar-overlay"
      >
        <div className="absolute left-0 top-0 h-full w-80 bg-card border-r border-border">
          <Sidebar />
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;
