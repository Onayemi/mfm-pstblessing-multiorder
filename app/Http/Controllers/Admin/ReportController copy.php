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
    
    private function applyFilters(Request $request)
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

        if ($request->filled('group_type')) {
            $query->where('group_type', $request->input('group_type'));
        }

        if ($request->filled('start_date')) {
            $query->whereDate('booked_at', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('booked_at', '<=', $request->input('end_date'));
        }

        return $query;
    }

    public function reportIndex(Request $request)
    {
        // Allow superadmin, admin, and manager to view the list
        // $this->authorizeRole('superadmin', 'admin', 'manager');
        
        $query = $this->applyFilters($request);
        $bookings = $query->latest('booked_at')->paginate(15)->withQueryString();

        // Calculate Totals & Summary Metrics for filtered view
        $allFiltered = (clone $query)->get();
        $summary = [
            'total_revenue' => $allFiltered->sum('total_price'),
            'total_count'   => $allFiltered->count(),
            'adult_count'     => $allFiltered->where('group_type', 'adult')->count(),
            'teenage_count'   => $allFiltered->where('group_type', 'teenage')->count(),
            'children_count'  => $allFiltered->where('group_type', 'children')->count(),
            'game_count'      => $allFiltered->where('play_game', true)->count(),
        ];

        return Inertia::render('admin/Report/Index', [
            'bookings' => $bookings,
            'summary'  => $summary,
            'filters'  => $request->only(['search', 'group_type', 'start_date', 'end_date']),
        ]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $bookings = $this->applyFilters($request)->latest('booked_at')->get();

        // Calculate summations for summary report rows in CSV
        $totalRevenue = $bookings->sum('total_price');
        $totalCount   = $bookings->count();
        $adultCount   = $bookings->where('group_type', 'adult')->count();
        $teenageCount = $bookings->where('group_type', 'teenage')->count();
        $childrenCount= $bookings->where('group_type', 'children')->count();
        $gameCount    = $bookings->where('play_game', true)->count();

        $fileName = 'xmas-sales-report-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($bookings, $totalRevenue, $totalCount, $adultCount, $teenageCount, $childrenCount, $gameCount) {
            $file = fopen('php://output', 'w');

            // SECTION 1: Summary KPI Metrics Header
            fputcsv($file, ['=== MFM PASTOR BLESSING SALES & REPORT SUMMARY ===']);
            fputcsv($file, ['Metric Description', 'Value']);
            fputcsv($file, ['Total Booking Revenue (₦)', $totalRevenue]);
            fputcsv($file, ['Total Tickets Count', $totalCount]);
            fputcsv($file, ['Number of Adults', $adultCount]);
            fputcsv($file, ['Number of Teenagers', $teenageCount]);
            fputcsv($file, ['Number of Children', $childrenCount]);
            fputcsv($file, ['Total Game Passes Sold', $gameCount]);
            fputcsv($file, []); // Empty row separator

            // SECTION 2: Detailed Transaction Records
            fputcsv($file, ['=== DETAILED TICKET TRANSACTIONS ===']);
            fputcsv($file, ['Ticket Code', 'Customer Name', 'Phone Number', 'Group Type', 'Base Price (₦)', 'Game Pass', 'Game Price (₦)', 'Total Price (₦)', 'Booked Date', 'Processed By']);

            foreach ($bookings as $b) {
                fputcsv($file, [
                    $b->ticket_code,
                    $b->customer_name,
                    $b->phone_number,
                    ucfirst($b->group_type),
                    $b->base_price,
                    $b->play_game ? 'Yes' : 'No',
                    $b->game_price,
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
