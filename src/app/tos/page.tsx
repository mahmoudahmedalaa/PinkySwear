import Link from 'next/link';

export default function TOSPage() {
    return (
        <main className="min-h-screen bg-white text-black p-8 md:p-16">
            <nav className="mb-12 border-b-4 border-black pb-4 flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tighter uppercase">PinkySwear<span className="text-[#FF003C]">.TOS</span></h1>
                <Link href="/" className="font-bold border-2 border-black px-4 py-2 hover:bg-[#00FF66] transition-colors">BACK TO SAFETY</Link>
            </nav>

            <div className="max-w-4xl mx-auto border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_#000]">
                <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 bg-black text-white inline-block px-4 py-2">
                    Terms of Service & No B.S. Policy
                </h2>

                <div className="space-y-8 font-bold text-lg text-gray-800 leading-relaxed">
                    <section>
                        <h3 className="text-2xl font-black uppercase text-[#FF003C] mb-2">1. The "Skin in the Game" Clause (No Refunds)</h3>
                        <p>
                            PinkySwear exists entirely as an accountability mechanism. By utilizing this service, you are intentionally placing your money at risk.
                            <strong> ALL CHARGES PROCESSED THROUGH PINKYSWEAR ARE FINAL AND NON-REFUNDABLE.</strong> If you fail to meet your self-imposed deadline,
                            your credit card will be charged the designated penalty amount. You waive all rights to dispute these charges, as the fundamental purpose
                            of this agreement is intended financial consequence for inaction.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-black uppercase text-[#FF003C] mb-2">2. The Pre-Order "Bailout Token"</h3>
                        <p>
                            Purchasing a $5 Bailout Token grants you guaranteed early access to the PinkySwear application upon release. It also entitles you to
                            coverage (or forgiveness) on your very first failed goal penalty up to $100. This $5 charge is immediate, non-refundable, and serves as
                            your preliminary commitment.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-black uppercase text-[#FF003C] mb-2">3. Dispute and Chargeback Liability</h3>
                        <p>
                            When you click "Lock In & Pre-Order" or "Bet On Yourself," you explicitly authorize the transaction. Attempting to reverse charges
                            through your bank or credit card provider (a chargeback) for a failed accountability task constitutes fraud under our terms. We meticulously
                            log user IP addresses, time stamps, and digital consent markers to win disputes. We will furnish this irrefutable proof to Stripe and
                            your issuing bank.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-black uppercase text-[#FF003C] mb-2">4. User Veracity</h3>
                        <p>
                            In "Solo Mode," Pinky trusts your honesty regarding task completion. Lying to the system to save your money invalidates the psychological
                            utility of the app. We don't legally care if you lie, but you will know you are a fraud. In "Verified Mode", your assigned accountability
                            partner has the final overriding vote on whether your task was completed. Their ruling is final and legally binding on charge execution.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-black uppercase text-black mb-2">5. Total Acknowledgment</h3>
                        <p className="bg-gray-100 border-l-4 border-black pl-4 py-2">
                            By using PinkySwear, you legally acknowledge that you are using a psychological coercion tool of your own free will. You accept full
                            financial liability for your own procrastination.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
