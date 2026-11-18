import React, { useMemo, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

type GroupType = "adult" | "teenage" | "children";

interface AttendeeInput {
    group: GroupType;
    play_game: boolean;
}

interface Booking {
    id: number;
    customer_name: string;
    phone_number: string;
    attendees: {
        group: string;
        base_price: number;
        play_game: boolean;
        game_price: number;
        subtotal: number;
    }[];
}

interface Props {
    booking: Booking;
    pricing: {
        groups: Record<GroupType, number>;
        game: number;
    };
    flash?: { success?: string; error?: string };
}

export default function Edit({ booking, pricing, flash }: Props) {
    // Map existing JSON attendees to form state format
    const initialAttendees: AttendeeInput[] = booking.attendees.map((att) => ({
        group: (att.group.toLowerCase() as GroupType) || "adult",
        play_game: Boolean(att.play_game),
    }));

    const { data, setData, put, processing, errors } = useForm<{
        customer_name: string;
        phone_number: string;
        attendees: AttendeeInput[];
    }>({
        customer_name: booking.customer_name,
        phone_number: booking.phone_number,
        attendees:
            initialAttendees.length > 0
                ? initialAttendees
                : [{ group: "adult", play_game: false }],
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const formatNaira = (val: number) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(Number(val) || 0);

    const addAttendee = () => {
        setData("attendees", [
            ...data.attendees,
            { group: "adult", play_game: false },
        ]);
    };

    const removeAttendee = (index: number) => {
        if (data.attendees.length === 1) return;
        setData(
            "attendees",
            data.attendees.filter((_, i) => i !== index),
        );
    };

    const updateAttendee = <K extends keyof AttendeeInput>(
        index: number,
        field: K,
        value: AttendeeInput[K],
    ) => {
        const updated = [...data.attendees];
        updated[index] = { ...updated[index], [field]: value };
        setData("attendees", updated);
    };

    const grandTotal = useMemo(() => {
        return data.attendees.reduce((sum, item) => {
            const base = Number(pricing?.groups?.[item.group]) || 0;
            const game = item.play_game ? Number(pricing?.game) || 0 : 0;
            return sum + base + game;
        }, 0);
    }, [data.attendees, pricing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/bookings/${booking.id}`, {
            // put(route('admin.xmas.update', booking.id), {
            onSuccess: () => toast.success("Booking updated successfully!"),
            onError: () =>
                toast.error("Please check the form for validation errors."),
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
            <Head title={`Edit Booking #${booking.id}`} />
            <Toaster richColors position="top-right" />

            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-slate-200">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h1 className="text-xl font-bold text-red-700">
                        🎅 Edit Multi-Attendee Booking #{booking.id}
                    </h1>
                    <Link
                        href={"/admin/bookings"}
                        // href={route("admin.xmas.index")}
                        className="text-sm text-slate-600 hover:underline font-medium"
                    >
                        ← Back to List
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Primary Contact Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Primary Customer Name
                            </label>
                            <input
                                type="text"
                                value={data.customer_name}
                                onChange={(e) =>
                                    setData("customer_name", e.target.value)
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 border-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
                                required
                            />
                            {errors.customer_name && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errors.customer_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Primary Phone Number
                            </label>
                            <input
                                type="tel"
                                value={data.phone_number}
                                onChange={(e) =>
                                    setData("phone_number", e.target.value)
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 border-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
                                // required
                            />
                            {errors.phone_number && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errors.phone_number}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Attendees Repeater */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-t pt-4">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                                Attendees ({data.attendees.length})
                            </h2>
                            <button
                                type="button"
                                onClick={addAttendee}
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-xl shadow transition"
                            >
                                + Add Attendee
                            </button>
                        </div>

                        {data.attendees.map((attendee, index) => {
                            const basePrice =
                                Number(pricing?.groups?.[attendee.group]) || 0;
                            const lineTotal =
                                basePrice +
                                (attendee.play_game
                                    ? Number(pricing?.game) || 0
                                    : 0);

                            return (
                                <div
                                    key={index}
                                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500">
                                            ATTENDEE #{index + 1}
                                        </span>
                                        {data.attendees.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeAttendee(index)
                                                }
                                                className="text-xs text-red-600 hover:underline font-semibold"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                                Select Group Category
                                            </label>
                                            <select
                                                value={attendee.group}
                                                onChange={(e) =>
                                                    updateAttendee(
                                                        index,
                                                        "group",
                                                        e.target
                                                            .value as GroupType,
                                                    )
                                                }
                                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 border-2 text-sm shadow-sm"
                                            >
                                                <option value="adult">
                                                    Adult (
                                                    {formatNaira(
                                                        pricing?.groups?.adult,
                                                    )}
                                                    )
                                                </option>
                                                <option value="teenage">
                                                    Teenage (
                                                    {formatNaira(
                                                        pricing?.groups
                                                            ?.teenage,
                                                    )}
                                                    )
                                                </option>
                                                <option value="children">
                                                    Children (
                                                    {formatNaira(
                                                        pricing?.groups
                                                            ?.children,
                                                    )}
                                                    )
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                                Subtotal (Locked)
                                            </label>
                                            <input
                                                type="text"
                                                value={formatNaira(lineTotal)}
                                                readOnly
                                                disabled
                                                tabIndex={-1}
                                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 border-2 bg-slate-200 text-slate-800 font-bold text-sm cursor-not-allowed select-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer pt-1">
                                            <input
                                                type="checkbox"
                                                checked={attendee.play_game}
                                                onChange={(e) =>
                                                    updateAttendee(
                                                        index,
                                                        "play_game",
                                                        e.target.checked,
                                                    )
                                                }
                                                className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                                            />
                                            <span className="text-xs font-semibold text-slate-700">
                                                Include Game Pass (+
                                                {formatNaira(pricing?.game)})
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Grand Total Box */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                        <span className="font-bold text-red-900">
                            Grand Total Payable:
                        </span>
                        <span className="font-extrabold text-xl text-red-700">
                            {formatNaira(grandTotal)}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition text-sm disabled:opacity-50"
                    >
                        {processing ? "Saving Changes..." : "Update Booking"}
                    </button>
                </form>
            </div>
        </div>
    );
}
