import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { toast } from "sonner";

interface Staff {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface PaginatedStaff {
    data: Staff[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
}

interface Props {
    staffMembers?: PaginatedStaff;
    filters?: { search?: string; role?: string };
    flash?: { success?: string; error?: string };
}

export default function Index({ staffMembers, filters, flash }: Props) {
    const [search, setSearch] = useState(filters?.search || "");
    const [role, setRole] = useState(filters?.role || "");
    console.log(staffMembers);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            "/admin/staff",
            { search, role },
            { preserveState: true, replace: true },
        );
        // router.get(route('admin.staff.index'), { search, role }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this staff member?")) {
            router.delete(`/admin/staff/${id}`, {
                // router.delete(route("admin.staff.destroy", id), {
                onSuccess: () => toast.success("Staff deleted successfully!"),
            });
        }
    };

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            superadmin: "bg-purple-100 text-purple-800 border-purple-200",
            admin: "bg-red-100 text-red-800 border-red-200",
            manager: "bg-amber-100 text-amber-800 border-amber-200",
            cashier: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
        return (
            colors[role?.toLowerCase()] ||
            "bg-slate-100 text-slate-800 border-slate-200"
        );
    };

    // Safely extract data array from pagination object
    const staffList = staffMembers?.data ?? [];

    return (
        <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8">
            <Head title="Staff Accounts Management" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            👥 Staff Accounts Management
                        </h1>
                        <p className="text-sm text-slate-500">
                            View and manage administrative and cashier accounts.
                        </p>
                    </div>
                    <Link
                        href={"/admin/staff/create"}
                        // href={route("admin.staff.create")}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow transition"
                    >
                        + Add New Staff
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
                    <form
                        onSubmit={handleFilter}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
                    >
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Search Staff
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Name or email..."
                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 border-2 text-sm shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Filter by Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border-slate-300 border-2 text-sm shadow-sm capitalize"
                            >
                                <option value="">All Roles</option>
                                <option value="superadmin">Superadmin</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="cashier">Cashier</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-3 rounded-xl text-sm transition"
                            >
                                Filter
                            </button>
                            <Link
                                href={"/admin/staff"}
                                // href={route("admin.staff.index")}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-3 rounded-xl text-sm flex items-center justify-center transition"
                            >
                                Reset
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Role</th>
                                    <th className="py-3 px-4">Created Date</th>
                                    <th className="py-3 px-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm">
                                {staffList.length > 0 ? (
                                    staffList.map((staff) => (
                                        <tr
                                            key={staff.id}
                                            className="hover:bg-slate-50 transition"
                                        >
                                            <td className="py-3.5 px-4 font-semibold text-slate-900">
                                                {staff.name}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600">
                                                {staff.email}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${getRoleBadge(staff.role)}`}
                                                >
                                                    {staff.role}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-500">
                                                {new Date(
                                                    staff.created_at,
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td className="py-3.5 px-4 text-right space-x-3">
                                                <Link
                                                    href={`/admin/staff/${staff.id}/edit`}
                                                    // href={route(
                                                    //     "admin.staff.edit",
                                                    //     staff.id,
                                                    // )}
                                                    className="text-amber-600 hover:underline font-semibold text-xs"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(staff.id)
                                                    }
                                                    className="text-red-600 hover:underline font-semibold text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center py-12 text-slate-400"
                                        >
                                            No staff accounts found in the
                                            database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {staffMembers?.links && staffMembers.links.length > 3 && (
                        <div className="p-4 border-t border-slate-200 flex flex-wrap justify-center gap-1">
                            {staffMembers.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || "#"}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                                        link.active
                                            ? "bg-red-600 text-white border-red-600"
                                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
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
