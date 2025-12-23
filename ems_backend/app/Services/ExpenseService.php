<?php

namespace App\Services;

use App\Models\Expense;
use App\Repositories\ExpenseItemRepository;
use App\Repositories\ExpenseRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ExpenseService
{

    public function __construct(
        protected ExpenseRepository $expense_repo,
        protected ExpenseItemRepository $expense_item_repo,
        private StatusService $status_service

    ) {}

    public function storeOrUpdateExpense($data, $id = null)
    {

        try {
            DB::transaction(function () use ($data, $id) {
                $user = Auth::user();

                $expenseData = [
                    'title' => $data['title'],
                    'budget_timeline_id' => $data['budget_timeline_id'],
                    'created_by_id' => $user->id
                ];
                if (!$id) {
                    $titlePrefix = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $data['title']), 0, 2));
                    $unique = substr(now()->timestamp, -4);
                    $code = "{$titlePrefix}_EXPE_{$unique}";
                    $expenseData['code'] = $code;
                }
                $expense = $this->expense_repo->save($id, $expenseData);

                if (!$id) {
                    $this->status_service->create($expense, 'pending', $user->id, 'Status Created');
                }

                foreach ($data['expense_items'] as $item) {
                    $expenseItemId = $item['id'] ?? null;

                    if (!$expenseItemId) {
                        $item['expense_id'] = $expense->id;
                    }
                    $this->expense_item_repo->save($expenseItemId, $item);
                }


                return $expense->load('expense_items');
            });
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Failed to create expense',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
