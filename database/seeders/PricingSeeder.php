<?php
// database/seeders/PricingSeeder.php
namespace Database\Seeders;

use App\Models\Pricing;
use Illuminate\Database\Seeder;

class PricingSeeder extends Seeder {
    public function run(): void {
        $prices = [
            ['group_type' => 'adult', 'price' => 15000.00],
            ['group_type' => 'teenage', 'price' => 12000.00],
            ['group_type' => 'children', 'price' => 10000.00],
            ['group_type' => 'game', 'price' => 1000.00], // Game Pass Add-on Price
        ];

        foreach ($prices as $p) {
            Pricing::updateOrCreate(
                ['group_type' => $p['group_type']],
                ['price' => $p['price']]
            );
        }
    }
}