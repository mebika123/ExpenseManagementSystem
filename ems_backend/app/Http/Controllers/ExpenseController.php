<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseRequest;
use App\Models\Expense;
use App\Services\ExpenseService;
use Exception;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    protected ExpenseService $expense_service;
    public function __construct(ExpenseService $expense_service)
    {
        $this->expense_service = $expense_service;
    }

    public function index()
    {
        // $expenses = Expense::with(['budgetTimeline:id,code', 'latestStatus'])->get();
        $expenses = Expense::with(['budgetTimeline:id,code', 'latestStatus'])
            ->get()
            ->map(function ($expense) {
                $expense->isEditable = $expense->latestStatus?->first()?->status !== 'approved';
                return $expense;
            });
        return response()->json(['expenses' => $expenses]);
    }

    public function store(StoreExpenseRequest $request)
    {
        $files = $request->file('attachments');
        $data = $request->all();
        $data['attachments'] = $files;

        try {
            $expense = $this->expense_service->storeOrUpdateExpense($data);
            return response()->json(['message' => 'Your Expense has been subbmitted successfully!', 'expense' => $expense]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function update($id, StoreExpenseRequest $request)
    {
        $files = $request->file('attachments');
        $data = $request->validate();
        $data['attachments'] = $files;
        try {
            $expense = $this->expense_service->storeOrUpdateExpense($data, $id);
            return response()->json(['message' => 'Your Expense has been updated successfully!', 'expense' => $expense]);
        } catch (Exception $e) {

            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $expense = Expense::with(
            'expense_items',
            'transactionalAttachments',
            'latestStatus'
        )->find($id);
        $expense->isEditable = $expense->latestStatus?->first()?->status !== 'approved';
        return response()->json(['expense' => $expense]);
    }

    public function showItemsDetails($id)
    {
        $expense = Expense::with([
            'expense_items' => function ($query) {
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
        return response()->json(['expense' => $expense]);
    }

    public function deleteExpenseItem(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:expense_items,id',
        ]);
        try {
            $deletExpenseItems = $this->expense_service->bulkDeleteItems($data);
            return response()->json(['message' => 'Selected expense items deleted']);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $deletExpenseItems = $this->expense_service->deleteExpenseWithItems($id);
            return response()->json(['message' => 'Expense deleted with expense items']);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'expense_id' => 'required|integer|exists:expenses,id',
            'status'     => 'required|string',
            'comment'    => 'required|string',
        ]);

        try {
            $updatedStatus = $this->expense_service->updateStatus($validated);
            return response()->json([
                'message' => 'Status is updated',
                'updatedStatus' => $updatedStatus
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
