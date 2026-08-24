"use client";

import React from "react";

export const QuranLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "h-10 w-10",
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="50%" stopColor="#022c22" />
          <stop offset="100%" stopColor="#041b1f" />
        </linearGradient>

        <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        <radialGradient id="logoEmeraldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Base Rounded Container */}
      <rect width="100" height="100" rx="24" fill="url(#logoBgGrad)" />
      <rect
        width="98"
        height="98"
        x="1"
        y="1"
        rx="23"
        stroke="url(#logoGoldGrad)"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        fill="none"
      />

      {/* Center Ambient Radial Glow */}
      <circle cx="50" cy="50" r="38" fill="url(#logoEmeraldGlow)" />

      {/* 8-Pointed Star (Rub el Hizb Geometry) */}
      <g transform="translate(50, 50)">
        {/* Square 1 (0 deg) */}
        <rect
          x="-24"
          y="-24"
          width="48"
          height="48"
          rx="4"
          fill="#042f2e"
          stroke="url(#logoGoldGrad)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Square 2 (45 deg) */}
        <rect
          x="-24"
          y="-24"
          width="48"
          height="48"
          rx="4"
          transform="rotate(45)"
          fill="#042f2e"
          stroke="url(#logoGoldGrad)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Inner Decorative Ring */}
        <circle
          cx="0"
          cy="0"
          r="16"
          fill="#022c22"
          stroke="url(#logoGoldGrad)"
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />

        {/* Open Book / Quran Insight Noor Motif */}
        <path
          d="M-1.5 6 C-7 3, -11 0, -11 -6 C-7 -4, -3 -4, -1.5 -3 Z"
          fill="url(#logoGoldGrad)"
        />
        <path
          d="M1.5 6 C7 3, 11 0, 11 -6 C7 -4, 3 -4, 1.5 -3 Z"
          fill="url(#logoGoldGrad)"
        />

        {/* Radiance Dot */}
        <circle cx="0" cy="-8.5" r="2.2" fill="#fef08a" />
      </g>
    </svg>
  );
};
