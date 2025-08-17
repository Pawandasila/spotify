import React from "react";
import Image from "next/image";
import PlayButton from "@/components/custom/PlayButton";

interface RecentlyPlayedCardProps {
  id: number | string;
  name: string;
  image: string;
  onClick?: () => void;
  onPlay?: (songId?: number, albumId?: number, playlistId?: number, type?: string) => void;
}

const RecentlyPlayedCard: React.FC<RecentlyPlayedCardProps> = ({ 
  id, 
  name, 
  image,
  onClick,
  onPlay
}) => {
  return (
    <div
      key={id}
      className="bg-card hover:bg-card/60 rounded-xl p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="relative">
          <Image
            src={image}
            alt={name}
            width={200}
            height={200}
            className="w-full aspect-square rounded-lg object-cover"
          />
          <PlayButton
            songId={Number(id)}
            type="song"
            size="lg"
            onPlay={onPlay}
          />
        </div>
        <div>
          <h3 className="font-semibold text-foreground truncate">
            {name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default RecentlyPlayedCard;
