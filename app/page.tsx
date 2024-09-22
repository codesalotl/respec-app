// respec-app\app\page.tsx

"use client";

import FrontPage from "@/components/front-page";

export default function Home() {
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Home Page
      </h1>

      <FrontPage />
    </div>
  );
}
