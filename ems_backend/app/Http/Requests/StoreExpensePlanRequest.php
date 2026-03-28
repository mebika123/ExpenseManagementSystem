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
            'expense_plan_items.*.id' => 'nullable|exists:expense_plan_items,id', // <-- add this


            'expense_plan_items.*.name' => 'required|string',
            'expense_plan_items.*.description' => 'nullable|string',
            'expense_plan_items.*.amount' => 'required|numeric|min:0',

            'expense_plan_items.*.department_id' => 'required|exists:departments,id',
            'expense_plan_items.*.location_id' => 'required|exists:locations,id',
            'expense_plan_items.*.expense_category_id' => 'required|exists:expense_categories,id',
            'expense_plan_items.*.budget_id' => 'required|exists:budgets,id',
            'expense_plan_items.*.contact_id' => 'nullable|exists:contacts,id',
            'expense_plan_items.*.paid_by_id' => 'nullable|exists:contacts,id',

            'existingFiles' => 'nullable|array',
            'existingFiles.*' => 'integer',
        ];
    }

    // protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    // {
    //     throw new \Illuminate\Validation\ValidationException($validator, response()->json([
    //         'message' => 'Validation failed',
    //         'errors' => $validator->errors()
    //     ], 422));
    // }

    public function messages(): array
    {
        return [
            // Expense Plan level messages
            'title.required' => 'The expense plan title is required',
            'title.string' => 'The expense plan title must be valid text',
            'title.unique' => 'This expense plan title already exists',
            'start_at.required' => 'Start date is required',
            'start_at.date' => 'Start date must be a valid date',
            'end_at.required' => 'End date is required',
            'end_at.date' => 'End date must be a valid date',
            'end_at.after' => 'End date must be after start date',
            'budget_timeline_id.required' => 'Budget timeline is required',
            'budget_timeline_id.exists' => 'The selected budget timeline does not exist',
            'purpose.string' => 'Purpose must be valid text',
            'transactional_attachments.*.file' => 'Each attachment must be a valid file',
            'transactional_attachments.*.max' => 'Each attachment must not exceed 5MB',
            'transactional_attachments.*.mimes' => 'Attachments must be jpg, jpeg, png, or pdf files',
            'expense_plan_items.required' => 'At least one expense plan item is required',
            'expense_plan_items.array' => 'Expense plan items must be a valid list',
            'expense_plan_items.min' => 'At least one expense plan item is required',
            'existingFiles.array' => 'Existing files must be a valid list',
            'existingFiles.*.integer' => 'Each existing file ID must be a valid number',

            // Expense Plan Items messages
            'expense_plan_items.*.id.exists' => 'The selected expense plan item does not exist',
            'expense_plan_items.*.name.required' => 'Item name is required',
            'expense_plan_items.*.name.string' => 'Item name must be valid text',
            'expense_plan_items.*.description.string' => 'Item description must be valid text',
            'expense_plan_items.*.amount.required' => 'Item amount is required',
            'expense_plan_items.*.amount.numeric' => 'Item amount must be a number',
            'expense_plan_items.*.amount.min' => 'Item amount must be 0 or greater',
            'expense_plan_items.*.department_id.exists' => 'The selected department does not exist',
            'expense_plan_items.*.department_id.required' => 'Department is required',
            'expense_plan_items.*.location_id.exists' => 'The selected location does not exist',
            'expense_plan_items.*.location_id.required' => 'Location is required',
            'expense_plan_items.*.expense_category_id.required' => 'Expense category is required',
            'expense_plan_items.*.expense_category_id.exists' => 'The selected expense category does not exist',
            'expense_plan_items.*.budget_id.required' => 'Budget is required',
            'expense_plan_items.*.budget_id.exists' => 'The selected budget does not exist',
            'expense_plan_items.*.contact_id.exists' => 'The selected contact does not exist',
            'expense_plan_items.*.paid_by_id.exists' => 'The selected payer does not exist',
        ];
    }
}
