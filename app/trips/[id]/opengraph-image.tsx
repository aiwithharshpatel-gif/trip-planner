import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Trip Itinerary'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
    // Ideally, fetch trip data from Supabase using params.id
    // But OG images are static-ish or cached.
    // For now, we'll make a generic attractive card.
    // In a real app, you'd fetch the trip title here.

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '40px 80px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    }}
                >
                    <div style={{ fontSize: 30, marginBottom: 20, opacity: 0.8 }}>Trip Planner AI</div>
                    <div style={{ fontSize: 70, fontWeight: 'bold', backgroundImage: 'linear-gradient(to right, #3b82f6, #a855f7)', backgroundClip: 'text', color: 'transparent' }}>
                        Your Dream Trip
                    </div>
                    <div style={{ fontSize: 30, marginTop: 20, opacity: 0.6 }}>
                        View detailed itinerary
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
