export interface Location {
    name: string;
    lat: number;
    lng: number;
    description?: string;
    address?: string;
}

export interface Activity {
    id?: string;
    time: string; // e.g. "10:00 AM"
    title: string;
    description: string;
    location: Location;
    imageUrl?: string;
}

export interface Day {
    day: number;
    title: string; // e.g. "Historical Paris"
    activities: Activity[];
}

export interface Trip {
    id: string;
    title: string; // e.g. "3 Days in Paris"
    destination: string;
    days: Day[];
    createdAt?: Date;
}

export type TripItinerary = Trip;
