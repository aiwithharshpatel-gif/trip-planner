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
        async function fetchTrip() {
            if (!params.id) return;
            const tripId = params.id as string;

            // 1. Try LocalStorage (Fastest, works for anonymous/fresh generation)
            const localStored = localStorage.getItem(`trip-${tripId}`) || localStorage.getItem(tripId);
            if (localStored) {
                try {
                    const parsed = JSON.parse(localStored);
                    setTrip(parsed);
                    setLoading(false);
                    return;
                } catch (e) {
                    console.error("Failed to parse local trip", e);
                }
            }

            // 2. Try Supabase (For saved/shared trips)
            try {
                const { createClient } = await import("@/lib/supabase/client");
                const supabase = createClient();

                const { data, error } = await supabase
                    .from("trips")
                    .select("*")
                    .eq("id", tripId)
                    .single();

                if (error) {
                    // Start: Fix for debugging - ensure we don't just fail silently if it's a real DB error
                    // But if it's just "not found" (code PGRST116), maybe expected.
                    console.error("Supabase fetch error:", error);
                    setLoading(false);
                    return;
                }

                if (data) {
                    // The trip data stores the raw JSON in 'trip_data' column 
                    // based on our schema assumption or we might need to adjust based on actual schema.
                    // Let's assume the trip object IS stored as jsonb in a column named 'trip_data' 
                    // or if the columns map directly. 
                    // Checked previous context: we haven't seen the clear schema but usually it's jsonb.
                    // Let's assume row is the trip or row.trip_data is the trip.
                    // Safest bet: check if 'trip_data' exists, else use row.

                    const tripData = data.trip_data || data;
                    setTrip(tripData as TripItinerary);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchTrip();
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
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-gray-50 p-4">
                <h1 className="text-2xl font-bold text-red-600">DEBUG MODE ACTIVE</h1>
                <p className="text-gray-500">We couldn't find the itinerary you're looking for.</p>

                <div className="w-full max-w-md bg-white p-4 rounded-lg border border-red-200 text-left text-xs font-mono overflow-auto">
                    <p className="font-bold text-red-500 mb-2">Debug Info:</p>
                    <p>Trip ID: {params.id}</p>
                    <p>LS Key Tried: {params.id && `trip-${params.id}`}</p>
                    <p>LocalStorage Check: {typeof window !== 'undefined' ? (localStorage.getItem(params.id as string) ? 'Found (Raw)' : localStorage.getItem(`trip-${params.id}`) ? 'Found (Prefixed)' : 'Empty') : 'Server-Side'}</p>
                    <p>Supabase Check: Executed</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Create New Trip
                    </button>
                </div>
            </div>
        );
    }

    return <TripView trip={trip} />;
}
