import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { PenIcon, PrinterIcon, Trash2 } from "lucide-react";

interface Attendee {
    group: string;
    base_price: number;
    play_game: boolean;
    game_price: number;
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
    admin?: { name: string; role: string };
}

interface PaginatedBookings {
    data: Booking[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    bookings: PaginatedBookings;
    metrics: {
        total_revenue: number;
        daily_revenue: number;
        total_tickets: number;
    };
    filters: { search?: string; date?: string };
    flash?: { success?: string };
}

export default function Index({ bookings, metrics, filters, flash }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [date, setDate] = useState(filters.date || "");
    const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const formatNaira = (val: number) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(Number(val) || 0);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            "/admin/bookings",
            { search, date },
            { preserveState: true, replace: true },
        );
    };

    const handleReset = () => {
        setSearch("");
        setDate("");
        router.get(
            "/admin/bookings",
            {},
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this booking?")) {
            router.delete(`/admin/bookings/${id}`, {
                onSuccess: () => toast.success("Ticket deleted successfully!"),
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8">
            <Head title="Admin - Xmas Bookings" />

            {/* Print Stylesheet: Forces exact single-page containment on half-A4 / A5 */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #half-a4-ticket, #half-a4-ticket * { visibility: visible; }
                    @page {
                        size: A5 portrait;
                        margin: 5mm;
                    }
                    html, body {
                        height: 100%;
                        overflow: hidden !important;
                    }
                    #half-a4-ticket {
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        max-height: 195mm;
                        padding: 10mm;
                        margin: 0;
                        box-shadow: none !important;
                        border: 2px dashed #333 !important;
                        background: white !important;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            MFM Pastor Blessing Ticketing Management
                        </h1>
                        <p className="text-sm text-slate-500">
                            Multi-customer group bookings & revenue logs.
                        </p>
                    </div>
                    <Link
                        href={"/admin/bookings/create"}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow transition"
                    >
                        + Issue New Ticket
                    </Link>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-xs font-bold uppercase text-slate-400">
                            Daily Revenue
                        </p>
                        <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                            {formatNaira(metrics.daily_revenue)}
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-xs font-bold uppercase text-slate-400">
                            Total Revenue
                        </p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">
                            {formatNaira(metrics.total_revenue)}
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-xs font-bold uppercase text-slate-400">
                            Total Bookings
                        </p>
                        <p className="text-2xl font-extrabold text-red-600 mt-1">
                            {metrics.total_tickets}
                        </p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <form
                        onSubmit={handleFilter}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
                    >
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Search Customer / Code
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Name, phone, or ticket code..."
                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Filter by Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition shadow-sm"
                            >
                                Apply Filter
                            </button>
                            {(search || date) && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2.5 px-4 rounded-xl text-sm transition"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                                    <th className="py-3 px-4">Code</th>
                                    <th className="py-3 px-4">Lead Customer</th>
                                    <th className="py-3 px-4">Phone</th>
                                    <th className="py-3 px-4">
                                        Total Attendees
                                    </th>
                                    <th className="py-3 px-4">Total Amount</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4 text-right">
                                        Actions
                                    </th>
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
                                            <td className="py-3.5 px-4 font-semibold">
                                                {b.attendees?.length || 0}{" "}
                                                person(s)
                                            </td>
                                            <td className="py-3.5 px-4 font-bold">
                                                {formatNaira(b.total_price)}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-500">
                                                {/* {b.booked_at} */}
                                                {new Date(
                                                    b.booked_at,
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td className="flex py-3.5 px-4 text-right space-x-2">
                                                <button
                                                    onClick={() =>
                                                        setSelectedTicket(b)
                                                    }
                                                    className="text-blue-600 hover:underline text-xs font-semibold"
                                                >
                                                    <PrinterIcon className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/admin/bookings/${b.id}/edit`}
                                                    className="text-amber-600 hover:underline text-xs font-semibold"
                                                >
                                                    <PenIcon className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(b.id)
                                                    }
                                                    className="text-red-600 hover:underline text-xs font-semibold"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-center py-8 text-slate-400"
                                        >
                                            No bookings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {bookings.links && bookings.links.length > 3 && (
                    <div className="p-4 sm:p-5 border-t border-slate-200 flex flex-wrap justify-center gap-1.5 bg-slate-50/50">
                        {bookings.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || "#"}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                                    link.active
                                        ? "bg-red-600 text-white border-red-600 shadow-sm"
                                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                                } ${!link.url ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
                            />
                        ))}
                    </div>
                )}

                {/* Half-A4 / A5 Print Modal Preview */}
                {selectedTicket && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                            {/* Printable Ticket Container */}
                            <div
                                id="half-a4-ticket"
                                className="border-4 border-double border-red-700 p-5 rounded-2xl bg-white text-slate-900 space-y-3"
                            >
                                <div className="text-center border-b-2 border-dashed border-slate-300 pb-3">
                                    <div className="flex justify-between items-center">
                                        <img
                                            src="/images/logo.png"
                                            alt="MFM Pastor Blessing"
                                            className="h-12 object-contain"
                                        />
                                        <span className="text-3xl font-bold uppercase tracking-tight text-red-700">
                                            Pastor Blessing Pass
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-500 mt-1">
                                        Venue: Open Grounds By Onike Market
                                        Andoyi Street, Onike, Yaba, Lagos
                                    </p>
                                    <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-slate-100 rounded font-mono text-xs font-bold border">
                                        Ticket Code:{" "}
                                        {selectedTicket.ticket_code}
                                        {"-"}
                                        {new Date(
                                            selectedTicket.booked_at,
                                        ).getFullYear()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs border-b pb-2">
                                    <div>
                                        <span className="text-slate-500">
                                            Group Lead:
                                        </span>{" "}
                                        <strong className="block text-slate-900 truncate">
                                            {selectedTicket.customer_name}
                                        </strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">
                                            Phone:
                                        </span>{" "}
                                        <strong className="block text-slate-900">
                                            {selectedTicket.phone_number}
                                        </strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">
                                            Date:
                                        </span>{" "}
                                        <strong className="block text-slate-900">
                                            {/* {selectedTicket.booked_at} */}
                                            {new Date(
                                                selectedTicket.booked_at,
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">
                                            Staff:
                                        </span>{" "}
                                        <strong className="block text-slate-900 truncate">
                                            {selectedTicket.admin?.name ||
                                                "Admin"}
                                        </strong>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                                        Attendees (
                                        {selectedTicket.attendees?.length || 0})
                                    </p>
                                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                                        {selectedTicket.attendees?.map(
                                            (att, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200"
                                                >
                                                    <div>
                                                        <span className="font-bold text-slate-800">
                                                            {idx + 1}.{" "}
                                                            {att.group}
                                                        </span>
                                                        <span className="block text-[9px] text-slate-500">
                                                            {att.play_game
                                                                ? "✅ Game Pass"
                                                                : "❌ No Game"}
                                                        </span>
                                                    </div>
                                                    <span className="font-bold text-slate-900">
                                                        {formatNaira(
                                                            att.subtotal,
                                                        )}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <div className="pt-1 border-t border-dashed border-slate-300 flex justify-between items-center">
                                    <span className="font-bold text-sm">
                                        TOTAL PAID:
                                    </span>
                                    <span className="font-extrabold text-lg text-red-700">
                                        {formatNaira(
                                            selectedTicket.total_price,
                                        )}
                                    </span>
                                </div>

                                <div className="pt-2 flex flex-col items-center justify-center text-center">
                                    <QRCodeSVG
                                        value={JSON.stringify({
                                            code: selectedTicket.ticket_code,
                                            name: selectedTicket.customer_name,
                                            total: selectedTicket.total_price,
                                        })}
                                        size={85}
                                        level="H"
                                    />
                                    <p className="text-[9px] text-slate-400 mt-1">
                                        Scan QR code at the gate for admission.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 no-print pt-2">
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-semibold transition"
                                >
                                    🖨️ Print Ticket (Single Page)
                                </button>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 px-4 rounded-xl text-sm font-semibold transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
