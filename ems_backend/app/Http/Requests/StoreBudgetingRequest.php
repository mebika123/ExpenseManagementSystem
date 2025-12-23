<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBudgetingRequest extends FormRequest
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
        return [
            'name' => 'required|string',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',

            'items' => 'sometimes|array',

            'items.*.title' => 'required_with:items|string',
            'items.*.amount' => 'required_with:items|numeric|min:0',
            'items.*.department_id' => 'required_with:items|exists:departments,id',
            'items.*.location_id' => 'required_with:items|exists:locations,id',
        ];
    }
}
