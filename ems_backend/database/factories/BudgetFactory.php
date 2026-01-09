<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Budget>
 */
class BudgetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
       return [];
    //    return [
    //         'title' => $this->faker->sentence(3),
    //         'amount' => $this->faker->numberBetween(1000, 10000),
    //         'department_id' => Department::factory(), // create a valid department
    //         'location_id' => Location::factory(),     // create a valid location
    //         'budget_timeline_id' => null, // set later when attaching to a BudgetTimeline
    //     ];
    }
}
