<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BudgetTimeline>
 */
class BudgetTimelineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
     public function definition(): array
    {
        // $start = Carbon::now()->startOfMonth();
        // $end = $start->copy()->endOfMonth();

        // return [
        //     'name' => $this->faker->sentence(3), 
        //     'start_at' => $start,
        //     'end_at' => $end,
        //     'code' => strtoupper($this->faker->lexify('??')) . '_BUD_' . $start->format('y') . '/' . $end->format('y') . '_' . substr(now()->timestamp, -4),
        // ];
        return [];
    }
}
