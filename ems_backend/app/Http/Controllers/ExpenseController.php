<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseRequest;
use App\Models\Expense;
use App\Services\ExpenseService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ExpenseController extends Controller
{
    protected ExpenseService $expense_service;
    public function __construct(ExpenseService $expense_service)
    {
        $this->expense_service = $expense_service;
    }
    public static function middleware(): array
    {
        return [
            new Middleware('permission:expense.view|expense.view.all', only: ['index']),
            new Middleware('permission:expense.create', only: ['store']),
            new Middleware('permission:expense.update', only: ['update', 'deleteExpenseItem']),
            new Middleware('permission:expense.show', only: ['show']),
            new Middleware('permission:expense.delete', only: ['destroy']),
            new Middleware('permission:expense.showItemsDetails', only: ['showItemsDetails']),
            new Middleware('permission:expense.status.check|expense.status.approve', only: ['updateStatus']),
        ];
    }


    public function index()
    {
        $user = Auth::user();

        if ($user->hasPermissionTo('expense.view.all')) {
            $expenses = Expense::orderBy('created_at', 'desc')->with(['budgetTimeline:id,code', 'latestStatus', 'createdBy:id,email'])->get()
                ->map(function ($expense) {
                    $expense->isEditable = $expense->latestStatus?->first()?->status !== 'approved';
                    return $expense;
                });
        } else {
            $expenses = Expense::orderBy('created_at', 'desc')->with(['budgetTimeline', 'latestStatus', 'createdBy:id,email'])
                ->where('created_by_id', $user->id)
                ->get()
                ->map(function ($expense) {
                    $expense->isEditable = $expense->latestStatus?->first()?->status !== 'approved';
                    return $expense;
                });
        }

        return response()->json(['expenses' => $expenses]);
    }


    // public function index()
    // {
    //     $user = Auth::user();


    //     $expenses = Expense::orderBy('created_at', 'desc')
    //         ->with(
    //         'budgetTimeline:id,code',
    //         'latestStatus',
    //         'createdBy:id,code'
    //     )->get()
    //         ->map(function ($expenses) {
    //             $expenses->isEditable = $expenses->latestStatus?->first()?->status !== 'approved';
    //             return $expenses;
    //         });

    //     return response()->json(['expenses' => $expenses]);
    // }



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

    // public function update($id, StoreExpenseRequest $request)
    // {
    //     $files = $request->file('attachments');
    //     $data = $request->validated();
    //     $data['attachments'] = $files;

    //     try {
    //         $expense = $this->expense_service->storeOrUpdateExpense($data, $id);
    //         return response()->json([
    //             'message' => 'Your Expense has been updated successfully!',
    //             'expense' => $expense->load('expense_items', 'transactionalAttachments')
    //         ], 200);
    //     } catch (Exception $e) {

    //         return response()->json(['message' => $e->getMessage()]);
    //     }
    // }
    public function update($id, StoreExpenseRequest $request)
    {
        $files = $request->file('attachments');
        $data = $request->validated();
        $data['attachments'] = $files;

        try {
            $expense = $this->expense_service->storeOrUpdateExpense($data, $id);

            return response()->json([
                'message' => 'Your Expense has been updated successfully!',
                'expense' => $expense->load('expense_items', 'transactionalAttachments')
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            log::error($e);
            return response()->json([
                'message' => 'Error updating expense: ' . $e->getMessage()
            ], 500);
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
