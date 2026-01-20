<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBudgetingRequest;
use App\Models\Budget;
use App\Models\BudgetTimeline;
use Illuminate\Http\Request;
use App\Services\BudgetService;
use Exception;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Log;

class BudgetController extends Controller
{
    protected BudgetService $budget_service;

    public function __construct(BudgetService $budget_service)
    {

        $this->budget_service = $budget_service;
    }
    public static function middleware(): array
    {
        return [
            new Middleware('permission:budgetTimeline.view', only: ['index']),
            new Middleware('permission:budgetTimeline.create', only: ['store']),
            new Middleware('permission:budgetTimeline.update', only: ['update']),
            new Middleware('permission:budgetTimeline.show', only: ['show']),
            new Middleware('permission:budgetTimeline.delete', only: ['destroy']),
            new Middleware('permission:budgetTimeline.delete.budgets', only: ['deleteBudgets']), //check at onces both buget and udate 
            new Middleware('permission:budgetTimeline.status.check|budgetTimeline.status.approve', only: ['updateStatus']),
        ];
    }

    public function index()
    {
        // dd('test');
        $budgetTimelines = BudgetTimeline::with(
            'budget',
            'latestStatus'
        )->get()
            ->map(function ($budgetTimelines) {
                $budgetTimelines->isEditable = $budgetTimelines->latestStatus?->first()?->status !== 'approved';
                return $budgetTimelines;
            });
        return response()->json(['budgetTimelines' => $budgetTimelines]);
    }
 

    public function show($id)
    {
        $budgetTimeline = BudgetTimeline::with(
            'budget',
            'latestStatus'
        )->find($id);
        $budgetTimeline->isEditable = $budgetTimeline->latestStatus?->first()?->status !== 'approved';

        return response()->json(['budgetTimeline' => $budgetTimeline]);
    }

    public function store(StoreBudgetingRequest $request)
    {
        try {
            $budgetTimeline = $this->budget_service->storeOrUpdate($id = null, $request->validated());
            return response()->json([
                'message' => 'Budget Timeline is created',
                'budget' => $budgetTimeline
            ], 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function update(StoreBudgetingRequest $request, $id)
    {

        $validated = $request->validated();

        try {
            $budgetTimeline = $this->budget_service->storeOrUpdate($id, $validated);
            return response()->json(['message' => 'Budget Timeline is updated', 'budget' => $budgetTimeline]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    public function destroy($id)
    {
        try {
            $this->budget_service->destory($id);
            return response()->json([
                'message' => 'Budget Timeline is deleted'
            ], 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'budgetTimeline_id' => 'required|integer|exists:budget_timelines,id',
            'status'     => 'required|string',
            'comment'    => 'required|string',
        ]);

        try {
            $updatedStatus = $this->budget_service->updateStatus($validated);
            return response()->json([
                'message' => 'Status is updated',
                'updatedStatus' => $updatedStatus
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
    public function deleteBudgets(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:budgets,id',
        ]);
        $deletbudgets = $this->budget_service->bulkDelete($data);
        return response()->json(['message' => 'Selected budget deleted', 'budget' => $deletbudgets]);
    }

    public function show_budgetTimeline_budgets($id)
    {
        $budgets = Budget::where('budget_timeline_id', $id)->get();
        return response()->json(['budgets' => $budgets]);
    }
}
