import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LeaderboardUser {
    id: string;
    name: string;
    referralCount: number;
}

export default function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [totalPaid, setTotalPaid] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const q = query(
                    collection(db, 'waitlist'),
                    where('paymentStatus', '==', 'paid')
                );
                const querySnapshot = await getDocs(q);

                let total = 0;
                const fetchedUsers: LeaderboardUser[] = [];

                querySnapshot.forEach((doc) => {
                    total++;
                    const data = doc.data();
                    if (data.name) {
                        fetchedUsers.push({
                            id: doc.id,
                            name: data.name,
                            referralCount: data.referralCount || 0
                        });
                    }
                });

                // Sort by referrals (descending), then by name
                fetchedUsers.sort((a, b) => {
                    if (b.referralCount !== a.referralCount) {
                        return b.referralCount - a.referralCount;
                    }
                    return a.name.localeCompare(b.name);
                });

                setTotalPaid(total);
                setUsers(fetchedUsers.slice(0, 10)); // Top 10
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();
    }, []);

    if (loading) return null;

    return (
        <div className="w-full max-w-4xl mx-auto my-16 border-4 border-black p-8 bg-black shadow-[8px_8px_0px_0px_#FF003C]">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#00FF66] mb-2">
                Leaderboard of Accountability
            </h2>
            <p className="text-white font-bold text-lg border-b-4 border-white pb-6 mb-6">
                <span className="text-[#FF003C] text-2xl font-black">{totalPaid}</span> PEOPLE HAVE PUT THEIR MONEY WHERE THEIR MOUTH IS.
            </p>

            {users.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {users.map((user, index) => (
                        <div key={user.id} className="flex justify-between items-center bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#00FF66]">
                            <div className="flex items-center gap-4">
                                <span className="font-black text-2xl text-[#FF003C] w-8">{index + 1}.</span>
                                <span className="font-black text-xl uppercase tracking-widest">{user.name}</span>
                            </div>
                            {user.referralCount > 0 && (
                                <div className="bg-[#00FF66] border-2 border-black px-3 py-1 font-black text-sm uppercase">
                                    {user.referralCount} Invites
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border-2 border-black p-6 text-center">
                    <p className="font-black text-xl uppercase">No one has stepped up yet.</p>
                </div>
            )}
        </div>
    );
}
