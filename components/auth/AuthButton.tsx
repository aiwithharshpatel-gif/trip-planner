"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { LogOut, User as UserIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    return (
        <AuthDialog user={user} onLogout={() => supabase.auth.signOut()} />
    );
}

function AuthDialog({ user, onLogout }: { user: User | null, onLogout: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
    const [msg, setMsg] = useState("");
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");

        if (view === 'sign-up') {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) setMsg(error.message);
            else setMsg("Success! Check your email to confirm.");
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) setMsg(error.message);
            else setMsg("Logged in!");
        }
    };

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                        My Trips
                    </Button>
                </Link>
                <span className="text-sm text-zinc-600 dark:text-zinc-400 hidden sm:inline">
                    {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <UserIcon className="w-4 h-4 mr-2" />
                    Login / Sign Up
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{view === 'sign-in' ? "Welcome Back" : "Create Account"}</DialogTitle>
                    <DialogDescription>
                        {view === 'sign-in' ? "Login to save your trips." : "Sign up to start saving trips."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAuth} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {msg && <p className="text-sm text-red-500">{msg}</p>}
                    <Button type="submit">
                        {view === 'sign-in' ? "Login" : "Sign Up"}
                    </Button>
                    <div className="text-center text-sm">
                        <button type="button" className="underline text-blue-500" onClick={() => setView(view === 'sign-in' ? 'sign-up' : 'sign-in')}>
                            {view === 'sign-in' ? "No account? Sign up" : "Have an account? Login"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
