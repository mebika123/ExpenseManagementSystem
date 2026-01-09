<?php

namespace Tests\Feature;

use App\Models\Budget;
use App\Models\BudgetTimeline;
use App\Models\Department;
use App\Models\Location;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BudgetUpdateTest extends TestCase
{
    use RefreshDatabase;

    private function createBudgetTimelineWithBudget($budgetData = [])
    {
        $department = Department::create([
            'name' => 'Finance',
            'code' => 'DEPT_FIN001'
        ]);

        $location = Location::create([
            'name' => 'Main Location',
            'code' => 'LOC001'
        ]);

        $budgetTimeline = BudgetTimeline::factory()->create([
            'name' => 'Old Budget',
            'start_at' => '2024-01-01',
            'end_at' => '2024-12-31',
            'code' => 'ODB_BUD_2024/24'
        ]);

        $budget = Budget::factory()->create(array_merge([
            'budget_timeline_id' => $budgetTimeline->id,
            'title' => 'Default Budget',
            'department_id' => $department->id,
            'location_id' => $location->id,
            'amount' => 1000,
        ], $budgetData));

        return [$budgetTimeline, $budget, $department, $location];
    }

    public function test_budget_timeline_can_be_updated()
    {
        $user = User::factory()->create();
        [$timeline, $budget, , ] = $this->createBudgetTimelineWithBudget();

        $payload = [
            'name' => 'Updated Budget',
            'start_at' => '2025-01-01',
            'end_at' => '2025-12-31',
            'budget' => [
                [
                    'id' => $budget->id,
                    'title' => $budget->title,
                    'department_id' => $budget->department_id,
                    'location_id' => $budget->location_id,
                    'amount' => 2000,
                ]
            ]
        ];

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/budgetTimelines/{$timeline->id}", $payload);

        if ($response->status() !== 200) {
            dd($response->json());
        }

        $response->assertStatus(200)
            ->assertJsonFragment([
                'message' => 'Budget Timeline is updated',
            ]);

        $this->assertDatabaseHas('budget_timelines', [
            'id' => $timeline->id,
            'name' => 'Updated Budget',
        ]);

        $this->assertDatabaseHas('budgets', [
            'id' => $budget->id,
            'amount' => 2000,
        ]);
    }

    public function test_update_fails_for_invalid_budget_id()
    {
        $user = User::factory()->create();
        [$timeline, , , ] = $this->createBudgetTimelineWithBudget();

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/budgetTimelines/9999", [
                'name' => 'Invalid',
                'start_at' => '2025-01-01',
                'end_at' => '2025-12-31',
                'budget' => []
            ]);

        $response->assertStatus(400);
    }

    public function test_budget_update_fails_with_invalid_data()
    {
        $user = User::factory()->create();
        [$timeline, , , ] = $this->createBudgetTimelineWithBudget();

        $payload = [
            'name' => '',
            'start_at' => '',
            'end_at' => '',
            'budget' => [
                [
                    'title' => '',
                    'amount' => '',
                    'department_id' => '',
                    'location_id' => ''
                ]
            ]
        ];

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/budgetTimelines/{$timeline->id}", $payload);

        print_r($response->json()); 

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'start_at',
                'end_at',
                'budget.0.title',
                'budget.0.amount',
                'budget.0.department_id',
                'budget.0.location_id'
            ]);
    }

    public function test_transaction_rolls_back_on_budget_error()
    {
        $user = User::factory()->create();
        [$timeline, , , ] = $this->createBudgetTimelineWithBudget();

        $payload = [
            'name' => 'Rollback Test',
            'start_at' => '2025-01-01',
            'end_at' => '2025-12-31',
            'budget' => [
                [
                    'id' => 99999, 
                    'title' => 'Invalid Budget',
                    'amount' => 5000,
                    'department_id' => 1,
                    'location_id' => 1
                ]
            ]
        ];

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/budgetTimelines/{$timeline->id}", $payload)
            ->assertStatus(422);

        $this->assertDatabaseMissing('budget_timelines', [
            'name' => 'Rollback Test',
        ]);
    }
}
