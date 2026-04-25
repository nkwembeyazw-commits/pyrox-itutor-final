import React from "react";
import { cn } from "@/lib/utils";
interface BrandLogoProps {
  variant?: "icon" | "full";
  className?: string;
  size?: number;
}
export function BrandLogo({ variant = "full", className, size = 48 }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        {/* Hexagonal Frame */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full drop-shadow-neon-cyan transition-all duration-500 group-hover:scale-110"
        >
          <path
            d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-accent/80"
          />
        </svg>
        {/* Stylized 'X' symbol */}
        <svg
          viewBox="0 0 100 100"
          className="w-3/5 h-3/5 drop-shadow-neon-red transform transition-transform group-hover:rotate-[360deg] duration-1000"
        >
          <path
            d="M20 20 L80 80 M80 20 L20 80"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className="text-primary"
          />
        </svg>
      </div>
      {variant === "full" && (
        <div className="flex flex-col justify-center">
          <span className="text-xl font-display font-black tracking-tighter text-white leading-none">
            PYROX<span className="text-primary">-iTutor</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-accent font-bold mt-1 animate-pulse">
            Elite Control
          </span>
        </div>
      )}
    </div>
  );
}