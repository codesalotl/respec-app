import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="bg-background shadow">
      <Button variant="ghost" asChild>
        <Link href="/">Home</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/results">Results</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/history">History</Link>
      </Button>
    </div>
  );
}
