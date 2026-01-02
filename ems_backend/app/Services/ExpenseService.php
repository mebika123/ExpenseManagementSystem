<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\ExpenseItem;
use App\Models\ExpensePlan;
use App\Repositories\ExpenseItemRepository;
use App\Repositories\ExpenseRepository;
use App\Repositories\TransactionalLogRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ExpenseService
{

    public function __construct(
        protected ExpenseRepository $expense_repo,
        protected ExpenseItemRepository $expense_item_repo,
        protected TransactionalLogRepository $transactional_log_repo,
        private StatusService $status_service

    ) {}

    public function storeOrUpdateExpense($data, $id = null)
    {

        return  DB::transaction(function () use ($data, $id) {
            $user = Auth::user();

            $expenseData = [
                'title' => $data['title'],
                'budget_timeline_id' => $data['budget_timeline_id'],
                'created_by_id' => $user->id,
                'expense_plan_id' => $data['expense_plan_id'] != null ? $data['expense_plan_id'] : null
            ];
            if (!$id) {
                $titlePrefix = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $data['title']), 0, 2));
                $unique = substr(now()->timestamp, -4);
                $code = "{$titlePrefix}_EXPE_{$unique}";
                $expenseData['code'] = $code;
            }

            $expense = $this->expense_repo->save($id, $expenseData);
            $filesToKeep = $data['existingFiles'] ?? [];

            $expense->transactionalAttachments()->whereNotIn('id', $filesToKeep)->each(function ($file) {
                Storage::disk('public')->delete($file->path);
                $file->delete();
            });
            if (!empty($data['attachments'])) {
                foreach ($data['attachments'] as $file) {
                    $originalName = $file->getClientOriginalName();
                    $storedName = $file->store('attachments', 'public');
                    $expense->transactionalAttachments()->create([
                        'path' => $storedName,
                        'filename' => $originalName
                    ]);
                }
            }


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
    }

    public function bulkDeleteItems($data)
    {
        return ExpenseItem::whereIn('id', $data['ids'])->delete();
    }

    public function deleteExpenseWithItems($id)
    {
        return DB::transaction(function () use ($id) {
            $expenseToDelete = $this->expense_repo->find($id);
            $expenseToDelete->expense_items()->each(function ($item) {
                $item->delete();
            });;
            $expenseToDelete->transactionalAttachments()->each(function ($file) {
                // Storage::delete($file->path);
                Storage::disk('public')->delete($file->path);
                $file->delete();
            });
            $this->expense_repo->delete($id);
        });
    }


    // public function updateStatus(Expense $expense, string $userId, string $status, ?string $comment = null)
    public function updateStatus(array $data)
    {
        $userId = Auth::user()->id;
        $expense = $data['id'];
        $status = $data['status'];
        $comment = $data['comment'];

        $this->status_service->changeStatus($expense, $status, $userId, $comment);
        if ($status == 'approved') {
            $expenseItems = ExpenseItem::findOrfail('expese_id', $expense);
            foreach ($expenseItems as $expenseItem) {
                $this->transactional_log_repo->createFor($expenseItem, [
                    'amount' => $expenseItem->amount,
                    'payment_date' => $expenseItem->created_at,
                    'contact_id' => $expenseItem->paid_by
                ]);
            }
        }
    }

    public function createExpenseFromExpensePlan($id)
    {
        return DB::transaction(function () use ($id) {
            $expensePlan = ExpensePlan::with('expense_plan_items', 'transactionalAttachments')->find($id);
            //  $this->storeOrUpdateExpense($expensePlan);
            $expensePlan;
        });
    }
}
