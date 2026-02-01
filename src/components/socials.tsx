import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { CoffeeIcon } from "@/components/coffee";

export function Socials() {
  return (
    <div className="flex items-center">
      <Button variant="ghost" size="icon-sm" asChild>
        <a href="https://github.com/sachigoyal/maskit" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
          <Github className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="ghost" size="icon-sm" asChild>
        <a href="https://www.buymeacoffee.com/sachigoyalk" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
          <CoffeeIcon className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
