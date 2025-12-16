import { Skeleton } from "@/components/ui/skeleton";

export function TripLoading() {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
            {/* Header Skeleton */}
            <header className="flex-none h-16 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 z-20 sticky top-0">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="w-24 h-9 rounded-full" />
                    <Skeleton className="w-24 h-9 rounded-full" />
                </div>
            </header>

            {/* Main Content Skeleton */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Left: Timeline Skeleton */}
                <div className="w-full md:w-1/2 lg:w-[480px] flex-none bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 z-10 flex flex-col p-6 lg:p-8 space-y-12">
                    {[1, 2, 3].map((day) => (
                        <div key={day} className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <div className="pl-16 space-y-6">
                                {[1, 2, 3].map((card) => (
                                    <div key={card} className="w-full h-32 rounded-xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative">
                                        <Skeleton className="w-full h-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Map Skeleton */}
                <div className="hidden md:block flex-1 relative bg-zinc-100 dark:bg-zinc-900">
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                        <div className="flex flex-col items-center gap-2 animate-pulse">
                            <div className="w-12 h-12 rounded-full border-4 border-zinc-300 border-t-zinc-500 animate-spin" />
                            <p className="text-sm font-medium">Generating your perfect trip...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
