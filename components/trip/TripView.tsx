"use client";

import { TripItinerary, Activity } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { TimelineCard } from "./TimelineCard";
import { TripMap } from "./TripMap";
import { createClient } from "@/lib/supabase/client";
import AuthButton from "@/components/auth/AuthButton";
import { Save, ArrowLeft, Download, Calendar, Plane, Hotel, Share2, Pencil, Check, X } from "lucide-react";
import { generateTripPDF } from "@/lib/utils/pdf";
import { generateTripICS } from "@/lib/utils/ics";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { getHotelLink, getFlightLink } from "@/lib/utils/affiliate";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableActivity } from "./SortableActivity";

interface TripViewProps {
    trip: TripItinerary;
}

export function TripView({ trip: initialTrip }: TripViewProps) {
    const supabase = createClient();
    const [trip, setTrip] = useState(initialTrip);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
    const [hoveredActivityId, setHoveredActivityId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Flatten activities for map
    const allActivities = useMemo(() => {
        return trip.days.flatMap(day => day.activities);
    }, [trip]);

    // Sensors for DnD
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleMapClick = (activityTitle: string | null) => {
        if (!activityTitle) return;
        setSelectedActivityId(activityTitle);
        const cleanId = activityTitle.replace(/\s+/g, '-').toLowerCase();
        const element = document.getElementById(`card-${cleanId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-blue-500');
            setTimeout(() => element.classList.remove('ring-2', 'ring-blue-500'), 2000);
        }
    };

    const handleSaveTrip = async () => {
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Please login to save your trip!");
                setIsSaving(false);
                return;
            }

            // If we have an ID from database (loaded trip), update it. 
            // Currently we don't have the DB ID in the `trip` object unless we fetched it.
            // For now, we always INSERT a new one or we need to pass the ID.
            // Let's assume standard INSERT for this MVP flow.

            const { error } = await supabase
                .from('trips')
                .insert({
                    user_id: user.id,
                    title: trip.title,
                    destination: trip.destination,
                    trip_data: trip
                });

            if (error) throw error;
            alert("Trip saved successfully!");
            setHasChanges(false);
        } catch (e) {
            console.error(e);
            alert("Failed to save trip.");
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to get unique ID for each activity across all days
    // We'll use a string composed of day index and activity index if titles aren't unique
    // But DnD needs stable IDs. Let's assume title is unique enough for now or use a combinator.
    // Actually, simple reordering within ONE giant list is easier.
    // But we have headers (Days).
    // Let's implement reordering WITHIN a day for simplicity first, or standard list.

    // STRATEGY: Treat all activities as one single sortable list for the logic, 
    // but render them grouped by day.
    // Actually, moving across days is hard visually with this UI.
    // Let's implement `SortableContext` PER DAY. You can reorder within a day.

    const onDragEnd = (event: DragEndEvent, dayIndex: number) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setTrip((prev) => {
                const newDays = [...prev.days];
                const day = newDays[dayIndex];

                const oldIndex = day.activities.findIndex(a => a.title === active.id);
                const newIndex = day.activities.findIndex(a => a.title === over?.id);

                day.activities = arrayMove(day.activities, oldIndex, newIndex);
                newDays[dayIndex] = day;

                return { ...prev, days: newDays };
            });
            setHasChanges(true);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
            {/* Header */}
            <header className="flex-none h-16 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 z-20 sticky top-0">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 truncate max-w-md tracking-tight">{trip.title}</h1>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{trip.days.length} Days • {trip.destination}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <AuthButton />

                    <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block"></div>

                    {/* Edit Mode Toggle */}
                    <Button
                        variant={isEditing ? "secondary" : "ghost"}
                        size="sm"
                        className={`gap-2 rounded-full ${isEditing ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "text-zinc-500"}`}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                        {isEditing ? "Done" : "Edit"}
                    </Button>

                    <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block"></div>

                    {/* Monetization Buttons */}
                    {!isEditing && (
                        <>
                            <Button
                                variant="default"
                                size="sm"
                                className="gap-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 hidden lg:flex"
                                onClick={() => window.open(getHotelLink(trip.destination), '_blank')}
                            >
                                <Hotel className="w-3.5 h-3.5" />
                                Hotels
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                className="gap-2 rounded-full bg-sky-600 text-white hover:bg-sky-700 hidden lg:flex"
                                onClick={() => window.open(getFlightLink(trip.destination), '_blank')}
                            >
                                <Plane className="w-3.5 h-3.5" />
                                Flights
                            </Button>
                        </>
                    )}

                    <Button
                        variant={hasChanges ? "default" : "default"}
                        size="sm"
                        className={`gap-2 rounded-full ${hasChanges ? "bg-green-600 hover:bg-green-700" : "bg-black dark:bg-white"}`}
                        onClick={handleSaveTrip}
                        disabled={isSaving}
                    >
                        <Save className="w-3.5 h-3.5" />
                        {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "Save Trip"}
                    </Button>

                    {!isEditing && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 rounded-full border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 hidden sm:flex"
                                onClick={() => generateTripPDF(trip)}
                            >
                                <Download className="w-3.5 h-3.5" />
                                PDF
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 rounded-full border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 hidden sm:flex"
                                onClick={() => generateTripICS(trip)}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                Calendar
                            </Button>
                        </>
                    )}
                </div>
            </header>

            {/* Main Content: Split Screen */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Left: Timeline - Native Scrollable */}
                <div className="w-full md:w-1/2 lg:w-[480px] flex-none bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 z-10 flex flex-col overflow-y-auto scroll-smooth no-scrollbar">
                    <div className="p-6 lg:p-8 space-y-12 pb-32">
                        {trip.days.map((day, dayIdx) => (
                            <div key={day.day} id={`day-${day.day}`} className="relative">
                                {/* Connector Line */}
                                <div className="absolute left-[19px] top-12 bottom-[-48px] w-0.5 bg-zinc-100 dark:bg-zinc-800 -z-0 last:hidden" />

                                <div className="sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-md py-4 z-10 -mx-6 px-6 border-b border-dashed border-zinc-100 dark:border-zinc-900">
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-4">
                                        <span className="bg-black dark:bg-white text-white dark:text-black w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 z-20">
                                            {day.day}
                                        </span>
                                        <span className="tracking-tight">{day.title}</span>
                                    </h2>
                                </div>

                                <div className="pl-16 space-y-6 pt-6">
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={(e) => onDragEnd(e, dayIdx)}
                                    >
                                        <SortableContext
                                            items={day.activities.map(a => a.title)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {day.activities.map((activity, idx) => {
                                                const uniqueId = activity.title; // Assume title is unique for now

                                                return isEditing ? (
                                                    <SortableActivity
                                                        key={uniqueId}
                                                        id={uniqueId}
                                                        activity={activity}
                                                        isActive={selectedActivityId === activity.title || hoveredActivityId === activity.title}
                                                        onMouseEnter={() => setHoveredActivityId(activity.title)}
                                                        onMouseLeave={() => setHoveredActivityId(null)}
                                                        onClick={() => handleMapClick(activity.title)}
                                                        isEditing={isEditing}
                                                    />
                                                ) : (
                                                    <motion.div
                                                        key={uniqueId}
                                                        id={`card-${activity.title.replace(/\s+/g, '-').toLowerCase()}`}
                                                        layoutId={uniqueId} // Good for animating position changes if we used layout prop
                                                    >
                                                        <TimelineCard
                                                            activity={activity}
                                                            isActive={selectedActivityId === activity.title || hoveredActivityId === activity.title}
                                                            onMouseEnter={() => setHoveredActivityId(activity.title)}
                                                            onMouseLeave={() => setHoveredActivityId(null)}
                                                            onClick={() => handleMapClick(activity.title)}
                                                        />
                                                    </motion.div>
                                                );
                                            })}
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Map - Fixed */}
                <div className="hidden md:block flex-1 relative bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <TripMap
                        activities={allActivities}
                        selectedActivityId={hoveredActivityId || selectedActivityId}
                        onSelectActivity={handleMapClick}
                    />
                </div>
            </div>
        </div>
    );
}
