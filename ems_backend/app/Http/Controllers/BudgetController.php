<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBudgetingRequest;
use App\Models\Budget;
use App\Models\BudgetTimeline;
use Illuminate\Http\Request;
use App\Services\BudgetService;
use Exception;

class BudgetController extends Controller
{
    protected BudgetService $budget_service;

    public function __construct(BudgetService $budget_service)
    {
        $this->budget_service = $budget_service;
    }

    public function index()
    {
        // dd('test');
        $budgets = BudgetTimeline::with('budget')->get();
        return response()->json(['budgets' => $budgets]);
    }

    public function show($id)
    {
        $budgetTimeline = BudgetTimeline::with('budget')->find($id);
        return response()->json(['budgetTimeline' => $budgetTimeline]);
    }

    public function store(StoreBudgetingRequest $request)
    {
        //  $user = auth()->user(); 
        // $budgetTimeline = $this->budget_service->storeOrUpdate(null,$request->all());
        // return response()->json(['message' => 'Budget Timeline is created', 'budget' => $budgetTimeline]);

        try {
            $budgetTimeline = $this->budget_service->storeOrUpdate($id = null, $request->all());
            return response()->json([
                'message' => 'Budget Timeline is created',
                'budget' => $budgetTimeline
            ], 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function update($id, StoreBudgetingRequest $request)
    {
        $budgetTimeline = $this->budget_service->storeOrUpdate($id, $request->all());
        return response()->json(['message' => 'Budget Timeline is updated', 'budget' => $budgetTimeline]);
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


}
