import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import Can from "@/components/Can";

interface Booking {
    id: number;
    ticket_code: string;
    customer_name: string;
    phone_number: string;
    group_type: string;
    play_game: boolean;
    total_price: number;
    booked_at: string;
    admin?: { name: string };
}

interface PaginatedBookings {
    data: Booking[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface SummaryMetrics {
    total_revenue: number;
    total_count: number;
    adult_count: number;
    teenage_count: number;
    children_count: number;
    game_count: number;
}

interface Props {
    bookings: PaginatedBookings;
    summary: SummaryMetrics;
    filters: {
        search?: string;
        group_type?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function ReportsIndex({ bookings, summary, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [groupType, setGroupType] = useState(filters.group_type || "");
    const [startDate, setStartDate] = useState(filters.start_date || "");
    const [endDate, setEndDate] = useState(filters.end_date || "");

    const formatNaira = (val: number) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(Number(val) || 0);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            "/admin/reports",
            // route('admin.xmas.reports.index'),
            {
                search,
                group_type: groupType,
                start_date: startDate,
                end_date: endDate,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleReset = () => {
        setSearch("");
        setGroupType("");
        setStartDate("");
        setEndDate("");
        router.get(
            "/admin/reports",
            // route("admin.xmas.reports.index"),
            {},
            { preserveState: true, replace: true },
        );
    };

    const exportQueryString = new URLSearchParams({
        ...(search && { search }),
        ...(groupType && { group_type: groupType }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
    }).toString();

    return (
        <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8">
            <Head title="Pastor Blessing Sales Reports & Analytics" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header & Export Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            📊 Sales & Booking Reports
                        </h1>
                        <p className="text-sm text-slate-500">
                            Filter records and export comprehensive CSV
                            summaries.
                        </p>
                    </div>
                    <Can roles={["superadmin", "admin"]}>
                        <a
                            href={`/admin/reports/export?${exportQueryString}`}
                            // href={`${route("admin.xmas.reports.export")}?${exportQueryString}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow transition flex items-center gap-2"
                        >
                            📥 Export to CSV / Excel
                        </a>
                    </Can>
                </div>

                {/* Summary Metrics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Can roles={["superadmin", "admin"]}>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                            <p className="text-[11px] font-bold uppercase text-slate-400">
                                Total Revenue
                            </p>
                            <p className="text-xl font-extrabold text-emerald-600 mt-1">
                                {formatNaira(summary.total_revenue)}
                            </p>
                        </div>
                    </Can>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-[11px] font-bold uppercase text-slate-400">
                            Total Bookings
                        </p>
                        <p className="text-xl font-extrabold text-slate-900 mt-1">
                            {summary.total_count}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-[11px] font-bold uppercase text-slate-400">
                            Adult Tickets
                        </p>
                        <p className="text-xl font-extrabold text-red-600 mt-1">
                            {summary.adult_count}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-[11px] font-bold uppercase text-slate-400">
                            Teenage Tickets
                        </p>
                        <p className="text-xl font-extrabold text-blue-600 mt-1">
                            {summary.teenage_count}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-[11px] font-bold uppercase text-slate-400">
                            Children Tickets
                        </p>
                        <p className="text-xl font-extrabold text-amber-600 mt-1">
                            {summary.children_count}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-[11px] font-bold uppercase text-slate-400">
                            Game Passes
                        </p>
                        <p className="text-xl font-extrabold text-purple-600 mt-1">
                            {summary.game_count}
                        </p>
                    </div>
                </div>

                {/* Advanced Filters */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <form
                        onSubmit={handleFilter}
                        className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
                    >
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Search Keyword
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Name, phone, code..."
                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 text-sm shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Group Category
                            </label>
                            <select
                                value={groupType}
                                onChange={(e) => setGroupType(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 text-sm shadow-sm capitalize"
                            >
                                <option value="">All Groups</option>
                                <option value="adult">Adult</option>
                                <option value="teenage">Teenage</option>
                                <option value="children">Children</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 text-sm shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 text-sm shadow-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-slate-900 text-white font-medium py-2.5 px-3 rounded-xl text-sm"
                            >
                                Filter
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="bg-slate-100 text-slate-700 font-medium py-2.5 px-3 rounded-xl text-sm"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Report Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[750px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                                    <th className="py-3 px-4">Ticket Code</th>
                                    <th className="py-3 px-4">Customer Name</th>
                                    <th className="py-3 px-4">Phone</th>
                                    <th className="py-3 px-4">Group</th>
                                    <th className="py-3 px-4">Game</th>
                                    <th className="py-3 px-4">Total Amount</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Processed By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm">
                                {bookings.data.length > 0 ? (
                                    bookings.data.map((b) => (
                                        <tr
                                            key={b.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                                                {b.ticket_code}
                                            </td>
                                            <td className="py-3.5 px-4 font-medium text-slate-900">
                                                {b.customer_name}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600">
                                                {b.phone_number}
                                            </td>
                                            <td className="py-3.5 px-4 capitalize font-semibold">
                                                {b.group_type}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {b.play_game
                                                    ? "✅ Yes"
                                                    : "❌ No"}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold">
                                                {formatNaira(b.total_price)}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-500">
                                                {new Date(
                                                    b.booked_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-600">
                                                {b.admin?.name ?? "System"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="text-center py-8 text-slate-400"
                                        >
                                            No report records found for these
                                            filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {bookings.links && bookings.links.length > 3 && (
                        <div className="p-4 border-t border-slate-200 flex justify-center gap-1">
                            {bookings.links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url || "#"}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                                        link.active
                                            ? "bg-red-600 text-white border-red-600"
                                            : "bg-white text-slate-700 border-slate-300"
                                    } ${!link.url ? "opacity-40 cursor-not-allowed" : ""}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
