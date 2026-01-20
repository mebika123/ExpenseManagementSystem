<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpensePlanRequest;
use App\Models\Expense;
use App\Models\ExpensePlan;
use App\Services\ExpensePlanService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ExpensePlanController extends Controller
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:expense_plan.view|expense_plan.view.all', only: ['index']),
            new Middleware('permission:expense_plan.create', only: ['store']),
            new Middleware('permission:expense_plan.update', only: ['update', 'deleteExpenseItem']),
            new Middleware('permission:expense_plan.show', only: ['show']),
            new Middleware('permission:expense_plan.delete', only: ['destroy']),
            new Middleware('permission:expense_plan.showItemsDetails', only: ['showItemsDetails']),
            new Middleware('permission:expense_plan.status.check|expense_plan.status.approve', only: ['updateStatus']),
        ];
    }
    protected ExpensePlanService $expense_plan_service;
    public function __construct(ExpensePlanService $expense_plan_service)
    {
        $this->expense_plan_service = $expense_plan_service;
    }

    // public function index()
    // {
    //     $expensesPlan = ExpensePlan::with(['budgetTimeline:id,code', 'latestStatus'])->get()
    //     ->map(function ($expensesPlan) {
    //             $expensesPlan->isEditable = $expensesPlan->latestStatus?->first()?->status !== 'approved';
    //             return $expensesPlan;
    //         });
    //     return response()->json(['expensesPlan' => $expensesPlan]);
    // }
    public function index()
    {
        $user = Auth::user();

        if ($user->hasPermissionTo('expense_plan.view.all')) {
            $expensesPlan = ExpensePlan::with(['budgetTimeline:id,code', 'latestStatus'])->get()
                ->map(function ($expensesPlan) {
                    $expensesPlan->isEditable = $expensesPlan->latestStatus?->first()?->status !== 'approved';
                    return $expensesPlan;
                });
        } else {
            $expensesPlan = ExpensePlan::with(['budgetTimeline:id,code', 'latestStatus'])
                ->where('user_id', $user->id)
                ->get()
                ->map(function ($expensesPlan) {
                    $expensesPlan->isEditable = $expensesPlan->latestStatus?->first()?->status !== 'approved';
                    return $expensesPlan;
                });
        }

        return response()->json(['expensesPlan' => $expensesPlan]);
    }

    public function store(StoreExpensePlanRequest $request)
    {
        $files = $request->file('attachments');
        $data = $request->validated();
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
        $user = Auth::user();

        $files = $request->file('attachments');
        $data = $request->validated();
        $data['attachments'] = $files;
        try {
            $expense = Expense::findOrFail($id);

            if ($expense->created_by_id !== $user->id) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
            $updatedExpense = $this->expense_plan_service->storeOrUpdateExpensePlan($data, $id);
            return response()->json(['message' => 'Your Expense Plan has been updated successfully!', 'expense' => $updatedExpense]);
        } catch (Exception $e) {

            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $expensePlan = ExpensePlan::with('expense_plan_items', 'transactionalAttachments')->find($id);
        $expensePlan->isEditable = $expensePlan->latestStatus?->first()?->status !== 'approved';

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
            'transactionalAttachments',
            'latestStatus'
        ])->find($id);
        $expenseGenerated = Expense::where('expense_plan_id', $id)->exists();

        return response()->json([
            'expensePlan' => $expensePlan,
            'expense_generated' => $expenseGenerated
        ]);
    }

    public function deleteExpenseItem(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:expense_plan_items,id',
        ]);

        try {
            $deletExpenseItems = $this->expense_plan_service->bulkDeleteItems($data);
            return response()->json(['message' => 'Selected expense plan items deleted', 'data' => $deletExpenseItems]);
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
            $q->where('paid_by_id', $request->contact_id);
        })
            ->whereHas('statuses', function ($q) {
                $q->latest()->where('status', 'approved');
            })
            ->whereDoesntHave('expenses')
            ->withSum(['expense_plan_items as total_amount' => function ($q) use ($request) {
                $q->where('paid_by_id', $request->contact_id);
            }], 'amount')
            ->get(['id', 'name']);

        return response()->json($plans);
    }

    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'expense_plan_id' => 'required|integer|exists:expense_plans,id',
            'status'     => 'required|string',
            'comment'    => 'required|string',
        ]);

        try {
            $updatedStatus = $this->expense_plan_service->updateStatus($validated);
            return response()->json([
                'message' => 'Status is updated',
                'updatedStatus' => $updatedStatus
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
