<?php

namespace App\Http\Controllers;

use App\Models\Advance;
use App\Models\Expense;
use App\Models\ExpenseItem;
use App\Models\TransactionalLog;
use App\Repositories\TransactionalLogRepository;
use App\Services\TransactionalService;
use Exception;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;

class TransactionaLogController extends Controller
{
    protected TransactionalLogRepository $transactional_repo;
    protected TransactionalService $transactional_service;

    public function __construct(TransactionalLogRepository $transactional_repo, TransactionalService $transactional_service)
    {
        $this->transactional_repo = $transactional_repo;
        $this->transactional_service = $transactional_service;
    }


    public function index()
    {
        try {
            $transactions = TransactionalLog::with('contacts:id,code','model')->get();
            return response()->json(['transactions' => $transactions]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
    public function showUnsettledTransaction()
    {
        try {
            $transactions = TransactionalLog::with('contacts:id,code', 'model')
                ->where('isSettled', false)->whereNotNull('contact_id')
                ->get();

            $advWithEPNotI = [];

            $advanceTransactions = $transactions
                ->where('model_type', Advance::class);
            foreach ($advanceTransactions as $advanceId) {
                $advance = Advance::findOrFail($advanceId->model_id);
                $expensePlanId = $advance->expense_plan_id;
                $contact_id = $advanceId->contact_id;
                if (!$advance->expense_plan_id) {
                    continue;
                }
                $hasExpense  = TransactionalLog::where('model_type', ExpenseItem::class)->where('isSettled', false)
                    ->where('contact_id', $contact_id)
                    ->whereHasMorph('model', [ExpenseItem::class], function ($q) use ($expensePlanId) {
                        $q->whereHas('expensePlanItem', function ($p) use ($expensePlanId) {
                            $p->where('expense_plan_id', $expensePlanId);
                        });
                    })
                    ->get();

                if ($hasExpense->count() < 1) {
                    $advWithEPNotI[] = $advanceId->id;
                }
            }

            // $advanceWIthEI;

            return response()->json([
                'transactions' => $transactions,
                'advWithEPNotI' => $advWithEPNotI,
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    public function transactional_settlement(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:transactional_logs,id',
        ]);
        try {
            $transactions = $this->transactional_service->transactional_settlement($data);
            // $transactions = $request->all();
            return response()->json(['transactions' => $transactions]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
