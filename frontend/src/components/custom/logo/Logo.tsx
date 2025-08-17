import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = "md", 
  showText = true, 
  className = "",
  animated = true
}) => {
  const sizes = {
    sm: { icon: "w-6 h-6", container: "w-10 h-10", text: "text-lg" },
    md: { icon: "w-8 h-8", container: "w-16 h-16", text: "text-2xl" },
    lg: { icon: "w-12 h-12", container: "w-20 h-20", text: "text-3xl" }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`inline-flex items-center justify-center ${sizes[size].container} bg-gradient-to-br from-primary/20 to-primary/10 rounded-full border border-primary/20`}>
        <svg 
          className={`${sizes[size].icon} text-primary`} 
          viewBox="0 0 24 24"
          fill="none"
        >
          {/* Animated Sound Bars */}
          <rect 
            x="2" 
            y="8" 
            width="2" 
            height="8" 
            fill="currentColor"
            className={animated ? "animate-pulse" : ""}
            style={{ animationDelay: "0ms", animationDuration: "1000ms" }}
          />
          <rect 
            x="6" 
            y="4" 
            width="2" 
            height="16" 
            fill="currentColor"
            className={animated ? "animate-pulse" : ""}
            style={{ animationDelay: "200ms", animationDuration: "1000ms" }}
          />
          <rect 
            x="10" 
            y="6" 
            width="2" 
            height="12" 
            fill="currentColor"
            className={animated ? "animate-pulse" : ""}
            style={{ animationDelay: "400ms", animationDuration: "1000ms" }}
          />
          <rect 
            x="14" 
            y="2" 
            width="2" 
            height="20" 
            fill="currentColor"
            className={animated ? "animate-pulse" : ""}
            style={{ animationDelay: "600ms", animationDuration: "1000ms" }}
          />
          <rect 
            x="18" 
            y="7" 
            width="2" 
            height="10" 
            fill="currentColor"
            className={animated ? "animate-pulse" : ""}
            style={{ animationDelay: "800ms", animationDuration: "1000ms" }}
          />
        </svg>
      </div>
      {showText && (
        <span className={`ml-3 font-bold text-foreground ${sizes[size].text} bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent`}>
          SoundWave
        </span>
      )}
    </div>
  );
};

export default Logo;
