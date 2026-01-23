<?php

namespace App\Imports;

use App\Http\Requests\StoreExpenseRequest;
use App\Services\ExpenseService;
use App\Models\Budget;
use App\Models\BudgetTimeline;
use App\Models\Contact;
use App\Models\Department;
use App\Models\ExpenseCategory;
use App\Models\Location;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Validators\Failure;

class ExpenseImport implements ToCollection, WithHeadingRow, WithBatchInserts, WithChunkReading, SkipsOnFailure
{
    use SkipsFailures;

    protected $expenseService;
    protected $expensesCache = [];
    protected $errors = [];

    public function __construct(ExpenseService $expenseService)
    {
        $this->expenseService = $expenseService;
    }

    // public function collection(Collection $rows)
    // {
    //     Log::info('Collection started with rows count: ' . $rows->count());

    //     try {

    //         foreach ($rows as $rowNumber => $row) {

    //             $budgetTimelineId = BudgetTimeline::where('code', $row['budget_timeline_code'] ?? null)->value('id');
    //             $budgetId = Budget::where('title', $row['budget'] ?? null)->value('id');
    //             $expenseCategoryId = ExpenseCategory::where('code', $row['category_code'] ?? null)->value('id');
    //             $departmentId = Department::where('code', $row['department_code'] ?? null)->value('id');
    //             $contactId = Contact::where('code', $row['contact_code'] ?? null)->value('id');
    //             $paidById = Contact::where('code', $row['paid_by_code'] ?? null)->value('id');

    //             $expenseData = [
    //                 'title' => $row['title'] ?? null,
    //                 'budget_timeline_id' => $budgetTimelineId,
    //                 'attachments' => [],
    //             ];

    //             $expenseItemData = [
    //                 'name' => $row['item_name'] ?? null,
    //                 'amount' => $row['amount'] ?? null,
    //                 'description' => $row['description'] ?? null,
    //                 'department_id' => $departmentId,
    //                 'expense_category_id' => $expenseCategoryId,
    //                 'contact_id' => $contactId,
    //                 'paid_by_id' => $paidById,
    //                 'budget_id' => $budgetId,
    //             ];

    //             // Validate expense
    //             $expenseValidator = Validator::make($expenseData, \App\Http\Requests\StoreExpenseRequest::expense());
    //             if ($expenseValidator->fails()) {
    //                 $this->errors[$rowNumber + 2]['expense'] = $expenseValidator->errors()->all();
    //             }

    //             $itemValidator = Validator::make(
    //                 $expenseItemData,
    //                 \App\Http\Requests\StoreExpenseRequest::expenseItem(['budget_timeline_id' => $budgetTimelineId])
    //             );
    //             if ($itemValidator->fails()) {
    //                 $this->errors[$rowNumber + 2]['expense_item'] = $itemValidator->errors()->all();
    //             }

    //             if ($expenseValidator->fails() || $itemValidator->fails()) {
    //                 continue;
    //             }
    //             if ($expenseValidator->fails() || $itemValidator->fails()) {
    //                 Log::info('Row ' . ($rowNumber + 2) . ' failed validation');
    //                 continue;
    //             }
    //             // Group by expense title
    //             if (!isset($this->expensesCache[$expenseData['title']])) {
    //                 Log::info('Creating new cache entry for: ' . $expenseData['title']);

    //                 $this->expensesCache[$expenseData['title']] = [
    //                     'data' => $expenseData + ['expense_items' => []],
    //                     'service_id' => null,
    //                 ];
    //             }

    //             $this->expensesCache[$expenseData['title']]['data']['expense_items'][] = $expenseItemData;
    //             Log::info('Added item to expense: ' . $expenseData['title']);
    //         }

    //         Log::info('Total expenses cached: ' . count($this->expensesCache));
    //         Log::info('Total errors: ' . count($this->errors));

    //         // Trigger failures
    //         foreach ($this->errors as $row => $err) {
    //             Log::info('Error on row ' . $row, $err);

