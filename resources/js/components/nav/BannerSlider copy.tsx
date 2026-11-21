import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperCore } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

interface Slide {
    id: number;
    image: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
}

interface BannerSliderProps {
    slides: Slide[];
}

export default function BannerSlider({ slides }: BannerSliderProps) {
    const swiperRef = useRef<SwiperCore | null>(null);

    return (
        <div className="relative group w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden shadow-2xl">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 8000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    bulletClass:
                        "swiper-pagination-bullet !bg-white/50 !opacity-100 !w-2 !h-2 sm:!w-2.5 sm:!h-2.5 !transition-all !duration-300",
                    bulletActiveClass:
                        "swiper-pagination-bullet-active !w-6 sm:!w-8 !rounded-full !bg-blue-600",
                }}
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
                loop={true}
                className="w-full h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide
                        key={slide.id}
                        className="relative w-full h-full"
                    >
                        <img
                            src={slide.image}
                            alt={slide.title || "Banner image"}
                            className="w-full h-full object-cover object-center"
                        />

                        {/* Dark Gradient Overlay for optimal text contrast across all devices */}
                        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/20 via-black/10 to-transparent flex flex-col justify-end sm:justify-center items-start p-6 sm:p-10 md:p-16 text-white">
                            <div className="max-w-xl md:max-w-2xl space-y-3 sm:space-y-4">
                                {slide.title && (
                                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                        {slide.title}
                                    </h2>
                                )}
                                {slide.subtitle && (
                                    <p className="text-sm sm:text-base md:text-lg text-gray-200 line-clamp-2 sm:line-clamp-none">
                                        {slide.subtitle}
                                    </p>
                                )}
                                {slide.ctaText && slide.ctaLink && (
                                    <div className="pt-2">
                                        <a
                                            href={slide.ctaLink}
                                            className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg transition-transform active:scale-95"
                                        >
                                            {slide.ctaText}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Arrow - Left (Hidden on touch devices, visible on desktop hover) */}
            <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 hidden md:flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Custom Navigation Arrow - Right (Hidden on touch devices, visible on desktop hover) */}
            <button
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 hidden md:flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none"
                aria-label="Next slide"
            >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
        </div>
    );
}
