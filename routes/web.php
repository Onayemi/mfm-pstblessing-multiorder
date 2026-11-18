<?php

use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

// Route::inertia('/', 'welcome')->name('home');
Route::get('/', [HomeController::class, 'home'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/services', [HomeController::class, 'services'])->name('services');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
Route::get('/sitemap.xml', SitemapController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::inertia('dashboard', 'dashboard')->name('dashboard');
    // Admin Dashboard route
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    // Booking routes
    Route::get('/admin/bookings', [BookingController::class, 'index'])->name('booking.index');
    Route::get('/admin/bookings/create', [BookingController::class, 'create'])->name('booking.create');
    Route::post('/admin/bookings', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/admin/bookings/{booking}/edit', [BookingController::class, 'edit'])->name('booking.edit');
    Route::put('/admin/bookings/{booking}', [BookingController::class, 'update'])->name('booking.update');
    Route::delete('/admin/bookings/{booking}', [BookingController::class, 'destroy'])->name('booking.destroy');

    // Staff routes
    Route::get('/admin/staff', [StaffController::class, 'index'])->name('admin.staff.index');
    Route::get('/admin/staff/create', [StaffController::class, 'create'])->name('admin.staff.create');
    Route::post('/admin/staff', [StaffController::class, 'store'])->name('admin.staff.store');
    Route::get('/admin/staff/{staff}/edit', [StaffController::class, 'edit'])->name('admin.staff.edit');
    Route::put('/admin/staff/{staff}', [StaffController::class, 'update'])->name('admin.staff.update');
    Route::delete('/admin/staff/{staff}', [StaffController::class, 'destroy'])->name('admin.staff.destroy');

    // Report routes
    Route::get('/admin/reports', [ReportController::class, 'reportIndex'])->name('reports.index');
    Route::get('/admin/reports/export', [ReportController::class, 'exportCsv'])->name('reports.export');
});

require __DIR__.'/settings.php';
