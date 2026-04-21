'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Leaderboard from '@/components/Leaderboard';

function WaitlistContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const searchParams = useSearchParams();
  const referrerId = searchParams?.get('ref') || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setStatus('loading');

    try {
      // Execute Firebase write and get document ID explicitly
      const docRef = await addDoc(collection(db, 'waitlist'), {
        name: name.trim(),
        email: email.trim(),
        timestamp: serverTimestamp(),
        paymentStatus: 'pending',
        referrerId: referrerId,
        referralCount: 0
      });

      // Pass the docRef.id to Stripe to bypass Firebase read restrictions
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), waitlistId: docRef.id }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Proceed to Stripe
      } else {
        throw new Error(data.error || 'Failed to initialize secure checkout');
      }
    } catch (err) {
      console.error("Checkout initialization failed: ", err);
      setStatus('idle');
      alert("Failed to secure position. Try again.");
    }
  };

  return (
    <main className="min-h-screen pb-20 selection:bg-[#FF003C] selection:text-white overflow-hidden bg-white">

      {/* Top Nav */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b-4 border-black bg-white sticky top-0 z-50">
        <h1 className="text-2xl font-black tracking-tighter">PinkySwear<span className="text-[#00FF66]">.</span></h1>
        <div
          onClick={() => {
            document.getElementById('payment-form')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-sm font-bold uppercase tracking-widest px-5 py-3 border-4 border-black bg-[#FF003C] text-white shadow-[4px_4px_0px_0px_#000] transform transition hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-1 active:shadow-[2px_2px_0px_0px_#000] cursor-pointer"
        >
          Beta Waitlist
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 pt-16 md:pt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative">

        {/* Left Copy Section */}
        <div className="flex flex-col space-y-8 z-10 md:col-span-7 xl:col-span-6 relative">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_#00FF66]">
              Stop Procrastinating.
            </div>
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.87] tracking-tighter">
              Set Goal.<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2.5px black' }}>Stake Cash.</span><br />
              Do Work.
            </h2>
          </div>

          <p className="text-xl md:text-2xl font-bold leading-snug border-l-8 border-[#FF003C] pl-6 py-2 max-w-xl">
            The ultimate absolute-zero-excuses accountability app. Tell Pinky what you are going to do, and put your credit card on the line.
          </p>

          <p className="text-lg font-bold text-gray-700 max-w-md hidden md:block">
            Hit your deadline, and you pay nothing. Miss it, and Pinky takes your money. No refunds. No excuses.
          </p>

          {/* Brutalist Input Form */}
          <div id="payment-form" className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col gap-6 mt-4 w-full">
            <div>
              <h3 className="font-black text-3xl md:text-4xl uppercase tracking-tighter text-[#FF003C] leading-none mb-4">
                Pre-Order a Bailout Token
              </h3>

              <div className="bg-gray-100 border-l-8 border-black p-4 mt-2">
                <p className="font-black text-xl md:text-2xl text-black leading-snug">
                  You <span className="underline decoration-[#FF003C] decoration-4 underline-offset-4">*will*</span> fail your first task.
                </p>
                <p className="font-bold text-base md:text-lg text-gray-800 mt-3 leading-snug">
                  Put <span className="bg-[#00FF66] px-1 border border-black font-black">$5 down right now</span> to pre-order a Bailout Token and <span className="text-[#FF003C] font-black uppercase">secure early access</span>. Pinky will cover your first $100 mistake when the app drops.
                </p>
              </div>
            </div>

            {status === 'success' ? (
              <div className="bg-[#00FF66] border-4 border-black p-6 text-center transform transition-all shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center">
                <h4 className="font-black text-2xl uppercase">You&#39;re on the hook.</h4>
                <p className="font-bold text-base mt-2">We&#39;ll alert you when we launch. No running away now.</p>
              </div>
            ) : (
              <form className="flex flex-col xl:flex-row gap-4 mt-2" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === 'loading'}
                  placeholder="YOUR FULL NAME"
                  className="flex-1 px-5 py-5 text-lg font-black border-4 border-black bg-white focus:bg-[#00FF66]/10 outline-none placeholder:text-gray-400 placeholder:font-bold border-box w-full uppercase disabled:opacity-50 transition-colors"
                  required
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  placeholder="YOUR.EMAIL@LOSER.COM"
                  className="flex-1 px-5 py-5 text-lg font-black border-4 border-black bg-white focus:bg-[#00FF66]/10 outline-none placeholder:text-gray-400 placeholder:font-bold border-box w-full uppercase disabled:opacity-50 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-5 bg-[#FF003C] text-white text-xl font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] active:translate-y-1 active:shadow-[2px_2px_0px_0px_#000] transition-all whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_#000] flex items-center justify-center gap-3"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      Betting...
                    </>
                  ) : 'Bet On Yourself'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Pinky Mascot Section */}
        <div className="w-full relative flex items-center justify-end pointer-events-none md:col-span-5 xl:col-span-6 md:translate-x-12 lg:translate-x-20 xl:translate-x-32 z-0 mt-12 md:mt-0">
          <div className="absolute top-0 right-4 lg:-right-4 xl:right-10 z-10 px-6 py-3 bg-black text-[#00FF66] font-black text-xs md:text-sm uppercase -rotate-6 border-4 border-[#00FF66] shadow-[4px_4px_0px_0px_#00FF66]">
            [ Pinky Is Watching ]
          </div>

          <img
            src="/pinky_t.png"
            alt="Pinky the Chameleon"
            className="w-full min-w-[300px] md:min-w-[500px] lg:min-w-[700px] h-auto object-contain transform transition-transform duration-700 hover:scale-105 hover:-rotate-1 drop-shadow-2xl"
          />
        </div>

      </div>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 mt-20 border-t-8 border-black">
        <div className="mb-16">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">How Pinky Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Step 1 */}
          <div className="border-4 border-black p-8 bg-[#00FF66] shadow-[8px_8px_0px_0px_#000] transform transition duration-300 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#000] group relative">
            <h3 className="text-7xl font-black mb-4 text-black border-b-4 border-black pb-4">1</h3>
            <h4 className="text-2xl font-black uppercase mb-3">Set Goal</h4>
            <p className="font-bold text-gray-900 leading-snug">Define exactly what you need to do and set a hard deadline. No vague aspirations allowed.</p>
          </div>

          {/* Step 2 */}
          <div className="border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_#000] transform transition duration-300 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#000] group">
            <h3 className="text-7xl font-black mb-4 text-[#FF003C] border-b-4 border-black pb-4">2</h3>
            <h4 className="text-2xl font-black uppercase mb-3">Choose Mode</h4>
            <p className="font-bold text-gray-700 leading-snug">Go Solo (Pinky trusts you to be honest), or invite an Accountability Partner to verify your work.</p>
          </div>

          {/* Step 3 */}
          <div className="border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_#000] transform transition duration-300 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#000] group">
            <h3 className="text-7xl font-black mb-4 text-[#FF003C] border-b-4 border-black pb-4">3</h3>
            <h4 className="text-2xl font-black uppercase mb-3">Stake Cash</h4>
            <p className="font-bold text-gray-700 leading-snug">Put your credit card on the line via Stripe. Commit a scary amount of money to guarantee action.</p>
          </div>

          {/* Step 4 */}
          <div className="border-4 border-black p-8 bg-black text-white shadow-[8px_8px_0px_0px_#00FF66] transform transition duration-300 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#00FF66] group">
            <h3 className="text-7xl font-black mb-4 text-[#00FF66] border-b-4 border-[#00FF66] pb-4">4</h3>
            <h4 className="text-2xl font-black uppercase mb-3 lg:whitespace-nowrap">Do OR Pay</h4>
            <p className="font-bold text-gray-300 leading-snug">Hit your deadline and keep your money. Fail, and Pinky charges your card. Zero exceptions.</p>
          </div>

        </div>
      </section>

      <Leaderboard />

      {/* Marquee Banner */}
      <div className="w-full border-y-4 border-black bg-[#00FF66] py-3 mt-12 overflow-hidden whitespace-nowrap flex font-black uppercase tracking-widest text-lg md:text-xl transform -rotate-1 scale-105 shadow-[0px_8px_0px_0px_#000]">
        <div className="animate-marquee inline-block">
          NO REFUNDS • NO EXCUSES • NO B.S. • DO YOUR WORK • NO REFUNDS • NO EXCUSES • NO B.S. • DO YOUR WORK • NO REFUNDS • NO EXCUSES • NO B.S. • DO YOUR WORK •
        </div>
      </div>

    </main>
  );
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <WaitlistContent />
    </Suspense>
  );
}
