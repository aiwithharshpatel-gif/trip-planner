"use client";

import { Activity } from "@/types";
import { useEffect, useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Dynamically import Leaflet components to avoid SSR issues
import dynamic from "next/dynamic";

// Helper component to handle map movement
const MapController = ({
    center,
    selectedActivityId,
    activities
}: {
    center: [number, number],
    selectedActivityId?: string | null,
    activities: Activity[]
}) => {
    // We need to import useMap from react-leaflet, but since we are lazy loading above,
    // we might face issues if we don't dynamic import this too?
    // Actually, useMap hook is part of react-leaflet exports.
    // If MapContainer is dynamic, we can't easily use hooks from the same package outside unless we lazy load this component too
    // OR we just import useMap directly if it's safe.
    // Generally 'react-leaflet' imports might break SSR if imported directly.
    // However, this component is only rendered INSIDE MapContainer which is client-only.
    // So we can try to assume it's safe or pass it as a prop? No.

    // Better approach: Since we are using Next.js dynamic imports for everything Leaflet related,
    // we should create a separate file for the map content or just risk the import.
    // Let's try to import useMap dynamically? No, hooks can't be dynamic.

    // Standard Next.js + Leaflet fix:
    // We will assume 'react-leaflet' is available here because this code runs on client.
    // But the import at the top is the problem.

    // Let's create a separate Client Component file `TripMapClient.tsx` that has all the Leaflet logic
    // and just dynamically import that entire component.
    // That is the cleanest way.

    return null;
}

interface TripMapProps {
    activities: Activity[];
    selectedActivityId?: string | null;
    onSelectActivity?: (activityId: string | null) => void;
}

// Move dynamic import to top level and fix typing
const TripMapClient = dynamic(
    () => import('./TripMapClient').then(mod => mod.TripMapClient),
    {
        loading: () => <div className="p-4 text-center text-gray-500">Loading Map...</div>,
        ssr: false
    }
);

export function TripMap(props: TripMapProps) {
    return <TripMapClient {...props} />;
}
