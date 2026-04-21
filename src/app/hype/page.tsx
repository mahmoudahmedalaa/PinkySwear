'use client';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export default function HypeGenPage() {
    const receiptRef = useRef<HTMLDivElement>(null);
    const [waitlistId, setWaitlistId] = useState('');
    const [name, setName] = useState('YOUR NAME');
    const [generatedImg, setGeneratedImg] = useState<string | null>(null);

    // Users can put in their custom referral link ID or we could fetch it via email,
    // but for simplicity/viral mechanics, they just type their name and grab their receipt.
    // We encourage them to use the waitlist ID they got in their email.

    const handleGenerate = async () => {
        if (receiptRef.current) {
            const canvas = await html2canvas(receiptRef.current);
            const imgData = canvas.toDataURL('image/png');
            setGeneratedImg(imgData);
        }
    };

    const handleDownload = () => {
        if (generatedImg) {
            const link = document.createElement('a');
            link.href = generatedImg;
            link.download = `Receipt-Of-Superiority-${name.replace(/\s+/g, '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <main className="min-h-screen bg-white pb-20 selection:bg-[#FF003C] selection:text-white">
            <nav className="w-full px-8 py-6 border-b-4 border-black bg-white sticky top-0 z-50">
                <h1 className="text-2xl font-black tracking-tighter">PinkySwear<span className="text-[#FF003C]">.HYPE</span></h1>
            </nav>

            <div className="max-w-4xl mx-auto px-8 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Form Controls */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-2">
                        Generate Your<br />Receipt
                    </h2>
                    <p className="font-bold text-lg text-gray-700">
                        You put $5 on the line. Most people won't even wake up to their alarm. Generate your receipt, download it, and shame your friends into signing up.
                    </p>

                    <div className="flex flex-col gap-4 mt-4">
                        <input
                            type="text"
                            placeholder="YOUR FULL NAME"
                            value={name === 'YOUR NAME' ? '' : name}
                            onChange={(e) => setName(e.target.value || 'YOUR NAME')}
                            className="px-5 py-4 text-lg font-black border-4 border-black uppercase outline-none focus:bg-[#00FF66]/10"
                        />
                        <input
                            type="text"
                            placeholder="Waitlist / Referral ID (Optional)"
                            value={waitlistId}
                            onChange={(e) => setWaitlistId(e.target.value)}
                            className="px-5 py-4 text-lg font-black border-4 border-black outline-none focus:bg-[#00FF66]/10"
                        />
                        <button
                            onClick={handleGenerate}
                            className="mt-2 px-8 py-5 bg-black text-[#00FF66] text-xl font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_0px_#00FF66] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#00FF66] active:translate-y-1 active:shadow-[2px_2px_0px_0px_#00FF66] transition-all"
                        >
                            GENERATE IMAGE
                        </button>
                    </div>

                    {generatedImg && (
                        <div className="mt-8 border-t-4 border-black pt-8">
                            <button
                                onClick={handleDownload}
                                className="w-full px-8 py-5 bg-[#FF003C] text-white text-xl font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] active:translate-y-1 active:shadow-[2px_2px_0px_0px_#000] transition-all"
                            >
                                DOWNLOAD FOR IG/TWITTER
                            </button>

                            {waitlistId && (
                                <div className="mt-6 bg-gray-100 border-4 border-black p-4 text-center">
                                    <p className="text-sm font-bold uppercase mb-2">Your Referral Link</p>
                                    <code className="text-green-700 font-bold block bg-white border border-gray-300 p-2 break-all">
                                        https://pinkyswear.com/?ref={waitlistId}
                                    </code>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* The Receipt Preview (Used by html2canvas) */}
                <div className="relative">
                    <div className="sticky top-24">
                        <h3 className="font-bold uppercase text-gray-500 mb-2 text-sm tracking-widest border-b-2 border-gray-300 inline-block">Live Preview</h3>

                        {/* The actual HTML ref area that gets snapshotted */}
                        <div
                            ref={receiptRef}
                            className="w-[1080px] h-[1080px] max-w-full aspect-square bg-[#00FF66] border-8 border-black p-12 flex flex-col justify-between shadow-[12px_12px_0px_0px_#000]"
                            style={{ transform: 'scale(1)', transformOrigin: 'top left' }} // Responsive scale handle needed via CSS normally, but this keeps the downloaded res high
                        >
                            <div className="absolute top-12 right-12 z-0 opacity-10">
                                <img src="/pinky_t.png" alt="Pinky bg" className="w-96" />
                            </div>

                            <div className="z-10 relative">
                                <div className="inline-block bg-black text-[#00FF66] font-black text-2xl uppercase px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#FF003C] mb-8">
                                    RECEIPT OF SUPERIORITY
                                </div>

                                <h1 className="text-7xl font-black uppercase leading-none tracking-tighter break-words">
                                    {name}
                                </h1>
                                <p className="text-4xl font-black bg-white inline-block px-2 text-black mt-4 border-2 border-black">
                                    HAS SKIN IN THE GAME.
                                </p>
                            </div>

                            <div className="z-10 relative bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000]">
                                <p className="text-3xl font-black uppercase mb-4 text-[#FF003C]">Paid $5.00 Bailout Token</p>
                                <p className="text-2xl font-bold text-gray-800 leading-snug">
                                    While you were making excuses, {name.split(' ')[0]} staked cash that they wouldn't fail their goals. Total Accountability. No Backing Out.
                                </p>

                                <div className="mt-8 border-t-8 border-black pt-6 flex justify-between items-end">
                                    <div className="text-xl font-bold">
                                        Prove You're Serious at:<br />
                                        <span className="font-black text-2xl uppercase">pinkyswear.com</span>
                                    </div>
                                    {waitlistId && (
                                        <div className="bg-[#00FF66] border-4 border-black px-4 py-2 rotate-[-5deg]">
                                            <span className="font-black text-lg block text-center">REFERRAL CODE:</span>
                                            <span className="font-black text-2xl">{waitlistId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
