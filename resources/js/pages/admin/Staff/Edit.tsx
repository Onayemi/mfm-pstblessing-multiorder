import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Toaster, toast } from "sonner";
import Can from "@/components/Can";

interface StaffMember {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    staffMember: StaffMember;
}

export default function Edit({ staffMember }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: staffMember.name,
        email: staffMember.email,
        password: "",
        password_confirmation: "",
        role: staffMember.role,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/staff/${staffMember.id}`, {
            // put(route('admin.staff.update', staffMember.id), {
            onSuccess: () =>
                toast.success("Staff account updated successfully!"),
            onError: () =>
                toast.error("Please check the form for validation errors."),
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
            <Head title="Edit Staff Account" />
            {/* <Toaster richColors position="top-right" /> */}

            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-slate-200">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h1 className="text-xl font-bold text-red-700">
                        ✏️ Edit Staff: {staffMember.name}
                    </h1>
                    <Link
                        href={"/admin/staff"}
                        className="text-sm text-slate-600 hover:underline font-medium"
                    >
                        ← Back
                    </Link>
                    {/* <Link href={route('admin.staff.index')} className="text-sm text-slate-600 hover:underline font-medium">← Back</Link> */}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 border-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
                            required
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 border-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
                            required
                        />
                        {errors.email && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* New Password Field with Show/Hide Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            New Password (Leave blank to keep current)
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full px-3.5 py-2.5 pr-12 rounded-xl border-slate-300 border-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800 focus:outline-none"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field with Show/Hide Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3.5 py-2.5 pr-12 rounded-xl border-slate-300 border-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800 focus:outline-none"
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>
                    <Can roles={["superadmin", "admin"]}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                System Role
                            </label>
                            <select
                                value={data.role}
                                onChange={(e) =>
                                    setData("role", e.target.value)
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 border-2 text-sm shadow-sm capitalize focus:border-red-500 focus:ring-red-500"
                            >
                                <option value="superadmin">Superadmin</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="cashier">Cashier</option>
                            </select>
                            {errors.role && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errors.role}
                                </p>
                            )}
                        </div>
                    </Can>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow transition text-sm disabled:opacity-50"
                    >
                        {processing ? "Saving..." : "Update Staff Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
