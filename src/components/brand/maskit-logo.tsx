"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";

interface NextImageMaskLogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const M_PATHS = [
  "M 3 24 L 3 4 L 8 4 L 8 24 Z",
  "M 3 4 L 14 18 L 25 4 L 20 4 L 14 11 L 8 4 Z",
  "M 20 24 L 20 4 L 25 4 L 25 24 Z",
];

export function NextImageMaskLogo({
  size = 24,
  animate = true,
  className,
}: NextImageMaskLogoProps) {
  const id = useId();
  const clipId = `mask-reveal${id}`;
  const shapeClipId = `mask-shape${id}`;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.svg
      viewBox="0 0 28 28"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="NextImageMask logo"
      role="img"
    >
      <defs>
        <clipPath id={clipId}>
          <motion.rect
            x={0}
            y={0}
            height={28}
            initial={animate ? { width: 0 } : false}
            animate={{ width: 28 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </clipPath>
        <clipPath id={shapeClipId}>
          {M_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {M_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={animate ? { opacity: 0, y: 4 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: EASE,
              delay: animate ? 0.1 + i * 0.06 : 0,
            }}
          />
        ))}

        <g clipPath={`url(#${shapeClipId})`}>
          <motion.rect
            y={0}
            width={28}
            height={28}
            fill="white"
            opacity={0.12}
            style={{ mixBlendMode: "overlay" }}
            initial={{ x: -28 }}
            animate={{ x: hovered ? 28 : -28 }}
            transition={
              hovered
                ? { duration: 0.5, ease: EASE }
                : { duration: 0 }
            }
          />
        </g>
      </g>
    </motion.svg>
  );
}
