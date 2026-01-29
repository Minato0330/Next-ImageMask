"use client";

import { motion } from "motion/react";

interface AnimatedTabIndicatorProps {
  layoutId: string;
  className?: string;
}

export function AnimatedTabIndicator({
  layoutId,
  className,
}: AnimatedTabIndicatorProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className={className}
      transition={{
        type: "spring",
        bounce: 0,
        duration: 0.3,
      }}
    />
  );
}
