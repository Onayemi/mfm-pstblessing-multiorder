<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

        return Inertia::render('Admin/Staff/Index', [
            'staffMembers' => $staffMembers,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        if ($user->role === 'cashier') {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('admin/Staff/Create', [
            'roles' => ['superadmin', 'admin', 'manager', 'cashier'],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:superadmin,admin,manager,cashier'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('admin.staff.index')->with('success', 'Staff account created successfully.');
    }

    public function edit(User $staff)
    {
        $currentUser = auth()->user();

        // Cashiers can only view/edit their own details
        if ($currentUser->role === 'cashier' && $currentUser->id !== $staff->id) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('admin/Staff/Edit', [
            'staff' => $staff,
            'roles' => ['superadmin', 'admin', 'manager', 'cashier'],
        ]);
    }

    public function update(Request $request, User $staff)
    {
        $currentUser = auth()->user();

        if ($currentUser->role === 'cashier' && $currentUser->id !== $staff->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $staff->id],
            'role' => ['required', 'in:superadmin,admin,manager,cashier'],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $staff->name = $validated['name'];
        $staff->email = $validated['email'];
        $staff->role = $validated['role'];

        if (!empty($validated['password'])) {
            $staff->password = Hash::make($validated['password']);
        }

        $staff->save();

        return redirect()->route('admin.staff.index')->with('success', 'Staff account updated successfully.');
    }

    public function destroy(User $staff)
    {
        if ($staff->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own active account.');
        }

        $staff->delete();

        return redirect()->route('admin.staff.index')->with('success', 'Staff account deleted successfully.');
    }
}
