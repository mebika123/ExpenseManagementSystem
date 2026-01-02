<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpensePlanRequest;
use App\Models\ExpensePlan;
use App\Services\ExpensePlanService;
use Exception;
use Illuminate\Http\Request;

class ExpensePlanController extends Controller
{
    protected ExpensePlanService $expense_plan_service;
    public function __construct(ExpensePlanService $expense_plan_service)
    {
        $this->expense_plan_service = $expense_plan_service;
    }

    public function index()
    {
        $expensesPlan = ExpensePlan::with(['budgetTimeline:id,code', 'latestStatus'])->get();
        return response()->json(['expensesPlan' => $expensesPlan]);
    }

    public function store(StoreExpensePlanRequest $request)
    {
        $files = $request->file('attachments');
        $data = $request->all();
        $data['attachments'] = $files;

        try {
            $expense = $this->expense_plan_service->storeOrUpdateExpensePlan($data);
            return response()->json(['message' => 'Your Expense has been subbmitted successfully!', 'expense' => $expense]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function update($id, StoreExpensePlanRequest $request)
    {
        $files = $request->file('attachments');
        $data = $request->all();
        $data['attachments'] = $files;
        try {
            $expense = $this->expense_plan_service->storeOrUpdateExpensePlan($data, $id);
            return response()->json(['message' => 'Your Expense Plan has been updated successfully!', 'expense' => $expense]);
        } catch (Exception $e) {

            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $expensePlan = ExpensePlan::with('expense_plan_items', 'transactionalAttachments')->find($id);
        return response()->json(['expense' => $expensePlan]);
    }

    public function showItemsDetails($id)
    {
        $expensePlan = ExpensePlan::with([
            'expense_plan_items' => function ($query) {
                $query->with([
                    'department:id,code',
                    'location:id,code',
                    'expense_categories:id,code',
                    'budget:id,title',
                    'contact:id,code',
                    'paidBy:id,code'
                ]);
            },
            'budgetTimeline:id,code',
            'transactionalAttachments'
        ])->find($id);
        return response()->json(['expensePlan' => $expensePlan]);
    }

    public function deleteExpenseItem(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:expense_plan_items,id',
        ]);
        try {
            $deletExpenseItems = $this->expense_plan_service->bulkDeleteItems($data);
            return response()->json(['message' => 'Selected expense plan items deleted']);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $deletExpenseItems = $this->expense_plan_service->deleteExpensePlanWithItems($id);
            return response()->json(['message' => 'Expense plan deleted with expense items']);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function plansWithTotals(Request $request)
    {
        $request->validate([
            'contact_id' => 'required|exists:contacts,id',
        ]);

        $plans = ExpensePlan::whereHas('expense_plan_items', function ($q) use ($request) {
            $q->where('paid_by_id', $request->contact_id);        })
            ->withSum(['expense_plan_items as total_amount' => function ($q) use ($request) {
                $q->where('paid_by_id', $request->contact_id);}], 'amount')
            ->get(['id', 'name']);

        return response()->json($plans);
    }


}
