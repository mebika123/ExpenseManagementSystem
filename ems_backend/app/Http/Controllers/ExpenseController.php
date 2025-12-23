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
        // dd('test');
        // $expenses = Expense::with('expense_items')->get();
        // $expenses = Expense::with('statuses')->get();
        $expenses = Expense::with(['budgetTimeline:id,code', 'latestStatus'])->get();
        return response()->json(['expenses' => $expenses]);
    }

    public function store(StoreExpenseRequest $request)
    {
        try {
            $expense = $this->expense_service->storeOrUpdateExpense($request->all());
            return response()->json(['message' => 'Your Expense has been subbmitted successfully!', 'expense' => $expense]);
        }  catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()],400);
            
        }
    }
    public function update($id,StoreExpenseRequest $request)
    {
        try {
            $expense = $this->expense_service->storeOrUpdateExpense($request->all(),$id);
            return response()->json(['message' => 'Your Expense has been updated successfully!', 'expense' => $expense]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
            
        }
    }

    public function show($id)
    {
        $expense = Expense::with('expense_items')->find($id);
        return response()->json(['expense' => $expense]);
    }
}
