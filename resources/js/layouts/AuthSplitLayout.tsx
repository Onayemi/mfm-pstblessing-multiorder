import { Head, Link } from "@inertiajs/react";
import type { ReactNode } from "react";

interface AuthSplitLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthSplitLayout({
    children,
    title,
    subtitle,
}: AuthSplitLayoutProps) {
    return (
        <div className="relative flex min-h-screen w-full overflow-x-hidden bg-white dark:bg-slate-900">
            <Head title={title} />

            {/* Split Screen Container */}
            <div className="flex min-h-screen w-full flex-col lg:flex-row">
                {/* LEFT SIDE: Flush Visual Hero Panel (50% Width) */}
                <div className="relative hidden shrink-0 flex-col justify-between overflow-hidden border-r border-slate-800 bg-slate-950 p-10 lg:flex lg:w-1/2 xl:p-14">
                    {/* Background Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-luminosity"
                        style={{
                            backgroundImage: `url('/images/playground.jpeg')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-950/40 to-transparent" />

                    {/* Top Logo */}
                    <div className="relative z-10">
                        <Link
                            href="/"
                            className="inline-flex items-center space-x-3"
                        >
                            <img
                                src="/images/logo.png"
                                alt="Pastor Blessing Logo"
                                className="h-20 w-auto object-cover"
                            />
                        </Link>
                    </div>

                    {/* Bottom Hero Text */}
                    <div className="relative z-10 w-full max-w-lg space-y-4">
                        <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-400 uppercase">
                            MFM Pastor Blessing
                        </span>
                        <h2 className="text-3xl leading-tight font-extrabold text-white xl:text-4xl">
                            Playground
                        </h2>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Soluta dicta modi a necessitatibus architecto
                            facere ex deserunt eligendi suscipit quasi rerum
                            tempora itaque amet maxime, harum, omnis officia
                            mollitia quibusdam?
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: Centered Form Panel (50% Width with Equal Inner Spacing) */}
                <div className="flex w-full shrink-0 flex-col justify-between overflow-y-auto bg-white p-6 sm:p-10 lg:w-1/2 xl:p-14 dark:bg-slate-900">
                    {/* Mobile Header Logo */}
                    <div className="mb-6 flex items-center justify-between lg:hidden">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="mx-10">
                                <img
                                    src="/images/logo.png"
                                    alt="Pastor Blessing Logo"
                                    className="h-20 w-auto"
                                />
                                <span className="text-lg font-bold text-slate-900 dark:text-white">
                                    MFM Pastor Blessing
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Perfectly Centered Form Wrapper */}
                    <div className="mx-auto my-auto w-full max-w-md">
                        <div className="mb-8 space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                {title}
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {subtitle}
                            </p>
                        </div>

                        {/* Form Inputs Container */}
                        <div className="w-full">{children}</div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
                        &copy; {new Date().getFullYear()} MFM Pastor Blessing.
                        All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}
