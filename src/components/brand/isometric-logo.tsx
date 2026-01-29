"use client";

import { motion, useReducedMotion } from "motion/react";

interface IsometricLogoProps {
  size?: number;
  className?: string;
}

export function IsometricLogo({ size = 28, className }: IsometricLogoProps) {
  const prefersReducedMotion = useReducedMotion();

  // Cube dimensions for isometric view
  const cubeSize = size * 0.32;
  const w = cubeSize * 0.866; // Half width (cos 30°)
  const h = cubeSize * 0.5;   // Half height (sin 30°)
  const d = cubeSize * 0.5;   // Depth

  // Define the three faces of a cube as path data
  const topFace = `M 0,${-d} L ${w},0 L 0,${h} L ${-w},0 Z`;
  const leftFace = `M ${-w},0 L 0,${h} L 0,${h + d} L ${-w},${d} Z`;
  const rightFace = `M ${w},0 L 0,${h} L 0,${h + d} L ${w},${d} Z`;

  // Three positions in a triangle formation (isometric)
  const positions = [
    { x: 0, y: 0 },                    // center-bottom
    { x: -w * 1.2, y: -(h + d) },      // top-left
    { x: w * 1.2, y: -(h + d) },       // top-right
  ];

  // Each cube cycles through all 3 positions
  // Cube 0: 0 -> 1 -> 2 -> 0
  // Cube 1: 1 -> 2 -> 0 -> 1
  // Cube 2: 2 -> 0 -> 1 -> 2
  const getPath = (startIndex: number) => {
    const path = [];
    for (let i = 0; i <= 3; i++) {
      const pos = positions[(startIndex + i) % 3];
      path.push(pos);
    }
    return path;
  };

  const cubes = [
    { startIndex: 0, delay: 0 },
    { startIndex: 1, delay: 0 },
    { startIndex: 2, delay: 0 },
  ];

  // ViewBox calculation
  const padding = cubeSize * 1.5;
  const viewBox = `${-padding} ${-padding - (h + d)} ${padding * 2} ${padding * 2}`;

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      className={className}
      aria-label="Maskit logo"
      role="img"
      style={{ overflow: "visible" }}
    >
      {cubes.map((cube, index) => {
        const path = getPath(cube.startIndex);
        const xKeyframes = path.map((p) => p.x);
        const yKeyframes = path.map((p) => p.y);

        // Static position for reduced motion
        const staticPos = positions[cube.startIndex];

        return (
          <motion.g
            key={index}
            initial={false}
            animate={
              prefersReducedMotion
                ? { x: staticPos.x, y: staticPos.y }
                : {
                    x: xKeyframes,
                    y: yKeyframes,
                  }
            }
            transition={
              prefersReducedMotion
                ? {}
                : {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.33, 0.66, 1],
                  }
            }
          >
            {/* Left face */}
            <path d={leftFace} fill="currentColor" opacity={0.55} />
            {/* Right face */}
            <path d={rightFace} fill="currentColor" opacity={0.75} />
            {/* Top face */}
            <path d={topFace} fill="currentColor" opacity={0.35} />
          </motion.g>
        );
      })}
    </svg>
  );
}
