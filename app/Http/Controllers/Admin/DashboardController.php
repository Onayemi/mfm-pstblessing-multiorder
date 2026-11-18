<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $allBookings = Booking::all();

        // KPI Metrics
        $totalRevenue = $allBookings->sum('total_price');
        $dailyRevenue = $allBookings->filter(fn($b) => $b->booked_at->isToday())->sum('total_price');
        $totalTickets = $allBookings->count();

        // Aggregate stats from the JSON attendees column
        $adultCount = 0;
        $teenageCount = 0;
        $childrenCount = 0;
        $gamePassCount = 0;

        foreach ($allBookings as $booking) {
            $attendees = $booking->attendees ?? [];
            foreach ($attendees as $att) {
                $group = strtolower($att['group'] ?? '');
                if ($group === 'adult') $adultCount++;
                if ($group === 'teenage') $teenageCount++;
                if ($group === 'children') $childrenCount++;
                if (!empty($att['play_game'])) $gamePassCount++;
            }
        }

        // 7-Day Revenue Trend for Line Chart
        $revenueTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $sum = $allBookings->filter(fn($b) => $b->booked_at->isSameDay($date))->sum('total_price');
            $revenueTrend[] = [
                'date' => $date->format('M j'),
                'revenue' => (float) $sum,
            ];
        }

        // Recent Bookings
        $recentBookings = Booking::with('admin')
            ->latest('booked_at')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'daily_revenue' => $dailyRevenue,
                'total_tickets' => $totalTickets,
                'adult_count' => $adultCount,
                'teenage_count' => $teenageCount,
                'children_count' => $childrenCount,
                'game_pass_count' => $gamePassCount,
            ],
            'revenueTrend' => $revenueTrend,
            'recentBookings' => $recentBookings,
        ]);
    }
}
