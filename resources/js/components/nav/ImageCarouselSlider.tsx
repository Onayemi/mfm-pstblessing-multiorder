import React, { useState, useEffect } from "react";

interface CarouselSlideItem {
    id: number;
    image: string;
    // currencySymbol: string;
    // amount: string;
    // sourceName: string;
    // sourceLogo: string;
    // badgeColor: string;
    category: string;
    // title: string;
}

const CAROUSEL_SLIDES: CarouselSlideItem[] = [
    {
        id: 1,
        image: "/images/game/pic2.jpeg",
        category: "Game Playground",
    },
    {
        id: 2,
        image: "/images/game/pic3.jpeg",
        category: "Game Playground",
    },
    {
        id: 3,
        image: "/images/game/pic4.jpeg",
        category: "Game Playground",
    },
    {
        id: 4,
        image: "/images/game/pic8.jpeg",
        category: "Game Playground",
    },
    {
        id: 5,
        image: "/images/game/pic1.jpeg",
        category: "Game Playground",
    },
    {
        id: 6,
        image: "/images/game/pic6.jpeg",
        category: "Game Playground",
    },
    {
        id: 7,
        image: "/images/game/pic9.jpeg",
        category: "Game Playground",
    },
    {
        id: 8,
        image: "/images/game/pic5.jpeg",
        category: "Game Playground",
    },
    {
        id: 9,
        image: "/images/game/pic10.jpeg",
        category: "Game Playground",
    },
    {
        id: 10,
        image: "/images/game/pic11.jpeg",
        category: "Game Playground",
    },
    {
        id: 11,
        image: "/images/game/pic12.jpeg",
        category: "Game Playground",
    },
];

export default function ImageCarouselSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Determine items visible per view based on Tailwind breakpoints
    // sm = 1, md = 2, lg = 4
    const getVisibleCount = () => {
        if (typeof window === "undefined") return 4;
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };

    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setVisibleCount(4);
            } else if (window.innerWidth >= 768) {
                setVisibleCount(2);
            } else {
                setVisibleCount(1);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const maxIndex = Math.max(0, CAROUSEL_SLIDES.length - visibleCount);

    // Auto-advance slide every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [maxIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    return (
        <section className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Section Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                            MFM Pastor Blessing Children Games Play
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                            Explore Our Game Gallery
                        </h2>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex gap-2">
                        <button
                            onClick={prevSlide}
                            aria-label="Previous Slide"
                            className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center transition border border-slate-700/60 shadow"
                        >
                            ❮
                        </button>
                        <button
                            onClick={nextSlide}
                            aria-label="Next Slide"
                            className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center transition border border-slate-700/60 shadow"
                        >
                            ❯
                        </button>
                    </div>
                </div>

                {/* Horizontal Sliding Track */}
                <div className="relative overflow-hidden w-full">
                    <div
                        className="flex transition-transform duration-700 ease-out gap-6"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                        }}
                    >
                        {CAROUSEL_SLIDES.map((slide) => (
                            <div
                                key={slide.id}
                                className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0"
                            >
                                <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl h-[400px] flex flex-col justify-between group">
                                    {/* Background Image */}
                                    <img
                                        src={slide.image}
                                        // alt={slide.title}
                                        className="absolute inset-0 w-full h-full object-cover brightness-[0.95] group-hover:scale-135 transition duration-500"
                                    />

                                    {/* Gradient Vignette Overlay */}
                                    {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div> */}

                                    {/* Top Floating Category Badge */}
                                    <div className="relative z-10 p-5">
                                        <span className="bg-slate-900/80 backdrop-blur-md border border-slate-700/65 px-3 py-1 rounded-full text-[11px] font-bold text-white tracking-wide shadow">
                                            {slide.category}
                                        </span>
                                    </div>

                                    {/* Bottom Content & Notification Card */}
                                    <div className="relative z-10 p-5 space-y-4">
                                        {/* <h3 className="text-lg font-bold text-white">
                                            {slide.title}
                                        </h3> */}

                                        {/* Floating Amount Notification Card */}
                                        {/* <div className="bg-white/95 backdrop-blur-md text-slate-950 p-3.5 rounded-2xl shadow-lg flex items-center gap-3 border border-white/20">
                                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-base font-bold">
                                                {slide.sourceLogo}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[10px] font-semibold text-slate-500 uppercase truncate">
                                                    {slide.sourceName}
                                                </div>
                                                <div
                                                    className={`text-base font-black ${slide.badgeColor}`}
                                                >
                                                    +{slide.currencySymbol}
                                                    {slide.amount}
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
