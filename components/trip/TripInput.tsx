"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plane } from "lucide-react";

interface TripInputProps {
    onSubmit: (value: string) => Promise<void>;
    isLoading: boolean;
}

export function TripInput({ onSubmit, isLoading }: TripInputProps) {
    const [value, setValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSubmit(value);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">
                    AI Trip Planner
                </h1>
                <p className="text-muted-foreground text-lg">
                    Describe your dream trip, and we'll generate a complete itinerary for you.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <Textarea
                        placeholder="Ex: A 3-day foodie trip to Tokyo, visiting Tsukiji market and hidden ramen spots..."
                        className="min-h-[150px] text-lg p-6 resize-none rounded-xl shadow-lg border-2 focus:border-blue-500 transition-all"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg h-14 rounded-xl gap-2 font-semibold"
                    disabled={isLoading || !value.trim()}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Itinerary...
                        </>
                    ) : (
                        <>
                            <Plane className="w-5 h-5" />
                            Generate Trip
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
