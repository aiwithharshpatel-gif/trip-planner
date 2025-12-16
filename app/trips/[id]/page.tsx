"use client";

import { useEffect, useState } from "react";
import { TripItinerary } from "@/types";
import { TripView } from "@/components/trip/TripView";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function TripResultPage() {
    const params = useParams();
    const router = useRouter();
    const [trip, setTrip] = useState<TripItinerary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would fetch from Supabase
        // For now, we load from localStorage for MVP
        const id = params.id as string;
        if (id) {
            const stored = localStorage.getItem(`trip-${id}`);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setTrip(parsed);
                } catch (e) {
                    console.error("Failed to parse trip", e);
                }
            }
        }
        setLoading(false);
    }, [params.id]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-gray-50">
                <h1 className="text-2xl font-bold">Trip Not Found</h1>
                <p className="text-gray-500">We couldn't find the itinerary you're looking for.</p>
                <button
                    onClick={() => router.push("/")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Create New Trip
                </button>
            </div>
        );
    }

    return <TripView trip={trip} />;
}
