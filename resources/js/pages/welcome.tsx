import BannerSlider from "@/components/nav/BannerSlider";
import ImageCarouselSlider from "@/components/nav/ImageCarouselSlider";
import MainLayout from "@/layouts/main-layout";

const bannerSlides = [
    {
        id: 1,
        image: "/images/banners/banner1.jpg",
        // image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
        // title: "Build Modern Apps with Laravel & React",
        // subtitle:
        //     "Deliver high-performance web experiences with Inertia.js and TypeScript.",
        // ctaText: "Get Started",
        // ctaLink: "/about",
    },
    {
        id: 2,
        image: "/images/banners/banner2.jpg",
    },
    {
        id: 3,
        image: "/images/banners/banner3.jpg",
    },
    // {
    //     id: 4,
    //     image: "/images/banners/banner4.png",
    // },
];

export default function Welcome() {
    // const { auth } = usePage().props;

    return (
        <MainLayout title="Home Page" description="Welcome to our home page">
            {/* Full-width Hero Banner Slider */}
            <BannerSlider slides={bannerSlides} />

            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#6b0501] to-[#c72d06] text-white text-center">
                <div className="max-w-4xl mx-auto space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Pastor Blessing Children Games Play
                    </h1>
                    <p className="text-slate-200 text-lg font-light max-w-2xl mx-auto">
                        Welcome to our game gallery! Explore a world of fun and
                        excitement as you discover a variety of games that will
                        keep you entertained for hours. From action-packed
                        adventures to brain-teasing puzzles, we have something
                        for everyone. Dive in and let the games begin!
                    </p>
                </div>
            </div>

            {/* Carousel Slide */}
            <ImageCarouselSlider />

            {/* Logo Carousel Slide */}
            {/* <LogoCarousel /> */}
        </MainLayout>
    );
}
