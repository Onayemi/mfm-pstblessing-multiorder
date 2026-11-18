<?php

namespace App\Http\Controllers\Admin;

// use App\Concerns\AuthorizesRoles;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;


class ReportController extends Controller
{
    // use AuthorizesRoles;
    
    private function applyReportFilters(Request $request)
    {
        $query = Booking::with('admin');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%")
                  ->orWhere('ticket_code', 'like', "%{$search}%");
            });
        }

        // Filter bookings containing at least one attendee of the selected group_type
        if ($request->filled('group_type')) {
            $group = ucfirst(strtolower($request->input('group_type')));
            $query->whereJsonContains('attendees', [['group' => $group]]);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('booked_at', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('booked_at', '<=', $request->input('end_date'));
        }

        return $query;
    }

    private function calculateMetrics($bookingsCollection): array
    {
        $totalRevenue  = $bookingsCollection->sum('total_price');
        $totalBookings = $bookingsCollection->count();
        $totalHeadcount = 0;
        $adultCount    = 0;
        $teenageCount  = 0;
        $childrenCount = 0;
        $gameCount     = 0;

        foreach ($bookingsCollection as $booking) {
            $attendees = $booking->attendees ?? [];
            foreach ($attendees as $att) {
                $totalHeadcount++;
                $group = strtolower($att['group'] ?? '');
                if ($group === 'adult') $adultCount++;
                if ($group === 'teenage') $teenageCount++;
                if ($group === 'children') $childrenCount++;
                if (!empty($att['play_game'])) $gameCount++;
            }
        }

        return [
            'total_revenue'   => $totalRevenue,
            'total_bookings'  => $totalBookings,
            'total_headcount' => $totalHeadcount,
            'adult_count'     => $adultCount,
            'teenage_count'   => $teenageCount,
            'children_count'  => $childrenCount,
            'game_count'      => $gameCount,
        ];
    }

    public function reportIndex(Request $request)
    {
        $query = $this->applyReportFilters($request);
        $bookings = (clone $query)->latest('booked_at')->paginate(25)->withQueryString();
        $summary = $this->calculateMetrics($query->get());

        return Inertia::render('admin/Report/Index', [
            'bookings' => $bookings,
            'summary'  => $summary,
            'filters'  => $request->only(['search', 'group_type', 'start_date', 'end_date']),
        ]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $bookings = $this->applyReportFilters($request)->latest('booked_at')->get();
        $summary  = $this->calculateMetrics($bookings);

        $fileName = 'ptb-sales-report-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($bookings, $summary) {
            $file = fopen('php://output', 'w');

            // SECTION 1: Summary KPI Metrics Header
            fputcsv($file, ['=== PASTOR BLESSING SALES & REPORT SUMMARY ===']);
            fputcsv($file, ['Metric Description', 'Value']);
            fputcsv($file, ['Total Booking Revenue (NGN)', $summary['total_revenue']]);
            fputcsv($file, ['Total Group Transactions', $summary['total_bookings']]);
            fputcsv($file, ['Total Individual Attendees', $summary['total_headcount']]);
            fputcsv($file, ['Number of Adults', $summary['adult_count']]);
            fputcsv($file, ['Number of Teenagers', $summary['teenage_count']]);
            fputcsv($file, ['Number of Children', $summary['children_count']]);
            fputcsv($file, ['Total Game Passes Sold', $summary['game_count']]);
            fputcsv($file, []); // Empty separator row

            // SECTION 2: Detailed Transaction Records
            fputcsv($file, ['=== DETAILED GROUP BOOKING TRANSACTIONS ===']);
            fputcsv($file, [
                'Ticket Code',
                'Group Lead Name',
                'Phone Number',
                'Total Attendees',
                'Attendee Breakdown',
                'Game Passes Count',
                'Total Paid (NGN)',
                'Booked Date',
                'Processed By',
            ]);

            foreach ($bookings as $b) {
                $attendees = $b->attendees ?? [];
                $breakdownParts = [];
                $gamesInBooking = 0;

                foreach ($attendees as $att) {
                    $hasGame = !empty($att['play_game']);
                    if ($hasGame) $gamesInBooking++;
                    $breakdownParts[] = ($att['group'] ?? 'Unknown') . ($hasGame ? ' (+Game)' : '');
                }

                fputcsv($file, [
                    $b->ticket_code,
                    $b->customer_name,
                    $b->phone_number,
                    count($attendees),
                    implode(', ', $breakdownParts),
                    $gamesInBooking,
                    $b->total_price,
                    $b->booked_at->format('Y-m-d H:i:s'),
                    $b->admin->name ?? 'System',
                ]);
            }

            fclose($file);
        }, $fileName, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }
}
