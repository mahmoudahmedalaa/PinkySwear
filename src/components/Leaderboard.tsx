import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ActionUser {
    id: string;
    name: string;
    timeAgo: string;
}

const BASE_COUNT = 2847; // Psychologically specific, authentic-feeling number

const FAKE_USERS = [
    'Michael R.', 'Sarah K.', 'Ali M.', 'David T.', 'Chris P.',
    'Emily R.', 'Jason M.', 'Tarek S.', 'Jessica B.', 'Alex W.',
    'Omar F.', 'Nadia Y.', 'Robert C.', 'Amanda J.', 'Khalid N.'
];

function getRandomTimeAgo() {
    const times = ['JUST NOW', '2 MINS AGO', '5 MINS AGO', '12 MINS AGO', '23 MINS AGO', '1 HOUR AGO'];
    return times[Math.floor(Math.random() * times.length)];
}

export default function Leaderboard() {
    const [recentUsers, setRecentUsers] = useState<ActionUser[]>([]);
    const [totalPaid, setTotalPaid] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWall() {
            try {
                const q = query(
                    collection(db, 'waitlist'),
                    where('paymentStatus', '==', 'paid')
                );
                const querySnapshot = await getDocs(q);

                let total = 0;
                const fetchedUsers: ActionUser[] = [];

                querySnapshot.forEach((doc) => {
                    total++;
                    const data = doc.data();
                    if (data.name) {
                        fetchedUsers.push({
                            id: doc.id,
                            name: data.name,
                            timeAgo: getRandomTimeAgo()
                        });
                    }
                });

                setTotalPaid(total);

                // Mix real users with fake users to create aggressive social proof
                const displayUsers = [...fetchedUsers];
                let fakeIndex = 0;
                while (displayUsers.length < 15 && fakeIndex < FAKE_USERS.length) {
                    displayUsers.push({
                        id: `fake-${fakeIndex}`,
                        name: FAKE_USERS[fakeIndex],
                        timeAgo: getRandomTimeAgo()
                    });
                    fakeIndex++;
                }

                // Shuffle
                displayUsers.sort(() => Math.random() - 0.5);
                setRecentUsers(displayUsers);

            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        }

        fetchWall();
    }, []);

    if (loading) return null;

    const displayCount = BASE_COUNT + totalPaid;

    return (
        <div className="w-full max-w-5xl mx-auto my-20 p-8">

            {/* Big Psychological FOMO Number */}
            <div className="text-center mb-10 border-4 border-black bg-[#FF003C] p-8 shadow-[12px_12px_0px_0px_#000]">
                <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-2">
                    The Wall of Action
                </h2>
                <div className="text-7xl md:text-9xl font-black uppercase text-[#00FF66] tracking-tighter" style={{ WebkitTextStroke: '3px black' }}>
                    {displayCount.toLocaleString()}
                </div>
                <p className="text-2xl font-black text-black mt-2 bg-white inline-block px-4 py-2 border-4 border-black transform -rotate-2">
                    PEOPLE SECURED EARLY ACCESS.
                </p>
            </div>

            {/* Social Proof Ticker */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#00FF66]">
                <h3 className="font-bold text-gray-500 uppercase tracking-widest text-sm mb-4 border-b-2 border-gray-200 pb-2">
                    Live Recent Pledges
                </h3>
                <div className="flex flex-col gap-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {recentUsers.map((user) => (
                        <div key={user.id} className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-100 border-2 border-black p-3 group hover:bg-[#00FF66] transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 bg-[#FF003C] rounded-full animate-pulse border border-black"></span>
                                <span className="font-black text-xl uppercase tracking-wider">{user.name}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 md:mt-0">
                                <span className="font-bold text-sm text-gray-600 group-hover:text-black uppercase">
                                    {user.timeAgo}
                                </span>
                                <span className="bg-black text-[#00FF66] text-xs font-black uppercase px-2 py-1 align-middle">
                                    Staked $5
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
