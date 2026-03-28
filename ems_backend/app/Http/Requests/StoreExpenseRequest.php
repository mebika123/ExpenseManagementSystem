<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class StoreExpenseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    // protected function prepareForValidation()
    // {
    //     $this->merge([
    //         'description' => strip_tags($this->description),
    //     ]);
    // }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */


    public function rules(): array
    {
        return array_merge(
            self::expense(['budget_timeline_id' => $this->input('budget_timeline_id')]),
            self::expenseItem(['budget_timeline_id' => $this->input('budget_timeline_id')])
        );
    }

    public static function expense(array $context = []): array
    {
        return [
            'title' => 'required|string',
            'budget_timeline_id' => 'required|exists:budget_timelines,id',
            'expense_plan_id' => 'nullable|exists:expense_plans,id',
            'transactional_attachments.*' => 'file|max:5120|mimes:jpg,jpeg,png,pdf',
            'expense_items' => 'required|array|min:1', // THIS ensures array is present
        ];
    }

    public static function expenseItem(array $context = []): array
    {
        return [
            'expense_items.*.name' => 'required|string',
            'expense_items.*.description' => 'nullable|string',
            'expense_items.*.amount' => 'required|numeric|min:0',
            'expense_items.*.department_id' => 'required|exists:departments,id',
            'expense_items.*.expense_plan_item_id' => 'nullable|exists:expense_plan_items,id',
            'expense_items.*.location_id' => 'required|exists:locations,id',
            'expense_items.*.expense_category_id' => 'required|exists:expense_categories,id',
            'expense_items.*.budget_id' => [
                'required',
                Rule::exists('budgets', 'id')->where(
                    fn($q) => $q->where('budget_timeline_id', $context['budget_timeline_id'] ?? null)
                )
            ],
            'expense_items.*.contact_id' => 'nullable|exists:contacts,id',
            'expense_items.*.paid_by_id' => 'nullable|exists:contacts,id',
            'expense_items.*.id' => 'nullable|exists:expense_items,id',
        ];
    }


    // public function rules(): array
    // {
    //     Log::info('StoreExpenseRequest rules hit', $this->all());
    //     return [
    //         'title' => 'required|string|unique:expenses,title,' . $this->route('expense'),
    //         'budget_timeline_id' => 'required|exists:budget_timelines,id',
    //         'expense_plan_id' => 'nullable|exists:expense_plans,id|unique:expenses,expense_plan_id,' . $this->route('expense'),

    //         'transactional_attachments.*' => 'file|max:5120|mimes:jpg,jpeg,png,pdf',

    //         'expense_items' => 'required|array|min:1',
    //         'expense_items.*.id' => 'nullable|exists:expense_items,id', // <-- add this

    //         'expense_items.*.name' => 'required|string',
    //         'expense_items.*.description' => 'nullable|string',
    //         'expense_items.*.amount' => 'required|numeric|min:0',

    //         'expense_items.*.department_id' => 'nullable|exists:departments,id',
    //         'expense_items.*.expense_plan_item_id' => 'nullable|exists:expense_plan_items,id|unique:expense_items,expense_plan_item_id,NULL,id,expense_id,' . $this->route('expense'),
    //         'expense_items.*.location_id' => 'nullable|exists:locations,id',
    //         'expense_items.*.expense_category_id' => 'required|exists:expense_categories,id',
    //         'expense_items.*.budget_id' => [
    //             'required',
    //             Rule::exists('budgets', 'id')
    //                 ->where(
    //                     fn($q) =>
    //                     $q->where('budget_timeline_id', $this->input('budget_timeline_id'))
    //                 ),
    //         ],
    //         'expense_items.*.contact_id' => 'nullable|exists:contacts,id',
    //         'expense_items.*.paid_by_id' => 'nullable|exists:contacts,id',

    //         'existingFiles' => 'nullable|array',
    //         'existingFiles.*' => 'integer',
    //     ];
    // }


    public function messages(): array
    {
        return [
            'title.required' => 'The expense title is required',
            'title.string' => 'The expense title must be valid text',
            'budget_timeline_id.required' => 'Budget timeline is required',
            'budget_timeline_id.exists' => 'The selected budget timeline does not exist',
            'expense_plan_id.exists' => 'The selected expense plan does not exist',
            'transactional_attachments.*.file' => 'Each attachment must be a valid file',
            'transactional_attachments.*.max' => 'Each attachment must not exceed 5MB',
            'transactional_attachments.*.mimes' => 'Attachments must be jpg, jpeg, png, or pdf files',
            'expense_items.required' => 'At least one expense item is required',
            'expense_items.array' => 'Expense items must be a valid list',
            'expense_items.min' => 'At least one expense item is required',

            // Expense items messages
            'expense_items.*.name.required' => 'Item name is required',
            'expense_items.*.name.string' => 'Item name must be valid text',
            'expense_items.*.description.string' => 'Item description must be valid text',
            'expense_items.*.amount.required' => 'Item amount is required',
            'expense_items.*.amount.numeric' => 'Item amount must be a number',
            'expense_items.*.amount.min' => 'Item amount must be 0 or greater',
            'expense_items.*.department_id.exists' => 'The selected department does not exist',
            'expense_items.*.department_id.required' => 'Department is required',
            'expense_items.*.expense_plan_item_id.exists' => 'The selected expense plan item does not exist',
            'expense_items.*.location_id.exists' => 'The selected location does not exist',
            'expense_items.*.location_id.required' => 'Location is required',
            'expense_items.*.expense_category_id.required' => 'Expense category is required',
            'expense_items.*.expense_category_id.exists' => 'The selected expense category does not exist',
            'expense_items.*.budget_id.required' => 'Budget is required',
            'expense_items.*.budget_id.exists' => 'The selected budget does not exist or does not belong to this budget timeline',
            'expense_items.*.contact_id.exists' => 'The selected contact does not exist',
            'expense_items.*.paid_by_id.exists' => 'The selected payer does not exist',
            'expense_items.*.id.exists' => 'The selected expense item does not exist',
        ];
    }
}
