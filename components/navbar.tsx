import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <Button variant="ghost" asChild>
        <Link href="/">Home</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/results">Results</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/history">History</Link>
      </Button>
    </>
  );
}
