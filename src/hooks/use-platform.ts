"use client";

import { useState, useEffect } from "react";

type Platform = "mac" | "windows" | "linux" | "unknown";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "unknown";

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("mac")) return "mac";
  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("linux")) return "linux";

  return "unknown";
}

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const isMac = platform === "mac";
  const isWindows = platform === "windows";
  const isLinux = platform === "linux";

  const modKey = isMac ? "Cmd" : "Ctrl";

  const formatShortcut = (...keys: string[]): string => {
    if (isMac) {
      const macKeys = keys.map((key) => {
        if (key.toLowerCase() === "alt") return "Option";
        return key;
      });
      return `${modKey}+${macKeys.join("+")}`;
    }

    return `${modKey}+${keys.join("+")}`;
  };

  return {
    platform,
    isMac,
    isWindows,
    isLinux,
    modKey,
    formatShortcut,
  };
}
