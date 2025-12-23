<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    // public function authorize(): bool
    // {
    //     return false;
    // }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // dd("test");
        return [
            'title' => 'required|string',
            'budget_timeline_id' => 'required|exists:budget_timelines,id',

            'expense_items' => 'required|array|min:1',

            'expense_items.*.name' => 'required|string',
            'expense_items.*.description' => 'nullable|string',
            'expense_items.*.amount' => 'required|numeric|min:0',

            'expense_items.*.department_id' => 'nullable|exists:departments,id',
            'expense_items.*.location_id' => 'nullable|exists:locations,id',
            'expense_items.*.expense_category_id' => 'required|exists:expense_categories,id',
            'expense_items.*.budget_id' => 'required|exists:budgets,id',
            'expense_items.*.contact_id' => 'nullable|exists:contacts,id',
            'expense_items.*.paid_by_id' => 'nullable|exists:contacts,id',
        ];
    }
}
