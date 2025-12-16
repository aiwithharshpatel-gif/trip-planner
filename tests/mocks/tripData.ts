import { Trip } from "@/types";

export const mockTripData: Trip = {
    id: "test-trip-id",
    title: "3 Days in Tokyo",
    destination: "Tokyo",
    days: [
        {
            day: 1,
            title: "Arrival and Shinjuku",
            activities: [
                {
                    time: "10:00 AM",
                    title: "Arrive at Narita",
                    description: "Land at Narita International Airport",
                    location: {
                        name: "Narita Airport",
                        lat: 35.7719867,
                        lng: 140.3906561,
                        description: "Main international gateway",
                        address: "Narita, Chiba"
                    }
                },
                {
                    time: "02:00 PM",
                    title: "Check in Hotel",
                    description: "Check into Shinjuku Prince Hotel",
                    location: {
                        name: "Shinjuku Prince Hotel",
                        lat: 35.6938,
                        lng: 139.7020,
                        description: "Central location",
                        address: "Shinjuku City, Tokyo"
                    }
                }
            ]
        },
        {
            day: 2,
            title: "Historical Asakusa",
            activities: [
                {
                    time: "09:00 AM",
                    title: "Senso-ji Temple",
                    description: "Visit Tokyo's oldest temple",
                    location: {
                        name: "Senso-ji",
                        lat: 35.7148,
                        lng: 139.7967,
                        description: "Ancient Buddhist temple",
                        address: "Asakusa, Taito City"
                    }
                }
            ]
        },
        {
            day: 3,
            title: "Modern Shibuya",
            activities: [
                {
                    time: "11:00 AM",
                    title: "Shibuya Crossing",
                    description: "Walk the famous scramble crossing",
                    location: {
                        name: "Shibuya Crossing",
                        lat: 35.6595,
                        lng: 139.7004,
                        description: "Busiest intersection",
                        address: "Shibuya City, Tokyo"
                    }
                }
            ]
        }
    ]
};
