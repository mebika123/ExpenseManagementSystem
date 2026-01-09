<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StoreBudgetingRequest extends FormRequest
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
            'name' => 'required|string',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',

            'budget' => 'sometimes|array',
            'budget.*.id' => 'sometimes|exists:budgets,id',

            'budget.*.title' => 'required_with:budget.*|string',
            'budget.*.amount' => 'required_with:budget.*|numeric|min:0',
            'budget.*.department_id' => 'required_with:budget.*|exists:departments,id',
            'budget.*.location_id' => 'required_with:budget.*|exists:locations,id',
        ];
    }

    public function messages(): array
    {
        return [
            'budget.*.title.required_with' => 'This field is required',
            'budget.*.amount.required_with' => 'This field is required',
            'budget.*.department_id.required_with' => 'This field is required',
            'budget.*.location_id.required_with' => 'This field is required',

            'budget.*.amount.numeric' => 'Amount must be a number',
            'budget.*.amount.min' => 'Amount must be 0 or greater',
        ];
    }
}
