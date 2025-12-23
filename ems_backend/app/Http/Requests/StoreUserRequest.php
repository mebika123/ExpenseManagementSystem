<?php

namespace App\Http\Requests;

use App\Repositories\UserRepository;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function __construct(
        protected UserRepository $userRepo,
    ) {}
    // public function authorize(): bool
    // {
    //     return true;
    // }
    public function rules(): array
    {

        $contactOnly = $this->routeIs('contacts.store');
        $userId = $this->route('user') ?? null;
        $contactId = null;

        if ($userId) {
            $user = $this->userRepo->find($userId);
            $contactId = $user->contact_id ?? null;
        }
        // dd('test');
        // return [

        //     //contacts
        //     'name' => 'required',
        //     'email' => 'required|unique:contacts,email,' . $contactId,
        //     'phone_no' => 'nullable|unique:contacts,phone_no,' . $contactId,
        //     'pan_no' => 'nullable|unique:contacts,pan_no,' . $contactId,
        //     'contact_type' => 'in:employee,supplier',
        //     'department_id' => 'nullable|exists:departments,id',
        //     'location_id' => 'nullable|exists:locations,id',

        //     // user permission
        //     'role' => $contactId ? 'nullable' : 'required',

        //     //user
        //     'password' => $contactId ? 'nullable|confirmed|min:8' : 'required|confirmed|min:8'

        // ];
        if ($contactOnly) {
            return $this->contactRules($contactId);
        }
        return array_merge(
            $this->contactRules($contactId),
            $this->userRules($contactId)
        );
    }
    public function contactRules(?int $contactId = null): array
    {
        return [
            'name' => 'required',
            'email' => 'required|unique:contacts,email,' . $contactId,
            'phone_no' => 'nullable|unique:contacts,phone_no,' . $contactId,
            'pan_no' => 'nullable|unique:contacts,pan_no,' . $contactId,
            'contact_type' => 'in:employee,supplier',
            'department_id' => 'nullable|exists:departments,id',
            'location_id' => 'nullable|exists:locations,id',
        ];
    }
    protected function userRules(?int $contactId = null): array
    {
        return [
            'role' => $contactId ? 'nullable' : 'required',
            'password' => $contactId ? 'nullable|confirmed|min:8' : 'required|confirmed|min:8',
        ];
    }
}
