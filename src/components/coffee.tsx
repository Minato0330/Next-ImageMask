"use client";

import { useId } from "react";

export function CoffeeIcon({ className }: { className?: string }) {
  const id = useId();
  const gradientId = `coffee-gradient-${id}`;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M2 21h18v-2H2v2zm16-11v8H4v-8h14zm2-2H2v10a2 2 0 002 2h14a2 2 0 002-2v-2h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2zm0 6v-4h2v4h-2z"
      />
      <g>
        <rect x="7" y="2" width="1.5" height="3" rx="0.75" fill={`url(#${gradientId})`} opacity="0.6">
          <animate
            attributeName="y"
            values="3;1;3"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0.3;0.6"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="11" y="1" width="1.5" height="4" rx="0.75" fill={`url(#${gradientId})`} opacity="0.5">
          <animate
            attributeName="y"
            values="2;0;2"
            dur="1.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0.2;0.5"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="15" y="2" width="1.5" height="3" rx="0.75" fill={`url(#${gradientId})`} opacity="0.6">
          <animate
            attributeName="y"
            values="3;1;3"
            dur="1.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0.3;0.6"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  );
}
