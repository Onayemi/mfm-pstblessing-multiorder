import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "cashier",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/staff", {
            // post(route('admin.staff.store'), {
            onSuccess: () =>
                toast.success("Staff member created successfully!"),
            onError: () =>
                toast.error("Please check the form for validation errors."),
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
            <Head title="Create Staff Account" />
            <Toaster richColors position="top-right" />

            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-slate-200">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h1 className="text-xl font-bold text-red-700">
                        ➕ Create New Staff Account
                    </h1>
                    <Link
                        href="/admin/staff"
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

                    {/* Password Field with Show/Hide Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full px-3.5 py-2.5 pr-12 rounded-xl border-slate-300 border-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
                                required
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

                    {/* Password Confirmation Field with Show/Hide Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Confirm Password
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
                                required
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

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            System Role
                        </label>
                        <select
                            value={data.role}
                            onChange={(e) => setData("role", e.target.value)}
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

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow transition text-sm disabled:opacity-50"
                    >
                        {processing ? "Creating..." : "Create Staff Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
