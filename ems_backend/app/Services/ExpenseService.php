<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\ExpenseItem;
use App\Models\ExpensePlan;
use App\Repositories\ExpenseItemRepository;
use App\Repositories\ExpenseRepository;
use App\Repositories\TransactionalLogRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
    {       return  DB::transaction(function () use ($data, $id) {
            $user = Auth::user();
            $expenseData = [
                'title' => $data['title'],
                'budget_timeline_id' => $data['budget_timeline_id'],
                'created_by_id' => $user->id,
                'expense_plan_id' => $data['expense_plan_id'] ?? null
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
                    ]);}}
            if (!$id) {$this->status_service->create($expense, 'pending', $user->id, 'Status Created');}
            foreach ($data['expense_items'] as $item) {
                $payload = [
                    'name' => $item['name'],
                    'amount' => $item['amount'],
                    'description' => $item['description'],
                    'contact_id' => $item['contact_id'],
                    'expense_category_id' => $item['expense_category_id'],
                    'paid_by_id' => $item['paid_by_id'],
                    'department_id' => $item['department_id'],
                    'location_id' => $item['location_id'],
                    'budget_id' => $item['budget_id'] ?? null,
                ];
                if (!empty($item['id'])) {
                    $this->expense_item_repo->save($item['id'], $payload);
                } else {
                    $payload['expense_id'] = $expense->id;
                    $this->expense_item_repo->save(null, $payload);
                }
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
                Storage::disk('public')->delete($file->path);
                $file->delete();
            });
            $this->expense_repo->delete($id);
        });
    }


    public function updateStatus(array $data)
    {
        return DB::transaction(function () use ($data) {

            $userId  = Auth::id();
            $expense = Expense::findOrFail($data['expense_id']);
            $status  = $data['status'];
            $comment = $data['comment'] ?? null;


            $res = $this->status_service->changeStatus($expense, $status, $userId, $comment);


            if ($status === 'approved') {
                $expenseItems = ExpenseItem::where('expense_id', $expense->id)->get();

                foreach ($expenseItems as $expenseItem) {

                    $isettle = $expenseItem->paid_by_id === null;

                    $this->transactional_log_repo->createFor($expenseItem, [
                        'amount' => $expenseItem->amount,
                        'isSettled' => $isettle,
                        'payment_date' => Carbon::now(),
                        'contact_id' => $expenseItem->paid_by_id
                    ]);
                }
            }

            return $res;
        });
    }
    public function createExpenseFromExpensePlan($id)
    {
        return DB::transaction(function () use ($id) {
            $expensePlan = ExpensePlan::with('expense_plan_items', 'transactionalAttachments')->find($id);
            $expensePlan;
        });
    }
}
