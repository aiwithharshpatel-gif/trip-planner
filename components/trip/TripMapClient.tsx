"use client";

import { Activity } from "@/types";
import { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Helper function to set default icon
const ensureIcon = () => {
    if (typeof window !== "undefined") {
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
    }
};

interface TripMapProps {
    activities: Activity[];
    selectedActivityId?: string | null;
    onSelectActivity?: (activityId: string | null) => void;
}

// Controller component to handle map animations
function MapController({ selectedActivityId, activities }: { selectedActivityId: string | null | undefined, activities: Activity[] }) {
    const map = useMap();

    useEffect(() => {
        if (selectedActivityId) {
            const activity = activities.find(a => a.title === selectedActivityId);
            if (activity) {
                map.flyTo([activity.location.lat, activity.location.lng], 14, {
                    animate: true,
                    duration: 1.5
                });
            }
        }
    }, [selectedActivityId, activities, map]);

    return null;
}

export function TripMapClient({ activities, selectedActivityId, onSelectActivity }: TripMapProps) {
    useEffect(() => {
        ensureIcon();
    }, []);

    const center = useMemo<[number, number]>(() => {
        if (activities.length > 0) {
            return [activities[0].location.lat, activities[0].location.lng];
        }
        return [0, 0];
    }, [activities]);

    return (
        <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden relative shadow-inner z-0">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController selectedActivityId={selectedActivityId} activities={activities} />

                {activities.map((activity, index) => (
                    <Marker
                        key={`${activity.title}-${index}`}
                        position={[activity.location.lat, activity.location.lng]}
                        eventHandlers={{
                            click: () => {
                                onSelectActivity?.(activity.title);
                            },
                        }}
                    >
                        <Popup>
                            <div className="p-1 max-w-[200px]">
                                <div className="font-bold text-sm flex items-center gap-1 mb-1">
                                    <MapPin className="w-3 h-3 text-blue-500" />
                                    {activity.title}
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                    {activity.description}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1 italic">
                                    {activity.location.name}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
