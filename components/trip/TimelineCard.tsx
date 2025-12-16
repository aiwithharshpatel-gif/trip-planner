import { Activity } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";

interface TimelineCardProps {
    activity: Activity;
    isActive?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
}

export function TimelineCard({ activity, isActive, onMouseEnter, onMouseLeave, onClick }: TimelineCardProps) {
    return (
        <Card
            className={`transition-all duration-300 cursor-pointer overflow-hidden border-0
        ${isActive
                    ? "shadow-xl shadow-blue-900/10 scale-[1.02] bg-zinc-900 text-white dark:bg-white dark:text-black translate-x-2"
                    : "hover:shadow-lg shadow-sm bg-zinc-50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"}
      `}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            <CardContent className="p-0">
                {/* Image Section */}
                {activity.imageUrl && (
                    <div className="w-full h-32 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={activity.imageUrl}
                            alt={activity.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                )}

                <div className="p-5 space-y-3">
                    <div className={`flex items-center justify-between text-xs font-medium uppercase tracking-wider ${isActive ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-500"}`}>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{activity.time}</span>
                        </div>
                    </div>

                    <h3 className={`font-bold text-lg leading-tight ${isActive ? "text-white dark:text-black" : "text-zinc-900 dark:text-zinc-100"}`}>
                        {activity.title}
                    </h3>

                    <p className={`text-sm leading-relaxed line-clamp-2 ${isActive ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"}`}>
                        {activity.description}
                    </p>

                    <div className={`flex items-start gap-1.5 text-xs font-medium pt-2 ${isActive ? "text-blue-400 dark:text-blue-600" : "text-blue-600 dark:text-blue-400"}`}>
                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span className="truncate">{activity.location.name}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
