import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TripList } from "@/components/dashboard/TripList";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/");
    }

    // Fetch user's trips
    const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">My Trips</h1>
                    <div className="text-sm text-zinc-500">
                        {trips?.length || 0} saved adventures
                    </div>
                </div>

                <TripList initialTrips={trips || []} />
            </div>
        </div>
    );
}
