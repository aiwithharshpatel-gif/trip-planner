"use client";

import { useState } from "react";
import { formatDistance } from "date-fns";
import { Trash2, MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Trip {
    id: string;
    title: string;
    destination: string;
    created_at: string;
    trip_data: any;
}

export function TripList({ initialTrips }: { initialTrips: Trip[] }) {
    const [trips, setTrips] = useState<Trip[]>(initialTrips);
    const supabase = createClient();

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('trips').delete().eq('id', id);
        if (!error) {
            setTrips(trips.filter(t => t.id !== id));
        } else {
            alert("Failed to delete trip");
        }
    };

    if (trips.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500">You haven't saved any trips yet.</p>
                <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
                    Create your first trip
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
                const days = trip.trip_data?.days?.length || 0;

                return (
                    <div key={trip.id} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">

                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500 -mr-2 -mt-2">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Trip?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently remove {trip.title} from your saved trips.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(trip.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                            <div>
                                <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                    {trip.title}
                                </h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    {formatDistance(new Date(trip.created_at), new Date(), { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <span className="text-xs font-medium px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                                {days} Days
                            </span>
                            <Link href={`/trips/${trip.id}?saved=true`}>
                                {/* We might need to handle the ID mapping differently if we used random UUIDs in localStorage vs Supabase IDs */}
                                {/* Ideally, we should update the TripView page to fetch from Supabase if an ID is provided that isn't in localStorage, or change the routing strategy. */}
                                {/* For now, let's assume /trips/[id] works if we hydrate it, or we need a new page for saved trips. */}
                                {/* Actually, the current [id]/page.tsx ONLY reads from localStorage. We need to upgrade it. */}
                                <Button variant="ghost" size="sm" className="gap-2 group-hover:translate-x-1 transition-transform">
                                    View Trip <ArrowRight className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
