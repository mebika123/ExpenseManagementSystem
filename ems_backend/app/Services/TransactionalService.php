<?php

namespace App\Services;

use App\Models\Advance;
use App\Models\AdvanceSettlement;
use App\Models\ExpenseItem;
use App\Models\Reimbursement;
use App\Models\TransactionalLog;
use App\Repositories\TransactionalLogRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransactionalService
{
    public function __construct(
        protected TransactionalLogRepository $transactional_repo
    ) {}

    // public function  transactional_settlement($data)
    // {

    //     return DB::transaction(function () use ($data) {
    //         $remibursedAmount = 0;
    //         $totalAdvanceSum = 0;
    //         $totalRemainExpenseSum = 0;
    //         $totalSum = 0;
    //         $contactIds = TransactionalLog::whereNotNull('contact_id')->where('isSettled', false)->whereIn('id', $data['ids'])->groupBy('contact_id')->pluck('contact_id');
    //         foreach ($contactIds as $contactId) {
    //             $advanceTransactions = TransactionalLog::where('contact_id', $contactId)->where('model_type', Advance::class)->whereIn('id', $data['ids'])->where('isSettled', false)
    //                 ->get();


    //             foreach ($advanceTransactions as $advanceTransaction) {
    //                 $advance = Advance::findOrFail($advanceTransaction->model_id);
    //                 $expensePlanId = $advance->expense_plan_id;
    //                 $advanceAmount = $advanceTransaction->amount;


    //                 if (!$expensePlanId) {
    //                     $advanceDate = $advance->payment_date;
    //                     $expenseWithExpenseplan = TransactionalLog::where('contact_id', $contactId)->where('model_type', 'App\Models\ExpenseItem')->where('payment_date' > $advanceDate)->where('isSettled', false)
    //                         ->whereHasMorph('model', [ExpenseItem::class], function ($q) {
    //                             $q->whereDoesntHave('expensePlanItem');
    //                         })->get();
    //                     if ($expenseWithExpenseplans->count() > 0) {
    //                         foreach ($expenseWithExpenseplans as $expenseWithExpenseplan) {
    //                             $totalSum += $expenseWithExpenseplan->amount;
    //                             if ($advanceAmount > $totalSum) {
    //                                 $diff = $advanceAmount - $totalSum;
    //                                 $settled = AdvanceSettlement::create([
    //                                     'amount' => $diff,
    //                                     'advance_id' => $advanceTransaction->model_id,
    //                                     'contact_id' => $contactId,
    //                                     'settlement_date' => Carbon::now()
    //                                 ]);
    //                             } elseif ($advanceAmount < $totalSum) {
    //                                 // $remaining = $totalSum - $advanceAmount;
    //                                 $remibursedAmount += $totalSum - $advanceAmount;
    //                             }
    //                             $expenseWithExpenseplan->isSettled = true;
    //                             $expenseWithExpenseplan->save();
    //                             $advanceTransaction->isSettled=true;
    //                             $advanceTransaction->save();
    //                         }
    //                     } else {
    //                         $settled = AdvanceSettlement::create([
    //                             'amount' => $advanceAmount,
    //                             'advance_id' => $advanceTransaction->model_id,
    //                             'contact_id' => $contactId,
    //                             'settlement_date' => Carbon::now()
    //                         ]);
    //                         $advanceTransaction->isSettled=true;
    //                         $advanceTransaction->save();
    //                     }
    //                 } else {

    //                     $expenseWithExpenseplans = TransactionalLog::where('contact_id', $contactId)->where('model_type', 'App\Models\ExpenseItem')
    //                         ->whereHasMorph('model', [ExpenseItem::class], function ($q) use ($expensePlanId) {
    //                             $q->whereHas('expensePlanItem', function ($p) use ($expensePlanId) {
    //                                 $p->where('expense_plan_id', $expensePlanId);
    //                             });
    //                         })->get();
    //                     if ($expenseWithExpenseplans->length() > 0) {
    //                         foreach ($expenseWithExpenseplans as $expenseWithExpenseplan) {
    //                                $totalSum += $expenseWithExpenseplan->amount;
    //                             if ($advanceAmount > $totalSum) {
    //                                 $diff = $advanceAmount - $totalSum;
    //                                 $settled = AdvanceSettlement::create([
    //                                     'amount' => $diff,
    //                                     'advance_id' => $advanceTransaction->model_id,
    //                                     'contact_id' => $contactId,
    //                                     'settlement_date' => Carbon::now()
    //                                 ]);
    //                             } elseif ($advanceAmount < $totalSum) {
    //                                 // $remaining = $totalSum - $advanceAmount;
    //                                 $remibursedAmount += $totalSum - $advanceAmount;
    //                             }
    //                             $expenseWithExpenseplan->isSettled = true;
    //                             $expenseWithExpenseplan->save();
    //                             $advanceTransaction->isSettled=true;
    //                             $advanceTransaction->save();
    //                         }
    //                     } else {
    //                         $settled = AdvanceSettlement::create([
    //                             'amount' => $advanceAmount,
    //                             'advance_id' => $advanceTransaction->model_id,
    //                             'contact_id' => $contactId,
    //                             'settlement_date' => Carbon::now()
    //                         ]);
    //                         $advanceTransaction->isSettled=false;
    //                         $advanceTransaction->save();
    //                     }
    //                 }


    //                 if ($advanceAmount > $totalSum) {
    //                     $remaining = $advanceAmount - $totalSum;
    //                     $settled = AdvanceSettlement::create([
    //                         'amount' => $remaining,
    //                         'advance_id' => $advanceTransaction->model_id,
    //                         'contact_id' => $contactId,
    //                         'settlement_date' => Carbon::now()
    //                     ]);
    //                     $advanceTransaction->isSettled(true);
    //                     $advanceTransaction->save();
    //                 } elseif ($advanceAmount < $totalSum) {
    //                     $remaining = $totalSum - $advanceAmount;
    //                     $remibursedAmount += $remaining;
    //                 }
    //             }
    //            if ($remibursedAmount){
    //                 $settled = Reimbursement::create([
    //                     'amount' => $remibursedAmount,
    //                     'contact_id' => $contactId,
    //                     'settlement_date' => Carbon::now()
    //                 ]);
    //             }
    //         }
    //         return;
    //     });
    // }

    public function transactional_settlement($data)
    {
        return DB::transaction(function () use ($data) {
            $transactionsByContact = TransactionalLog::whereIn('id', $data['ids'])
                ->whereNotNull('contact_id')
                ->where('isSettled', false)
                ->get()
                ->groupBy('contact_id');
                
                foreach ($transactionsByContact as $contactId => $transactions) {
                    $totalReimbursement = 0;
                    
                    $advances = $transactions->where('model_type', Advance::class)
                    ->sortBy('payment_date');
                    
                    $expenses = $transactions->where('model_type', ExpenseItem::class)
                    ->sortBy('payment_date');
                    // Log::info($expenses);

                $uncoveredExpenses = $expenses->filter(fn($e) => empty($e->model->expensePlanItem));

                $allAdvances = $advances->values();

                foreach ($allAdvances as $index => $advanceTransaction) {
                    $advance = $advanceTransaction->model;
                    $advanceAmount = $advanceTransaction->amount;
                    $expensePlanId = $advance->expense_plan_id;

                    $totalSum = 0;

                    if ($expensePlanId) {
                        $matchedExpenses = $expenses->filter(function ($expense) use ($expensePlanId) {
                            return optional($expense->model->expensePlanItem)->expense_plan_id == $expensePlanId && !$expense->isSettled;
                        });

                        foreach ($matchedExpenses as $expense) {
                            $totalSum += $expense->amount;
                            $expense->isSettled = true;
                            $expense->save();
                        }
                    } else {
                        $nextAdvanceDate = $allAdvances[$index + 1]->model->payment_date ?? null;

                        $expensesToSettle = $uncoveredExpenses->filter(function ($expense) use ($advance, $nextAdvanceDate) {
                            $date = $expense->payment_date;
                            return !$expense->isSettled && $date >= $advance->payment_date && (!$nextAdvanceDate || $date < $nextAdvanceDate);
                        });

                        foreach ($expensesToSettle as $expense) {
                            $totalSum += $expense->amount;
                            $expense->isSettled = true;
                            $expense->save();
                            $uncoveredExpenses = $uncoveredExpenses->filter(fn($e) => $e->id !== $expense->id);
                        }
                    }

                    if ($advanceAmount > $totalSum) {
                        $settlement = AdvanceSettlement::create([
                            'amount' => $advanceAmount - $totalSum,
                            'advance_id' => $advanceTransaction->model_id,
                            'contact_id' => $contactId,
                            'settlement_date' => now(),
                        ]);

                        $this->transactional_repo->createFor($settlement, [
                            'amount' => $settlement->amount,
                            // 'payment_date' => now(),
                            'contact_id' => $contactId,
                            // 'isSettled' => true
                        ]);
                    } elseif ($advanceAmount < $totalSum) {
                        $totalReimbursement += $totalSum - $advanceAmount;
                    }

                    $advanceTransaction->isSettled = true;
                    $advanceTransaction->save();
                }

                $totalReimbursement += $uncoveredExpenses->sum('amount');

                if ($totalReimbursement > 0) {
                    $reimbursement = Reimbursement::create([
                        'amount' => $totalReimbursement,
                        'contact_id' => $contactId,
                        // 'settlement_date' => now()

                    ]);

                    $this->transactional_repo->createFor($reimbursement, [
                        'amount' => $reimbursement->amount,
                        'payment_date' => now(),
                        'contact_id' => $contactId,
                        // 'isSettled' => true

                    ]);

                    foreach ($uncoveredExpenses as $expense) {
                        $expense->isSettled = true;
                        $expense->save();
                    }
                }
            }
        });
    }
}
