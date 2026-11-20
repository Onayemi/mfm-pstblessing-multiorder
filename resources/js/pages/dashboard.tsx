import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement, // 👈 Make sure ArcElement is imported
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import Can from "@/components/Can";

// Register all required elements including ArcElement
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement, // 👈 Register it here
    Title,
    Tooltip,
    Legend,
    Filler,
);

interface Attendee {
    group: string;
    play_game: boolean;
    subtotal: number;
}

interface Booking {
    id: number;
    ticket_code: string;
    customer_name: string;
    phone_number: string;
    attendees: Attendee[];
    total_price: number;
    booked_at: string;
    admin?: { name: string };
}

interface Props {
    metrics: {
        total_revenue: number;
        daily_revenue: number;
        total_tickets: number;
        adult_count: number;
        teenage_count: number;
        children_count: number;
        game_pass_count: number;
    };
    revenueTrend: { date: string; revenue: number }[];
    recentBookings: Booking[];
}

export default function XmasDashboard({
    metrics,
    revenueTrend,
    recentBookings,
}: Props) {
    const formatNaira = (val: number) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(Number(val) || 0);

    const lineChartData = {
        labels: revenueTrend.map((item) => item.date),
        datasets: [
            {
                fill: true,
                label: "Revenue (₦)",
                data: revenueTrend.map((item) => item.revenue),
                borderColor: "rgb(220, 38, 38)",
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                tension: 0.3,
            },
        ],
    };

    const doughnutData = {
        labels: ["Adult", "Teenage", "Children"],
        datasets: [
            {
                data: [
                    metrics.adult_count,
                    metrics.teenage_count,
                    metrics.children_count,
                ],
                backgroundColor: [
                    "rgb(239, 68, 68)",
                    "rgb(59, 130, 246)",
                    "rgb(16, 185, 129)",
                ],
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
            <Head title="MFM Pastor Blessing Analytics Dashboard" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            MFM Pastor Blessing Analytics
                        </h1>
                        <p className="text-sm text-slate-500">
                            Multi-attendee group metrics, revenue trends, and
                            ticket distributions.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={"/admin/bookings"}
                            // href={route('admin.xmas.index')}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm transition"
                        >
                            Manage Bookings
                        </Link>
                        <Link
                            href={"/admin/bookings/create"}
                            // href={route("admin.xmas.create")}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow transition"
                        >
                            + Issue Ticket
                        </Link>
                    </div>
                </div>

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Daily Revenue (Today)
                        </p>
                        <p className="text-2xl font-extrabold text-emerald-600 mt-2">
                            {formatNaira(metrics.daily_revenue)}
                        </p>
                    </div>
                    <Can roles={["superadmin", "admin"]}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Total Revenue
                            </p>
                            <p className="text-2xl font-extrabold text-slate-900 mt-2">
                                {formatNaira(metrics.total_revenue)}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Transactions / Groups
                            </p>
                            <p className="text-2xl font-extrabold text-red-600 mt-2">
                                {metrics.total_tickets}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Total Game Passes
                            </p>
                            <p className="text-2xl font-extrabold text-purple-600 mt-2">
                                {metrics.game_pass_count}
                            </p>
                        </div>
                    </Can>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2 flex flex-col justify-between">
                        <h2 className="text-base font-bold text-slate-800 mb-4">
                            📈 Revenue Trend (Last 7 Days)
                        </h2>
                        <div className="w-full h-72 flex items-center justify-center">
                            <Line
                                data={lineChartData}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { beginAtZero: true } },
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                        <h2 className="text-base font-bold text-slate-800 mb-4">
                            🎟️ Attendee Category Breakdown
                        </h2>
                        <div className="w-full h-64 flex items-center justify-center">
                            <Doughnut data={doughnutData} />
                        </div>
                    </div>
                </div>

                {/* Recent Bookings Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-bold text-slate-800">
                            ⚡ Recent Group Bookings
                        </h2>
                        <Link
                            href={"/admin/bookings"}
                            // href={route("admin.xmas.index")}
                            className="text-sm font-semibold text-red-600 hover:underline"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase">
                                    <th className="py-3 px-3">Ticket Code</th>
                                    <th className="py-3 px-3">Group Lead</th>
                                    <th className="py-3 px-3">Attendees</th>
                                    <th className="py-3 px-3">Total Amount</th>
                                    <th className="py-3 px-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {recentBookings.length > 0 ? (
                                    recentBookings.map((b) => (
                                        <tr
                                            key={b.id}
                                            className="hover:bg-slate-50 transition"
                                        >
                                            <td className="py-3 px-3 font-mono font-bold text-red-600">
                                                {b.ticket_code}
                                            </td>
                                            <td className="py-3 px-3 font-medium text-slate-900">
                                                {b.customer_name}
                                            </td>
                                            <td className="py-3 px-3">
                                                {b.attendees?.length || 0}{" "}
                                                person(s)
                                            </td>
                                            <td className="py-3 px-3 font-bold">
                                                {formatNaira(b.total_price)}
                                            </td>
                                            <td className="py-3 px-3 text-xs text-slate-500">
                                                {/* {new Date(
                                                    b.booked_at,
                                                ).toLocaleDateString()} */}
                                                {new Date(
                                                    b.booked_at,
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center py-6 text-slate-400"
                                        >
                                            No bookings recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