    //             foreach ($err as $type => $messages) {
    //                 foreach ($messages as $message) {
    //                     $this->onFailure(new Failure($row, (string)$type, [$message]));
    //                 }
    //             }
    //         }

    //         // Save valid expenses
    //         Log::info('About to save expenses...');

    //         // Save valid expenses
    //         foreach ($this->expensesCache as $expenseTitle => $expense) {
    //             Log::info('Saving expense: ' . $expenseTitle);
    //             Log::info('Expense data:', $expense['data']);

    //             $savedExpense = $this->expenseService->storeOrUpdateExpense($expense['data']);
    //             $this->expensesCache[$expenseTitle]['service_id'] = $savedExpense->id;

    //             Log::info('Saved expense ID: ' . $savedExpense->id);
    //         }

    //         Log::info('Collection completed');
    //     } catch (\Exception $e) {
    //         Log::error('Import failed: ' . $e->getMessage());
    //         Log::error($e->getTraceAsString());
    //         throw $e;
    //     }
    // }
    public function collection(Collection $rows)
    {

        foreach ($rows as $rowNumber => $row) {

            $budgetTimelineId = BudgetTimeline::where('code', $row['budget_timeline_code'] ?? null)->value('id');
            $budgetId = Budget::where('title', $row['budget'] ?? null)->value('id');
            $expenseCategoryId = ExpenseCategory::where('code', $row['category_code'] ?? null)->value('id');
            $departmentId = Department::where('code', $row['department_code'] ?? null)->value('id');
            $locationId = Location::where('code', $row['location_code'] ?? null)->value('id');
            $contactId = Contact::where('code', $row['contact_code'] ?? null)->value('id');
            $paidById = Contact::where('code', $row['paid_by_code'] ?? null)->value('id');

            $expenseData = [
                'title' => $row['title'],
                'budget_timeline_id' => $budgetTimelineId,
                'attachments' => [],
            ];

            $expenseItemData = [
                'name' => $row['item_name'],
                'amount' => $row['amount'],
                'description' => $row['description'] ?? null,
                'department_id' => $departmentId,
                'location_id' => $locationId,
                'expense_category_id' => $expenseCategoryId,
                'contact_id' => $contactId,
                'paid_by_id' => $paidById,
                'budget_id' => $budgetId,
            ];

            $itemValidator = Validator::make(
                $expenseItemData,
                StoreExpenseRequest::expenseItem(['budget_timeline_id' => $budgetTimelineId])
            );

            if ($itemValidator->fails()) {
                $this->errors[$rowNumber + 2]['expense_item'] = $itemValidator->errors()->all();
                continue;
            }

            // Group by expense title
            if (!isset($this->expensesCache[$expenseData['title']])) {
                $this->expensesCache[$expenseData['title']] = [
                    'data' => $expenseData + ['expense_items' => []],
                    'service_id' => null,
                ];
            }

            $this->expensesCache[$expenseData['title']]['data']['expense_items'][] = $expenseItemData;
        }


        foreach ($this->expensesCache as $expenseTitle => $expense) {
            $expenseValidator = Validator::make(
                $expense['data'],
                StoreExpenseRequest::expense()
            );

            if ($expenseValidator->fails()) {
                Log::error('Expense validation failed for: ' . $expenseTitle, $expenseValidator->errors()->all());
                unset($this->expensesCache[$expenseTitle]); 
                continue;
            }
        }

        // Trigger failures for invalid items
        foreach ($this->errors as $row => $err) {
            foreach ($err as $type => $messages) {
                foreach ($messages as $message) {
                    $this->onFailure(new Failure($row, (string)$type, [$message]));
                }
            }
        }


        // Save valid expenses
        foreach ($this->expensesCache as $expenseTitle => $expense) {

            $savedExpense = $this->expenseService->storeOrUpdateExpense($expense['data']);
            $this->expensesCache[$expenseTitle]['service_id'] = $savedExpense->id;

        }

    }
    public function batchSize(): int
    {
        return 1000;
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
