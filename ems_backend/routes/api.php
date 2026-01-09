<?php

use App\Http\Controllers\AdvanceController;
use App\Http\Controllers\AdvanceSettlementController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExpensePlanController;
use App\Http\Controllers\ReimbursementController;
use App\Http\Controllers\RoleAndPermissionController;
use App\Http\Controllers\TransactionaLogController;
use App\Models\Expense;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/authuser', [UserController::class, 'getAuthUser'])->name('authuser');

    Route::apiResource('users', UserController::class);
    Route::get('user/{id}', [UserController::class, 'show']);

    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('locations', LocationController::class);
    Route::apiResource('expenseCategories', ExpenseCategoryController::class);
    Route::apiResource('contacts', ContactController::class);
    Route::get('employee', [ContactController::class, 'showAllEmployee']);


    Route::apiResource('budgetTimelines', BudgetController::class);
    Route::get('budgetTimelines/{id}', [BudgetController::class, 'show']);
    Route::post('deleteBudgets', [BudgetController::class, 'deleteBudgets']);
    Route::get('{id}/budgets', [BudgetController::class, 'show_budgetTimeline_budgets']);
    Route::post('/budgetTimline/updatedStatus', [BudgetController::class, 'updateStatus']);

    Route::apiResource('expenses', ExpenseController::class);
    Route::get("expense/{id}", [ExpenseController::class, 'show']);
    Route::get("expense/details/{id}", [ExpenseController::class, 'showItemsDetails']);
    Route::post('deleteExpenseItems', [ExpenseController::class, 'deleteExpenseItem']);
    Route::apiResource('expenses', ExpenseController::class);
    Route::post('/expense/updatedStatus', [ExpenseController::class, 'updateStatus']);
    
    Route::post('/expense-plan/expense/{id}', [ExpenseController::class, 'createFromPlan']);
    
    Route::apiResource('expensesPlan', ExpensePlanController::class);
    Route::get("expensePlan/{id}", [ExpensePlanController::class, 'show']);
    Route::post('deleteExpensePlanItems', [ExpensePlanController::class, 'deleteExpenseItem']);
    Route::get("expensePlan/details/{id}", [ExpensePlanController::class, 'showItemsDetails']);
    Route::post('/expense-plan/updatedStatus', [ExpensePlanController::class, 'updateStatus']);
    
    Route::get('/expense-plans/with-totals', [ExpensePlanController::class, 'plansWithTotals']);
    
    Route::apiResource('advances', AdvanceController::class);
    Route::post('/advance/updatedStatus', [AdvanceController::class, 'updateStatus']);
    
    // Route::apiResource('transactions',TransactionaLogController::class);
    Route::get('transactions/unsettled',[TransactionaLogController::class,'showUnsettledTransaction']);
    Route::get('transactions',[TransactionaLogController::class,'index']);
    Route::post('/transaction/settle',[TransactionaLogController::class,'transactional_settlement']);
    
    Route::get('advanceSettlements',[AdvanceSettlementController::class,'index']);
    Route::get('advanceSettlements/unsettled',[AdvanceSettlementController::class,'showUnsettled']);
    Route::post('advanceSettlements/update',[AdvanceSettlementController::class,'update']);
    
    Route::get('reimbursements',[ReimbursementController::class,'index']);
    Route::get('reimbursements/unsettled',[ReimbursementController::class,'showUnsettled']);
    Route::post('reimbursement/update',[ReimbursementController::class,'update']);

    Route::apiResource('roles', RoleAndPermissionController::class);
    Route::get('permissions', [RoleAndPermissionController::class, 'showAllPermission']);

    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});
Route::post('/login', [AuthController::class, 'login'])->name('login');
