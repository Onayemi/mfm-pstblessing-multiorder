<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // If Manager or Cashier, redirect or restrict them to editing their own profile directly
        if (in_array($user->role, ['manager', 'cashier'])) {
            return redirect()->route('admin.staff.edit', $user->id);
        }

        $query = User::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        $staffMembers = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/Staff/Index', [
            'staffMembers' => $staffMembers,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        if (!in_array($user->role, ['superadmin', 'admin'])) {
            abort(403, 'Unauthorized action. Only Superadmins and Admins can create staff accounts.');
        }

        return Inertia::render('admin/Staff/Create');
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['superadmin', 'admin'])) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in(['superadmin', 'admin', 'manager', 'cashier'])],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('admin.staff.index')->with('success', 'Staff account created successfully!');
    }

    public function edit(User $staff)
    {
        $currentUser = auth()->user();

        // Managers and Cashiers can ONLY edit their own record
        if (in_array($currentUser->role, ['manager', 'cashier']) && $currentUser->id !== $staff->id) {
            abort(403, 'Unauthorized action. You can only edit your own account details.');
        }

        return Inertia::render('admin/Staff/Edit', [
            'staffMember' => $staff,
        ]);
    }

    public function update(Request $request, User $staff)
    {
        $currentUser = auth()->user();

        // Managers and Cashiers can ONLY update their own record
        if (in_array($currentUser->role, ['manager', 'cashier']) && $currentUser->id !== $staff->id) {
            abort(403, 'Unauthorized action.');
        }

        // Cashiers / Managers cannot elevate roles unless Superadmin/Admin
        $allowedRoles = ['superadmin', 'admin', 'manager', 'cashier'];
        if (in_array($currentUser->role, ['manager', 'cashier'])) {
            $request->merge(['role' => $staff->role]); // Keep existing role secure
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($staff->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in($allowedRoles)],
        ]);

        $staff->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => $validated['password'] ? Hash::make($validated['password']) : $staff->password,
        ]);

        $redirectRoute = in_array($currentUser->role, ['manager', 'cashier']) 
            ? route('admin.staff.edit', $staff->id) 
            : route('admin.staff.index');

        return redirect($redirectRoute)->with('success', 'Account updated successfully!');
    }

    public function destroy(User $staff)
    {
        $currentUser = auth()->user();
        if (!in_array($currentUser->role, ['superadmin', 'admin'])) {
            abort(403, 'Unauthorized action.');
        }

        if ($staff->id === $currentUser->id) {
            return back()->with('error', 'You cannot delete your own active account.');
        }

        $staff->delete();

        return redirect()->route('admin.staff.index')->with('success', 'Staff account deleted successfully!');
    }
}
