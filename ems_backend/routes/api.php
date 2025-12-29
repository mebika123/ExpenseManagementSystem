<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExpensePlanController;
use App\Http\Controllers\RoleAndPermissionController;
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

    Route::apiResource('expenses', ExpenseController::class);
    Route::get("expense/{id}", [ExpenseController::class, 'show']);
    Route::get("expense/details/{id}", [ExpenseController::class, 'showItemsDetails']);
    Route::post('deleteExpenseItems', [ExpenseController::class, 'deleteExpenseItem']);
    Route::apiResource('expenses', ExpenseController::class);

    Route::apiResource('expensesPlan', ExpensePlanController::class);
    Route::get("expensePlan/{id}", [ExpensePlanController::class, 'show']);
    Route::get("expensePlan/details/{id}", [ExpensePlanController::class, 'showItemsDetails']);
    Route::post('deleteExpensePlanItems', [ExpensePlanController::class, 'deleteExpenseItem']);



    Route::apiResource('roles', RoleAndPermissionController::class);
    Route::get('permissions', [RoleAndPermissionController::class, 'showAllPermission']);

    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});
Route::post('/login', [AuthController::class, 'login'])->name('login');
