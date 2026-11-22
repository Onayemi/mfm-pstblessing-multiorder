import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { QRCodeSVG } from "qrcode.react";
import { Toaster, toast } from "sonner";
import Can from "@/components/Can";
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

interface GroupedItem {
    group: string;
    count: number;
    unitPrice: number;
    totalBasePrice: number;
}

type PaperSize = "a5" | "thermal80";

export default function Index({ bookings, metrics, filters, flash }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [date, setDate] = useState(filters.date || "");
    const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);
    const [paperSize, setPaperSize] = useState<PaperSize>("a5");

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

    const getGroupedSummary = (attendees: Attendee[] = []) => {
        const groupMap: Record<string, GroupedItem> = {};
        let gameCount = 0;
        let gameUnitPrice = 0;
        let totalGamePrice = 0;

        attendees.forEach((att) => {
            const key = att.group;
            const base = Number(att.base_price) || 0;

            if (!groupMap[key]) {
                groupMap[key] = {
                    group: key,
                    count: 0,
                    unitPrice: base,
                    totalBasePrice: 0,
                };
            }
            groupMap[key].count += 1;
            groupMap[key].totalBasePrice += base;

            if (att.play_game) {
                const gPrice = Number(att.game_price) || 0;
                gameCount += 1;
                gameUnitPrice = gPrice;
                totalGamePrice += gPrice;
            }
        });

        return {
            groups: Object.values(groupMap),
            gameCount,
            gameUnitPrice,
            totalGamePrice,
        };
    };

    const groupedSummary = selectedTicket
        ? getGroupedSummary(selectedTicket.attendees)
        : null;

    const isThermal = paperSize === "thermal80";

    return (
        <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:min-h-0">
            <Head title="Admin - MFM Pastor Blessing Bookings" />
            <Toaster richColors position="top-right" />

            {/* Dynamic Zero-Clip Print Stylesheet for Half-A4 (A5) or 80mm Thermal */}
            <style>{`
                @media print {
                    @page {
                        size: ${isThermal ? "80mm auto" : "A5 portrait"};
                        margin: ${isThermal ? "3mm" : "6mm"};
                    }
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    #print-modal-backdrop {
                        position: static !important;
                        background: transparent !important;
                        padding: 0 !important;
                        display: block !important;
                    }
                    #print-modal-card {
                        box-shadow: none !important;
                        border: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                        max-height: none !important;
                        overflow: visible !important;
                        background: transparent !important;
                    }
                    #ticket-print-sheet {
                        box-sizing: border-box !important;
                        width: 100% !important;
                        max-width: ${isThermal ? "74mm" : "136mm"} !important;
                        margin: 0 auto !important;
                        padding: ${isThermal ? "3mm" : "6mm"} !important;
                        border: ${isThermal ? "1px dashed #334155" : "2px solid #b91c1c"} !important;
                        border-radius: ${isThermal ? "4px" : "8px"} !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                }
            `}</style>

            {/* Main Dashboard Content (Hidden during print) */}
            <div className="max-w-7xl mx-auto space-y-6 no-print">
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
                        href="/admin/bookings/create"
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
                    <Can roles={["superadmin", "admin"]}>
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
                    </Can>
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

                {/* Bookings Table */}
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
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="flex py-3.5 px-4 text-right space-x-2">
                                                <button
                                                    onClick={() =>
                                                        setSelectedTicket(b)
                                                    }
                                                    className="text-blue-600 hover:underline text-xs font-semibold"
                                                >
                                                    {/* View/Print */}
                                                    <PrinterIcon className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/admin/bookings/${b.id}/edit`}
                                                    className="text-amber-600 hover:underline text-xs font-semibold"
                                                >
                                                    {/* Edit */}
                                                    <PenIcon className="w-4 h-4" />
                                                </Link>
                                                <Can
                                                    roles={[
                                                        "superadmin",
                                                        "admin",
                                                    ]}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(b.id)
                                                        }
                                                        className="text-red-600 hover:underline text-xs font-semibold"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </Can>
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
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                                    link.active
                                        ? "bg-red-600 text-white border-red-600 shadow-sm"
                                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                                } ${!link.url ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Print Preview Modal with Half-A4 (A5) & 80mm Thermal Toggle */}
            {selectedTicket && groupedSummary && (
                <div
                    id="print-modal-backdrop"
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <div
                        id="print-modal-card"
                        className="bg-slate-100 rounded-2xl p-4 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto"
                    >
                        {/* Modal Top Bar & Paper Size Toggle */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 no-print">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                📄 Print Preview
                            </span>

                            <div className="inline-flex rounded-xl bg-slate-200 p-1">
                                <button
                                    type="button"
                                    onClick={() => setPaperSize("a5")}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                        !isThermal
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    Half-A4 (A5)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaperSize("thermal80")}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                        isThermal
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    80mm Thermal
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedTicket(null)}
                                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Paper Sheet Preview Container */}
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 print:p-0 print:border-0 print:shadow-none flex justify-center">
                            <div
                                id="ticket-print-sheet"
                                className={`w-full bg-white text-slate-900 transition-all ${
                                    isThermal
                                        ? "max-w-[290px] border border-dashed border-slate-400 p-3 rounded-lg space-y-2"
                                        : "max-w-[390px] border-2 border-red-700 p-4 rounded-xl space-y-3"
                                }`}
                            >
                                {/* Ticket Header */}
                                <div className="text-center border-b-2 border-dashed border-slate-300 pb-2">
                                    <div
                                        className={`flex items-center gap-2 ${
                                            isThermal
                                                ? "flex-col justify-center"
                                                : "justify-between"
                                        }`}
                                    >
                                        <img
                                            src="/images/logo.png"
                                            alt="MFM Pastor Blessing"
                                            className={`${isThermal ? "h-12" : "h-12"} w-auto object-contain shrink-0`}
                                        />
                                        <span
                                            className={`font-extrabold uppercase tracking-tight text-red-700 ${
                                                isThermal
                                                    ? "text-xs text-center"
                                                    : "text-md text-right"
                                            }`}
                                        >
                                            MFM Pastor Blessing Ticket Pass
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-slate-600 mt-1 leading-snug">
                                        Date: 6th - 29th, Dec 2026; Time: 8:00am
                                        Daily
                                    </p>
                                    <p className="text-[12px] text-slate-600 mt-1 leading-snug">
                                        Venue: Open Grounds By Onike Market
                                        Andoyi Street, Onike, Yaba, Lagos
                                    </p>
                                    <div className="mt-1.5">
                                        <span className="inline-block px-2.5 py-0.5 bg-slate-100 rounded font-mono text-[11px] font-bold border border-slate-300">
                                            Ticket Code:{" "}
                                            {selectedTicket.ticket_code}
                                            {"/"}
                                            {new Date(
                                                selectedTicket.booked_at,
                                            ).getFullYear()}
                                        </span>
                                    </div>
                                </div>

                                {/* Lead Customer Details */}
                                <div
                                    className={`grid gap-x-2 gap-y-1 text-[11px] border-b border-slate-200 pb-2 ${
                                        isThermal
                                            ? "grid-cols-1"
                                            : "grid-cols-2"
                                    }`}
                                >
                                    <div>
                                        <span className="text-slate-500 text-[10px]">
                                            Group Lead:{" "}
                                        </span>
                                        <strong className="text-slate-900 break-words">
                                            {selectedTicket.customer_name}
                                        </strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-[10px]">
                                            Phone:{" "}
                                        </span>
                                        <strong className="text-slate-900">
                                            {selectedTicket.phone_number}
                                        </strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-[10px]">
                                            Date:{" "}
                                        </span>
                                        <strong className="text-slate-900">
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
                                        <span className="text-slate-500 text-[10px]">
                                            Staff:{" "}
                                        </span>
                                        <strong className="text-slate-900 break-words">
                                            {selectedTicket.admin?.name ||
                                                "Admin"}
                                        </strong>
                                    </div>
                                </div>

                                {/* Grouped Category & Pricing Summary Table */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-[10px] font-bold uppercase text-slate-600">
                                            Booking Summary
                                        </p>
                                        <span className="text-[10px] font-bold text-slate-800">
                                            Guests:{" "}
                                            {selectedTicket.attendees?.length ||
                                                0}
                                        </span>
                                    </div>

                                    <table className="w-full text-left border-collapse text-[11px] border border-slate-300">
                                        <thead>
                                            <tr className="bg-slate-100 border-b border-slate-300 text-[9px] uppercase text-slate-700">
                                                <th className="py-1 px-1.5">
                                                    Category
                                                </th>
                                                <th className="py-1 px-1 text-center">
                                                    Qty
                                                </th>
                                                <th className="py-1 px-1.5 text-right">
                                                    Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {groupedSummary.groups.map(
                                                (item) => (
                                                    <tr key={item.group}>
                                                        <td className="py-1 px-1.5 font-semibold text-slate-800">
                                                            {item.group}
                                                            <span className="block text-[9px] font-normal text-slate-500">
                                                                {formatNaira(
                                                                    item.unitPrice,
                                                                )}{" "}
                                                                each
                                                            </span>
                                                        </td>
                                                        <td className="py-1 px-1 text-center font-bold text-slate-900">
                                                            {item.count}
                                                        </td>
                                                        <td className="py-1 px-1.5 text-right font-bold text-slate-900">
                                                            {formatNaira(
                                                                item.totalBasePrice,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}

                                            {groupedSummary.gameCount > 0 && (
                                                <tr className="bg-emerald-50">
                                                    <td className="py-1 px-1.5 font-semibold text-emerald-900">
                                                        Game Pass
                                                        <span className="block text-[9px] font-normal text-emerald-700">
                                                            {formatNaira(
                                                                groupedSummary.gameUnitPrice,
                                                            )}{" "}
                                                            each
                                                        </span>
                                                    </td>
                                                    <td className="py-1 px-1 text-center font-bold text-emerald-900">
                                                        {
                                                            groupedSummary.gameCount
                                                        }
                                                    </td>
                                                    <td className="py-1 px-1.5 text-right font-bold text-emerald-900">
                                                        {formatNaira(
                                                            groupedSummary.totalGamePrice,
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Grand Total */}
                                <div className="pt-1.5 border-t-2 border-dashed border-slate-300 flex justify-between items-center">
                                    <span className="font-bold text-xs uppercase text-slate-700">
                                        Total Paid:
                                    </span>
                                    <span
                                        className={`font-extrabold text-red-700 ${
                                            isThermal ? "text-base" : "text-lg"
                                        }`}
                                    >
                                        {formatNaira(
                                            selectedTicket.total_price,
                                        )}
                                    </span>
                                </div>

                                {/* QR Verification */}
                                <div className="pt-1 flex flex-col items-center justify-center text-center">
                                    <QRCodeSVG
                                        value={JSON.stringify({
                                            code: selectedTicket.ticket_code,
                                            name: selectedTicket.customer_name,
                                            guests:
                                                selectedTicket.attendees
                                                    ?.length || 0,
                                            total: selectedTicket.total_price,
                                            Event_date: new Date(
                                                selectedTicket.booked_at,
                                            ).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }),
                                        })}
                                        size={isThermal ? 68 : 76}
                                        level="H"
                                    />
                                    <p className="text-[9px] text-slate-500 mt-1">
                                        Scan QR code at the gate for admission.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Print & Close Controls */}
                        <div className="flex gap-2 no-print">
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold transition shadow"
                            >
                                🖨️ Print (
                                {isThermal ? "80mm Thermal" : "Half-A4 / A5"})
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedTicket(null)}
                                className="bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 py-2.5 px-4 rounded-xl text-sm font-semibold transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
