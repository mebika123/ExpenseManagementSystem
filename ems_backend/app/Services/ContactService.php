<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\Employee;
use App\Repositories\ContactRepository;
use App\Repositories\EmployeeRepository;
use Exception;
use Illuminate\Support\Facades\DB;


class ContactService
{
    public function __construct(
        protected ContactRepository $contactRepo,
        protected EmployeeRepository $employeeRepo
    ) {}



    public function StoreOrUpdate(array $data, $id = null)
    {

        return DB::transaction(function () use ($id, $data) {
            $parts = explode(' ', $data['name']);
            $initials = count($parts) >= 2
                ? strtoupper(substr($parts[0], 0, 1) . substr($parts[1], 0, 1))
                : strtoupper(substr($data['name'], 0, 2));

            $latest = Contact::latest('id')->first();
            $nextId = $latest ? $latest->id + 1 : 1;
            $contact_code =  $initials . str_pad($nextId, 4, '0', STR_PAD_LEFT);

            $contact = $this->contactRepo->save($id, [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone_no' => $data['phone_no'],
                'pan_no' => $data['pan_no'] ?? null,
                'contact_type' => $data['contact_type'] ?? "employee",
                'department_id' => $data['department_id'] ?? null,
                'location_id' => $data['location_id'] ?? null,
                'code' => $contact_code
            ]);
            $contact_type = $data['contact_type'] ?? 'employee';
            if (!$id && $contact_type === 'employee') {
                $latestEmp = Employee::latest('id')->first();
                $nextIdEmp = $latestEmp ? $latestEmp->id + 1 : 1;
                $employee_code = 'EMP' . $initials . str_pad($nextIdEmp, 4, '0', STR_PAD_LEFT);

                $employee = $this->employeeRepo->create([
                    'contact_id' => $contact->id,
                    'code' => $employee_code
                ]);
            }

            return $contact;
        });
    }
}
