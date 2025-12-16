import * as ics from 'ics';
import { Trip } from '@/types';

// Helper to parse "09:00 AM" into [hour, minute]
function parseTime(timeStr: string): [number, number] {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return [hours, minutes];
}

export function generateTripICS(trip: Trip) {
    const events: ics.EventAttributes[] = [];

    // Assume trip starts "tomorrow" for demo purposes since we don't have real dates yet
    // In a real app, Trip interface needs a startDate
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1); // Start trip tomorrow

    trip.days.forEach((day, dayIdx) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + dayIdx);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const date = currentDate.getDate();

        day.activities.forEach(activity => {
            const [hour, minute] = parseTime(activity.time);

            events.push({
                start: [year, month, date, hour, minute],
                duration: { hours: 1, minutes: 30 }, // Default duration
                title: activity.title,
                description: activity.description,
                location: activity.location.name,
                status: 'CONFIRMED',
                busyStatus: 'BUSY',
                url: 'https://trip-planner.ai'
            });
        });
    });

    ics.createEvents(events, (error, value) => {
        if (error) {
            console.error(error);
            return;
        }

        const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${trip.title.replace(/\s+/g, '_')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
