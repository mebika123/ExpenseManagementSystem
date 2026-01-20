<?php

namespace App\Http\Controllers;

use App\Models\Advance;
use App\Models\AdvanceSettlement;
use App\Models\BudgetTimeline;
use App\Models\Expense;
use App\Models\ExpenseItem;
use App\Models\ExpensePlan;
use App\Models\Reimbursement;
use App\Models\TransactionalLog;
use Carbon\Carbon;
use Exception;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:dashboard.view|dashboard.view.all', only: ['index']),
        ];
    }
    // public function index()
    // {
    //     $user = Auth::user();

    //     try {
    //         $canViewAll = $user->hasPermissionTo('dashboard.view.all');
    //         $canViewBudget = $user->hasPermissionTo('budgetTimeline.view');

    //         $expenseTra = TransactionalLog::when(!$canViewAll, fn($q) => $q->where('contact_id', $user->contact_id))
    //             ->select('model_type', DB::raw('SUM(amount) as total_amount'))
    //             ->groupBy('model_type')
    //             ->get()
    //             ->map(fn($item) => [
    //                 'type' => match ($item->model_type) {
    //                     ExpenseItem::class => 'Expense',
    //                     Advance::class => 'Advance',
    //                     AdvanceSettlement::class => 'Advance Settlement',
    //                     Reimbursement::class => 'Reimbursement',
    //                     default => 'Other',
    //                 },
    //                 'total_amount' => $item->total_amount
    //             ]);

    //         $expenses = Expense::with(['expense_items', 'latestStatus'])->get()
    //             ->map(function ($expense) use ($user, $canViewAll) {
    //                 if ($canViewAll) return $expense;

    //                 $expense->expense_items = $expense->expense_items
    //                     ->filter(fn($item) => $item->paid_by_id === $user->contact_id);

    //                 return $expense;
    //             });

    //         $barData = $expenses
    //             ->groupBy(fn($expense) => $expense->created_at->format('m'))
    //             ->map(fn($monthExpenses) => [
    //                 'month' => $monthExpenses->first()->created_at->format('F'),
    //                 'total' => $monthExpenses->sum(
    //                     fn($expense) => $expense->expense_items->sum('amount')
    //                 ),
    //             ])
    //             ->values();

    //         if ($canViewBudget) {

    //             $doughnut = BudgetTimeline::with(['budget', 'latestStatus'])
    //                 ->whereHas('latestStatus', fn($q) => $q->where('status', 'approved'))
    //                 ->where('end_at', '>', Carbon::now())
    //                 ->get()
    //                 ->map(fn($timeline) => [
    //                     'label' => $timeline->code,
    //                     'value' => $timeline->budget->sum('amount'),
    //                 ])
    //                 ->filter(fn($row) => $row['value'] > 0)
    //                 ->values();
    //         } else {
    //             $statusTotals = [
    //                 'pending' => 0,
    //                 'checked' => 0,
    //                 'approved' => 0,
    //             ];

    //             foreach ($expenses as $expense) {
    //                 $status = $expense->latestStatus[0]?->status;
    //                 if (!$status) continue;

    //                 $statusTotals[$status] += $expense->expense_items->sum('amount');
    //             }

    //             $doughnut = [
    //                 ['label' => 'Pending', 'value' => $statusTotals['pending']],
    //                 ['label' => 'Checked', 'value' => $statusTotals['checked']],
    //                 ['label' => 'Approved', 'value' => $statusTotals['approved']],
    //             ];
    //         }

    //         $expensestblQuery = Expense::with('budgetTimeline:id,code', 'createdBy:id,code', 'latestStatus')
    //             ->orderBy('created_at', 'desc');

    //         if (!$canViewAll) {
    //             $expensestblQuery->whereHas('expense_items', fn($q) => $q->where('paid_by_id', $user->contact_id));
    //         }

    //         $expensestbl = $expensestblQuery->limit(3)->get();
    //         return response()->json([
    //             // 'cards' => [
    //             //     'expenseTransactions' => $expenseTransactions,
    //             //     'advanceTransaction' => $advanceTransaction,
    //             //     'advanceSettleTransaction' => $advanceSettleTransaction,
    //             //     'reimbursementTransaction' => $reimbursementTransaction,
    //             //     'expenseTra' => $expenseTra
    //             // ],
    //             'cards' => $expenseTra,
    //             'bar' => $barData,
    //             'doughnut' => $doughnut,
    //             'expensestbl' => $expensestbl
    //         ]);
    //     } catch (Exception $e) {
    //         return response()->json(['message' => $e->getMessage()], 400);
    //     }
    // }

    public function getExpenseTra()
    {
        $user = Auth::user();
        $canViewAll = $user->hasPermissionTo('dashboard.view.all');

        // $key = "dashboard.expenseTra.{$user->id}";
        // if (Cache::has($key)) {
        //     Log::info("CACHE HIT: {$key}");
        // } else {
        //     Log::info("CACHE MISS: {$key}");
        // }
        
        return Cache::rememberForever("dashboard.expenseTra.{$user->id}", function () use ($canViewAll, $user) {
            return $expenseTra = TransactionalLog::when(!$canViewAll, fn($q) => $q->where('contact_id', $user->contact_id))
                ->select('model_type', DB::raw('SUM(amount) as total_amount'))
                ->groupBy('model_type')
                ->get()
                ->map(fn($item) => [
                    'type' => match ($item->model_type) {
                        ExpenseItem::class => 'Expense',
                        Advance::class => 'Advance',
                        AdvanceSettlement::class => 'Advance Settlement',
                        Reimbursement::class => 'Reimbursement',
                        default => 'Other',
                    },
                    'total_amount' => $item->total_amount
                ]);
        });
    }

    public function getBarData()
    {
        $user = Auth::user();
        $canViewAll = $user->hasPermissionTo('dashboard.view.all');

        return Cache::rememberForever("dashboard.barData.{$user->id}", function () use ($canViewAll, $user) {
            $expenses = Expense::with(['expense_items', 'latestStatus'])->get()
                ->map(function ($expense) use ($user, $canViewAll) {
                    if ($canViewAll) return $expense;

                    $expense->expense_items = $expense->expense_items
                        ->filter(fn($item) => $item->paid_by_id === $user->contact_id);

                    return $expense;
                });

            return  $barData = $expenses
                ->groupBy(fn($expense) => $expense->created_at->format('m'))
                ->map(fn($monthExpenses) => [
                    'month' => $monthExpenses->first()->created_at->format('F'),
                    'total' => $monthExpenses->sum(
                        fn($expense) => $expense->expense_items->sum('amount')
                    ),
                ])
                ->values();
        });
    }

    public function getDoughnutData()
    {
        $user = Auth::user();
        $canViewAll = $user->hasPermissionTo('dashboard.view.all');
        $canViewBudget = $user->hasPermissionTo('budgetTimeline.view');
        return Cache::rememberForever("dashboard.doughnut.{$user->id}", function () use ($canViewAll, $canViewBudget, $user) {
            $expenses = Expense::with(['expense_items', 'latestStatus'])->get()
                ->map(function ($expense) use ($user, $canViewAll) {
                    if ($canViewAll) return $expense;

                    $expense->expense_items = $expense->expense_items
                        ->filter(fn($item) => $item->paid_by_id === $user->contact_id);

                    return $expense;
                });
            if ($canViewBudget) {

                $doughnut = BudgetTimeline::with(['budget', 'latestStatus'])
                    ->whereHas('latestStatus', fn($q) => $q->where('status', 'approved'))
                    ->where('end_at', '>', Carbon::now())
                    ->get()
                    ->map(fn($timeline) => [
                        'label' => $timeline->code,
                        'value' => $timeline->budget->sum('amount'),
                    ])
                    ->filter(fn($row) => $row['value'] > 0)
                    ->values();
            } else {
                $statusTotals = [
                    'pending' => 0,
                    'checked' => 0,
                    'approved' => 0,
                ];

                foreach ($expenses as $expense) {
                    $status = $expense->latestStatus[0]?->status;
                    if (!$status) continue;

                    $statusTotals[$status] += $expense->expense_items->sum('amount');
                }

                $doughnut = [
                    ['label' => 'Pending', 'value' => $statusTotals['pending']],
                    ['label' => 'Checked', 'value' => $statusTotals['checked']],
                    ['label' => 'Approved', 'value' => $statusTotals['approved']],
                ];
            }

            return $doughnut;
        });
    }

    public function getExpenseTable()
    {
        $user = Auth::user();
        $canViewAll = $user->hasPermissionTo('dashboard.view.all');

        return Cache::rememberForever("dashboard.expensestbl.{$user->id}", function () use ($canViewAll, $user) {
            $expensestblQuery = Expense::with('budgetTimeline:id,code', 'createdBy:id,code', 'latestStatus')
                ->orderBy('created_at', 'desc');

            if (!$canViewAll) {
                $expensestblQuery->whereHas('expense_items', fn($q) => $q->where('paid_by_id', $user->contact_id));
            }

            return $expensestbl = $expensestblQuery->limit(3)->get();
        });
    }
}
