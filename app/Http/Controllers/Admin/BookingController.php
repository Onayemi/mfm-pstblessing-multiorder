<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Pricing;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookingController extends Controller
{
    private function getPrices()
    {
        // $dbPrices = Pricing::all()->pluck('amount', 'key');
        $dbPrices = Pricing::all()->pluck('price', 'group_type');
        return [
            'groups' => [
                'adult'    => $dbPrices['adult'] ?? 15000,
                'teenage'  => $dbPrices['teenage'] ?? 12000,
                'children' => $dbPrices['children'] ?? 10000,
            ],
            'game' => $dbPrices['game'] ?? 1000,
        ];
    }

    public function index(Request $request){
        $query = Booking::with('admin');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%")
                  ->orWhere('ticket_code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('booked_at', $request->input('date'));
        }

        $bookings = $query->latest('booked_at')->paginate(25)->withQueryString();

        return Inertia::render('admin/Booking/Index', [
            'bookings' => $bookings,
            'metrics' => [
                'total_revenue' => Booking::sum('total_price'),
                'daily_revenue' => Booking::whereDate('booked_at', now()->toDateString())->sum('total_price'),
                'total_tickets' => Booking::count(),
            ],
            'filters' => $request->only(['search', 'date']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/Booking/Create', [
            'pricing' => $this->getPrices(),
        ]);
    }

    public function store2(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'phone_number'  => ['required', 'string', 'max:20'],
            'attendees'     => ['required', 'array', 'min:1'],
            'attendees.*.group' => ['required', 'in:adult,teenage,children'],
            'attendees.*.play_game' => ['required', 'boolean'],
        ]);

        $pricing = $this->getPrices();
        $totalAmount = 0;
        $processedAttendees = [];

        foreach ($validated['attendees'] as $item) {
            $basePrice = $pricing['groups'][$item['group']] ?? 0;
            $gamePrice = $item['play_game'] ? ($pricing['game'] ?? 0) : 0;
            $subtotal = $basePrice + $gamePrice;
            $totalAmount += $subtotal;

            $processedAttendees[] = [
                'group' => ucfirst($item['group']),
                'base_price' => $basePrice,
                'play_game' => $item['play_game'],
                'game_price' => $gamePrice,
                'subtotal' => $subtotal,
            ];
        }

        $booking = Booking::create([
            'ticket_code'   => 'PTB-' . strtoupper(Str::random(8)),
            'customer_name' => $validated['customer_name'],
            'phone_number'  => $validated['phone_number'],
            'attendees'     => $processedAttendees,
            'total_price'   => $totalAmount,
            'booked_at'     => now(),
            'processed_by'  => auth()->id(),
        ]);

        return redirect()->route('booking.index')->with('success', 'Multi-attendee ticket successfully issued: ' . $booking->ticket_code);
    }

    public function store(Request $request)
    {
        // Validate incoming request data from Inertia
        $validated = $request->validate([
            'customer_name'         => ['required', 'string', 'max:255'],
            'phone_number'          => ['nullable', 'string', 'max:20'],
            'attendees'             => ['required', 'array', 'min:1'],
            'attendees.*.group'     => ['required', 'in:adult,teenage,children'],
            'attendees.*.play_game' => ['required', 'boolean'],
        ]);

        $pricing = $this->getPrices();
        $totalAmount = 0;
        $processedAttendees = [];

        foreach ($validated['attendees'] as $item) {
            $basePrice = $pricing['groups'][$item['group']] ?? 0;
            $gamePrice = $item['play_game'] ? ($pricing['game'] ?? 0) : 0;
            $subtotal  = $basePrice + $gamePrice;
            $totalAmount += $subtotal;

            $processedAttendees[] = [
                'group'      => ucfirst($item['group']),
                'base_price' => $basePrice,
                'play_game'  => (bool) $item['play_game'],
                'game_price' => $gamePrice,
                'subtotal'   => $subtotal,
            ];
        }

        // Insert directly into the database table
        Booking::create([
            'ticket_code' => 'FTB-' . str_pad((string) random_int(0, 99999999), 8, '0', STR_PAD_LEFT),
            // 'ticket_code'   => 'PTB-' . strtoupper(Str::random(8)),
            'customer_name' => $validated['customer_name'],
            'phone_number'  => $validated['phone_number'],
            'attendees'     => $processedAttendees, // Automatically cast to JSON by model
            'total_price'   => $totalAmount,
            'booked_at'     => now(),
            'processed_by'  => auth()->id(),
        ]);

        return redirect()->route('booking.index')->with('success', 'Booking and ticket successfully created!');
    }

    public function edit(Booking $booking)
    {
        return Inertia::render('admin/Booking/Edit', [
            'booking' => $booking,
            'pricing' => $this->getPrices(),
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'phone_number'  => ['nullable', 'string', 'max:20'],
            'attendees'     => ['required', 'array', 'min:1'],
            'attendees.*.group' => ['required', 'in:adult,teenage,children'],
            'attendees.*.play_game' => ['required', 'boolean'],
        ]);

        $pricing = $this->getPrices();
        $totalAmount = 0;
        $processedAttendees = [];

        foreach ($validated['attendees'] as $item) {
            $basePrice = $pricing['groups'][$item['group']] ?? 0;
            $gamePrice = $item['play_game'] ? ($pricing['game'] ?? 0) : 0;
            $subtotal = $basePrice + $gamePrice;
            $totalAmount += $subtotal;

            $processedAttendees[] = [
                'group' => ucfirst($item['group']),
                'base_price' => $basePrice,
                'play_game' => $item['play_game'],
                'game_price' => $gamePrice,
                'subtotal' => $subtotal,
            ];
        }

        $booking->update([
            'customer_name' => $validated['customer_name'],
            'phone_number'  => $validated['phone_number'],
            'attendees'     => $processedAttendees,
            'total_price'   => $totalAmount,
        ]);

        return redirect()->route('booking.index')->with('success', 'Booking updated successfully.');
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();
        return redirect()->route('booking.index')->with('success', 'Ticket deleted successfully.');
    }
}
