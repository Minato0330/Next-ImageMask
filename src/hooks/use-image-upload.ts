"use client";

import { useState, useCallback, useRef } from "react";
import { useStudioStore } from "./use-studio-store";
import { MAX_IMAGE_SIZE } from "@/lib/constants";

export function useImageUpload() {
  const setImage = useStudioStore((s) => s.setImage);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const loadImage = useCallback(
    (src: string, fileName: string) => {
      setError(null);
      const img = new Image();
      img.onload = () => {
        setImage({
          src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          fileName,
        });
      };
      img.onerror = () => setError("Failed to load image");
      img.src = src;
    },
    [setImage]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("File must be an image");
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError("Image must be under 20MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        loadImage(reader.result as string, file.name);
      };
      reader.onerror = () => setError("Failed to read file");
      reader.readAsDataURL(file);
    },
    [loadImage]
  );

  const handleUrl = useCallback(
    (url: string) => {
      if (!url.trim()) return;
      loadImage(url, url.split("/").pop() || "image");
    },
    [loadImage]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [handleFile]
  );

  return {
    isDragging,
    error,
    inputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFilePicker,
    handleInputChange,
    handleUrl,
  };
}
