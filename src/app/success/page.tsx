import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#00FF66] border-8 border-black p-8 selection:bg-black selection:text-white">
            <div className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_#000] p-12 max-w-3xl text-center">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">You're Locked In.</h1>
                <p className="text-xl md:text-3xl font-bold leading-snug">
                    Your <span className="bg-[#FF003C] text-white px-2">$5 Bailout Token</span> is secured. <br className="hidden md:block" />Pinky has captured your commitment.
                </p>
                <p className="text-lg md:text-xl font-bold mt-6 text-gray-700">
                    We will email you the moment the app goes live. No running away now.
                </p>
                <div className="mt-12">
                    <Link
                        href="/"
                        className="inline-block px-10 py-5 bg-black text-[#00FF66] text-xl font-black uppercase tracking-widest border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000] active:translate-y-1 active:shadow-[4px_4px_0px_0px_#000] transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
