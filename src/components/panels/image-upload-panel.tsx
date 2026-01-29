"use client";

import { useState } from "react";
import { Upload, Link, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useStudioStore } from "@/hooks/use-studio-store";

export function ImageUploadPanel() {
  const image = useStudioStore((s) => s.image);
  const clearImage = useStudioStore((s) => s.clearImage);
  const { inputRef, openFilePicker, handleInputChange, handleUrl, error } = useImageUpload();
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  if (image) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted shadow-sm">
          <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium leading-tight">{image.fileName}</p>
          <p className="text-[11px] text-muted-foreground">
            {image.naturalWidth} &times; {image.naturalHeight}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => clearImage()}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={openFilePicker}>
          <Upload className="mr-1.5 h-3.5 w-3.5" />
          Upload Image
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setShowUrlInput(!showUrlInput)}
        >
          <Link className="h-3.5 w-3.5" />
        </Button>
      </div>
      {showUrlInput && (
        <div className="flex items-center gap-1.5">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL..."
            className="h-8 flex-1 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUrl(urlInput);
                setUrlInput("");
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              handleUrl(urlInput);
              setUrlInput("");
            }}
          >
            Load
          </Button>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
