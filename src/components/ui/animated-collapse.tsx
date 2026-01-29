"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AnimatedCollapseProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  duration?: number;
}

export function AnimatedCollapse({
  open,
  children,
  className,
  duration = 0.2,
}: AnimatedCollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className={className}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
