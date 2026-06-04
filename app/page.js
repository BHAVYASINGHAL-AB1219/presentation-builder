"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PromptInput from "@/components/PromptInput";

/**
 * Landing Page — Hero prompt input with animated gradient background.
 */
export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (prompt) => {
    setIsLoading(true);
    try {
      // Force a hard navigation bypassing Next.js router to guarantee it moves to the next page
      window.location.href = `/create?prompt=${encodeURIComponent(prompt)}`;
    } catch (err) {
      console.error("Navigation failed:", err);
      alert("Navigation failed. Please try refreshing the page.");
      setIsLoading(false);
    }
  };

  return <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />;
}
