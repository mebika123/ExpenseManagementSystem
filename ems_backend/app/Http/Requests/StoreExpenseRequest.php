<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StoreExpenseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Log::info('StoreExpenseRequest rules hit', $this->all());
        return [
            'title' => 'required|string|unique:expenses,title,' . $this->route('expense'),
            'budget_timeline_id' => 'required|exists:budget_timelines,id',
            'expense_plan_id' => 'nullable|exists:expense_plans,id|unique:expenses,expense_plan_id,' . $this->route('expense'),

            'transactional_attachments.*' => 'file|max:5120|mimes:jpg,jpeg,png,pdf',

            'expense_items' => 'required|array|min:1',
            'expense_items.*.id' => 'nullable|exists:expense_items,id', // <-- add this

            'expense_items.*.name' => 'required|string',
            'expense_items.*.description' => 'nullable|string',
            'expense_items.*.amount' => 'required|numeric|min:0',

            'expense_items.*.department_id' => 'nullable|exists:departments,id',
            'expense_items.*.expense_plan_item_id' => 'nullable|exists:expense_plan_items,id|unique:expense_items,expense_plan_item_id,NULL,id,expense_id,' . $this->route('expense'),
            'expense_items.*.location_id' => 'nullable|exists:locations,id',
            'expense_items.*.expense_category_id' => 'required|exists:expense_categories,id',
            'expense_items.*.budget_id' => 'required|exists:budgets,id',
            'expense_items.*.contact_id' => 'nullable|exists:contacts,id',
            'expense_items.*.paid_by_id' => 'nullable|exists:contacts,id',

            'existingFiles' => 'nullable|array',
            'existingFiles.*' => 'integer',
        ];
    }
    //  public function messages(): array
    // {
    //     return[];
    //     // return [
    //     //     'budget.*.title.required_with' => 'This field is required',
    //     //     'budget.*.amount.required_with' => 'This field is required',
    //     //     'budget.*.department_id.required_with' => 'This field is required',
    //     //     'budget.*.location_id.required_with' => 'This field is required',

    //     //     'budget.*.amount.numeric' => 'Amount must be a number',
    //     //     'budget.*.amount.min' => 'Amount must be 0 or greater',
    //     // ];
    // }
}
