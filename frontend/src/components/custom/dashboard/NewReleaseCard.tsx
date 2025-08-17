import React from "react";
import Image from "next/image";

interface NewReleaseCardProps {
  id: number | string;
  title: string;
  artist: string;
  image: string;
  type: string;
  onClick?: () => void;
}

const NewReleaseCard: React.FC<NewReleaseCardProps> = ({ 
  id, 
  title, 
  artist, 
  image, 
  type,
  onClick 
}) => {
  return (
    <div
      key={id}
      className="bg-card hover:bg-card/70 rounded-xl p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-6">
        <div className="relative">
          <Image
            src={image}
            alt={title}
            width={128}
            height={128}
            className="w-32 h-32 rounded-xl object-cover"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 rounded-xl flex items-center justify-center">
            <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{type} • {artist}</p>
            <h3 className="text-3xl font-bold text-foreground">
              {title}
            </h3>
            <div className="flex items-center gap-4 pt-2">
              <button className="w-10 h-10 bg-transparent border-2 border-foreground rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReleaseCard;
