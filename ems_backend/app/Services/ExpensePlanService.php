<?php

namespace App\Services;

use App\Models\ExpensePlanItems;
use App\Repositories\ExpensePlanItemRepository;
use App\Repositories\ExpensePlanRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ExpensePlanService
{

    public function __construct(
        protected ExpensePlanRepository $expense_plan_repo,
        protected ExpensePlanItemRepository $expense_plan_item_repo,
        private StatusService $status_service

    ) {}

    public function storeOrUpdateExpensePlan($data, $id = null)
    {
        return  DB::transaction(function () use ($data, $id) {
            $user = Auth::user();

            $expensePlanData = [
                'title' => $data['title'],
                'purpose' => $data['purpose'],
                'budget_timeline_id' => $data['budget_timeline_id'],
                'user_id' => $user->id,
                'start_at' => $data['start_at'],
                'end_at' => $data['end_at']
            ];
            if (!$id) {
                $titlePrefix = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $data['title']), 0, 2));
                $unique = substr(now()->timestamp, -4);
                $code = "{$titlePrefix}_EXPE_{$unique}";
                $expensePlanData['code'] = $code;
            }
            Log::info('Expense plan data', $expensePlanData);

            $expensePlan = $this->expense_plan_repo->save($id, $expensePlanData);
            $filesToKeep = $data['existingFiles'] ?? [];

            $expensePlan->transactionalAttachments()->whereNotIn('id', $filesToKeep)->each(function ($file) {
                Storage::disk('public')->delete($file->path);
                $file->delete();
            });
            if (!empty($data['attachments'])) {
                foreach ($data['attachments'] as $file) {
                    $originalName = $file->getClientOriginalName();
                    $storedName = $file->store('attachments', 'public');
                    $expensePlan->transactionalAttachments()->create([
                        'path' => $storedName,
                        'filename' => $originalName
                    ]);
                }
            }


            if (!$id) {
                $this->status_service->create($expensePlan, 'pending', $user->id, 'Status Created');
            }

            foreach ($data['expense_plan_items'] as $item) {
                $expensePlanItemId = $item['id'] ?? null;

                if (!$expensePlanItemId) {
                    $item['expense_plan_id'] = $expensePlan->id;
                }
                $this->expense_plan_item_repo->save($expensePlanItemId, $item);
            }


            return $expensePlan->load('expense_plan_items');
        });
    }

    public function bulkDeleteItems($data)
    {
        return ExpensePlanItems::whereIn('id', $data['ids'])->delete();
    }

    public function deleteExpensePlanWithItems($id)
    {
        return DB::transaction(function () use ($id) {
            $expenseToDelete = $this->expense_plan_repo->find($id);
            $expenseToDelete->expense_plan_items()->each(function ($item) {
                $item->delete();
            });;
            $expenseToDelete->transactionalAttachments()->each(function ($file) {
                // Storage::delete($file->path);
                Storage::disk('public')->delete($file->path);
                $file->delete();
            });
            $this->expense_plan_repo->delete($id);
        });
    }
}
