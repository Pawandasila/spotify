import React from "react";
import Image from "next/image";

interface MadeForYouCardProps {
  id: number | string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  onClick?: () => void;
}

const MadeForYouCard: React.FC<MadeForYouCardProps> = ({ 
  id, 
  title, 
  subtitle, 
  description, 
  image,
  onClick 
}) => {
  return (
    <div
      key={id}
      className="bg-card hover:bg-card/70 rounded-xl p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Image
            src={image}
            alt={title}
            width={80}
            height={80}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 rounded-lg flex items-center justify-center">
            <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
              {title}
            </span>
            <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-bold">
              {subtitle}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MadeForYouCard;
