import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const BASE_COUNT = 87;

export default function Leaderboard() {
    const [totalPaid, setTotalPaid] = useState<number>(0);
    const [simulatedPledges, setSimulatedPledges] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCount() {
            try {
                const q = query(
                    collection(db, 'waitlist'),
                    where('paymentStatus', '==', 'paid')
                );
                const querySnapshot = await getDocs(q);
                setTotalPaid(querySnapshot.size);
            } catch (error) {
                console.error("Failed to fetch count", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCount();
    }, []);

    // Simulate live incoming pledges
    useEffect(() => {
        if (loading) return;

        const tick = () => {
            // High chance to increment occasionally to simulate live action
            if (Math.random() > 0.4) {
                setSimulatedPledges(prev => prev + 1);
            }
            // Next tick between 3s and 12s
            const nextTick = Math.floor(Math.random() * 9000) + 3000;
            timeoutId = setTimeout(tick, nextTick);
        };

        let timeoutId = setTimeout(tick, 4000);
        return () => clearTimeout(timeoutId);
    }, [loading]);

    if (loading) return null;

    const displayCount = BASE_COUNT + totalPaid + simulatedPledges;

    return (
        <div className="w-full max-w-4xl mx-auto my-20 px-8">
            <div className="relative border-8 border-black bg-[#FF003C] p-8 md:p-16 shadow-[16px_16px_0px_0px_#000] transform transition-transform hover:-translate-y-1 hover:-rotate-1">

                {/* Live Indicator */}
                <div className="absolute top-4 right-4 lg:-top-6 lg:-right-8 bg-black border-4 border-[#00FF66] px-4 py-2 flex items-center gap-3 shadow-[8px_8px_0px_0px_#00FF66] rotate-[5deg]">
                    <span className="w-4 h-4 bg-[#00FF66] rounded-full animate-pulse border-2 border-black"></span>
                    <span className="text-[#00FF66] font-black tracking-widest text-lg uppercase">Live</span>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-widest mb-2 border-b-8 border-black pb-4">
                        People Staked $5
                    </h2>

                    <div className="relative my-4">
                        <div className="text-[120px] md:text-[200px] font-black text-[#00FF66] leading-none tracking-tighter drop-shadow-lg" style={{ WebkitTextStroke: '8px black' }}>
                            {displayCount.toLocaleString()}
                        </div>
                    </div>

                    <p className="mt-6 text-xl md:text-2xl font-black bg-white text-black px-8 py-4 border-4 border-black uppercase rotate-[-2deg] shadow-[6px_6px_0px_0px_#00FF66]">
                        Spots for early access are filling up.
                    </p>
                </div>
            </div>
        </div>
    );
}
