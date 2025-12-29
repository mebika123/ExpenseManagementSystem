<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpensePlanRequest extends FormRequest
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
        return [
            'title' => 'required|string|unique:expenses,title,' . $this->route('expense'),
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',
            'budget_timeline_id' => 'required|exists:budget_timelines,id',
            'purpose' => 'nullable|string',

            'transactional_attachments.*' => 'file|max:5120|mimes:jpg,jpeg,png,pdf',

            'expense_plan_items' => 'required|array|min:1',

            'expense_plan_items.*.name' => 'required|string',
            'expense_plan_items.*.description' => 'nullable|string',
            'expense_plan_items.*.amount' => 'required|numeric|min:0',

            'expense_plan_items.*.department_id' => 'nullable|exists:departments,id',
            'expense_plan_items.*.location_id' => 'nullable|exists:locations,id',
            'expense_plan_items.*.expense_category_id' => 'required|exists:expense_categories,id',
            'expense_plan_items.*.budget_id' => 'required|exists:budgets,id',
            'expense_plan_items.*.contact_id' => 'nullable|exists:contacts,id',
            'expense_plan_items.*.paid_by_id' => 'nullable|exists:contacts,id',

            'existingFiles' => 'nullable|array',
            'existingFiles.*' => 'integer',
        ];
    }
}
