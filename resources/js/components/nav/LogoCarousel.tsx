import React from "react";

const PARTNERS = [
    { name: "Paystack", logoText: "⚡ Paystack" },
    { name: "Nairametrics", logoText: "📊 Nairametrics" },
    { name: "BusinessDay", logoText: "📰 BusinessDay" },
    { name: "Visa", logoText: "💳 VISA" },
    { name: "Mastercard", logoText: "🌐 Mastercard" },
    { name: "Verve", logoText: "🛡️ Verve" },
    { name: "Emirates", logoText: "✈️ Emirates" },
    { name: "Qatar Airways", logoText: "🛫 Qatar Airways" },
];

export default function LogoCarousel() {
    return (
        <section className="py-12 bg-slate-900 border-y border-slate-800 overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <h3 className="text-2xl font-bold uppercase tracking-widest text-slate-400 text-center">
                    Our Partners
                </h3>

                {/* Horizontal Infinite Sliding Marquee Track */}
                <div className="relative w-full overflow-hidden flex [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <div className="flex animate-marquee gap-8 py-4 shrink-0">
                        {PARTNERS.concat(PARTNERS).map((partner, idx) => (
                            <div
                                key={idx}
                                className="bg-transparent border border-slate-700/60 px-8 py-4 rounded-2xl text-white font-bold text-sm tracking-wide shadow-sm flex items-center gap-2 hover:border-amber-400/50 transition shrink-0"
                            >
                                <span>{partner.logoText}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
