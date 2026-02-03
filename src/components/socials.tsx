import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function Socials() {
  return (
    <div className="flex items-center">
      <Button variant="ghost" size="icon-sm" asChild>
        <a href="https://github.com/Minato0330/Next-ImageMask" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
          <Github className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
