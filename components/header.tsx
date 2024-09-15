import { Button } from "@/components/ui/button";

import { ModeToggle } from "@/components/dark-mode-toggle";

export default function Header() {
  return (
    <div className="w-full flex justify-between items-center">
      <ModeToggle />
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        ResSpec
      </h3>
      <Button variant="link">Login</Button>
    </div>
  );
}
