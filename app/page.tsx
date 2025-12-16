"use client";

import { TripInput } from "@/components/trip/TripInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { generateTrip } from "@/app/actions/generateTrip";
import { TripLoading } from "@/components/trip/TripLoading";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (input: string) => {
    setLoading(true);
    setError("");

    try {
      // 1. Generate Trip Data (Server Action)
      const result = await generateTrip(input);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to generate trip");
      }

      // 2. Save to LocalStorage (Temporary)
      const tripId = crypto.randomUUID();
      localStorage.setItem(tripId, JSON.stringify(result.data));

      // 3. Navigate to Trip View
      router.push(`/trips/${tripId}`);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (loading) {
    return <TripLoading />;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-24 relative overflow-hidden">

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 w-full max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            ✨ AI-Powered Travel Assistant
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Plan your next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">adventure</span> in seconds.
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            Just tell us where you want to go, and we'll craft a personalized itinerary complete with hidden gems, local favorites, and optimized routes.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
          <TripInput onSubmit={handleGenerate} isLoading={loading} />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/10 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-center gap-6 text-sm text-zinc-400 grayscale opacity-50">
          <span>Trusted by travelers</span>
          <span>•</span>
          <span>20k+ Trips Planned</span>
          <span>•</span>
          <span>Powered by Gemini</span>
        </div>
      </div>
    </main>
  );
}
