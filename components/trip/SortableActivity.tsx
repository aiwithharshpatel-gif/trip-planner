"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TimelineCard } from "./TimelineCard";
import { GripVertical } from "lucide-react";
import { Activity } from "@/types";

interface SortableActivityProps {
    activity: Activity;
    id: string; // Unique ID for DnD
    isActive: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
    isEditing: boolean;
}

export function SortableActivity({
    activity,
    id,
    isActive,
    onMouseEnter,
    onMouseLeave,
    onClick,
    isEditing,
}: SortableActivityProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : "auto",
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className="touch-none">
            <div className="relative group">
                {/* Drag Handle - Only visible in Edit Mode */}
                {isEditing && (
                    <div
                        {...attributes}
                        {...listeners}
                        className="absolute -left-8 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 z-20"
                    >
                        <GripVertical className="w-5 h-5" />
                    </div>
                )}

                <div onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <TimelineCard activity={activity} isActive={isActive} />
                </div>
            </div>
        </div>
    );
}
