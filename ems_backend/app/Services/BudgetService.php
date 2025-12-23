<?php

namespace App\Services;

use App\Models\Budget;
use App\Models\BudgetTimeline;
use App\Models\Statuses;
use App\Repositories\BudgetRepository;
use App\Repositories\BudgetTimelineRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;

class BudgetService
{
    public function __construct(
        protected BudgetTimelineRepository $budgetTimeline_Repo,
        protected BudgetRepository $budget_Repo,
        private StatusService $status_service
    ) {}

    public function storeOrUpdate($id, array $data)
    {
        
        try {
            DB::transaction(function () use ($data, $id) {
                $user = Auth::user();


                $budgetTimelineData = [
                    'name' => $data['name'],
                    'start_at' => $data['start_at'],
                    'end_at' => $data['end_at']
                ];
                if (!$id) {
                    $titlePrefix = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $data['name']), 0, 2));
                    $startYear = Carbon::parse($data['start_at'])->format('y');
                    $endYear = Carbon::parse($data['end_at'])->format('y');
                    $unique = substr(now()->timestamp, -4);

                    $code = "{$titlePrefix}_BUD_{$startYear}/{$endYear}_{$unique}";
                    $budgetTimelineData['code'] = $code;
                }



                $budgetTimeline = $this->budgetTimeline_Repo->save($id, $budgetTimelineData);
                if (!$id) {
                    $this->status_service->create($budgetTimeline,'pending',$user->id,'Status Created');
                }

                foreach ($data['budget'] as $item) {
                    $budgetId = $item['id'] ?? null;

                    if (!$budgetId) {
                        $item['budget_timeline_id'] = $budgetTimeline->id;
                    }
                    $this->budget_Repo->save($budgetId, $item);
                }
                return  $budgetTimeline;
            });
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Failed to create budget timeline',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function bulkDelete($data)
    {
        try {

            Budget::whereIn('id', $data['ids'])->delete();
            return response()->json([
                'message' => 'Items deleted successfully'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Failed to delete budget',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function updateStatus(BudgetTimeline $budget,string $userId,string $status,?string $comment = null){
        $this->status_service->changeStatus($budget,$status, $userId,$comment);
    }
}
