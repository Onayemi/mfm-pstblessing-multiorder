import PageHero from "@/components/nav/PageHero";
import MainLayout from "@/layouts/main-layout";
import { Link } from "@inertiajs/react";

export default function NotFound() {
    return (
        <MainLayout
            title="Contact Us"
            description="Explore our range of travel solutions including flight bookings, hotel reservations, and visa consultations."
        >
            <PageHero
                badge="Error 404 Page"
                title="Error 404 Page"
                subtitle=""
            />

            <div className="flex flex-col items-center justify-center my-10 bg-gray-50 text-gray-800 px-4">
                <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                    Sorry, the page you are looking for doesn't exist or has
                    been moved.
                </p>
                <Link
                    href="/"
                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                >
                    Back to Home
                </Link>
            </div>
        </MainLayout>
    );
}
