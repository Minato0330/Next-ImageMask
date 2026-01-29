"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

interface AnimatedRotateProps {
  rotate: number;
  children: ReactNode;
  className?: string;
  duration?: number;
}

export function AnimatedRotate({
  rotate,
  children,
  className,
  duration = 0.15,
}: AnimatedRotateProps) {
  return (
    <motion.div
      animate={{ rotate }}
      transition={{ duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
