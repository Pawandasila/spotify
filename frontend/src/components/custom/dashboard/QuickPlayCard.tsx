import Image from "next/image";
import React from "react";
import PlayButton from "@/components/custom/PlayButton";

interface QuickPlayCardProps {
  id: number | string;
  name: string;
  image: string;
  type: string;
  onClick?: () => void;
  onPlay?: (songId?: number, albumId?: number, playlistId?: number, type?: string) => void;
}

const QuickPlayCard: React.FC<QuickPlayCardProps> = ({ 
  id, 
  name, 
  image, 
  type, 
  onClick,
  onPlay
}) => {
  return (
    <div
      key={id}
      className="bg-card hover:bg-card/80 rounded-lg p-3 cursor-pointer flex items-center gap-4"
      onClick={onClick}
    >
      <div className="relative">
        <Image
          src={image}
          alt={name}
          height={100}
          width={100}
          priority
          quality={100}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <PlayButton
          albumId={type === "album" ? Number(id) : undefined}
          songId={type === "song" ? Number(id) : undefined}
          type={type as "song" | "album" | "playlist"}
          size="md"
          onPlay={onPlay}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground capitalize">{type}</p>
      </div>
    </div>
  );
};

export default QuickPlayCard;
