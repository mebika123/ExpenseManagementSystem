<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\ContactUser;
use App\Models\Employee;
use App\Models\User;
use App\Repositories\ContactRepository;
use App\Repositories\EmployeeRepository;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Nette\Schema\Expect;

use function PHPUnit\Framework\throwException;

class UserService
{
    public function __construct(
        protected ContactRepository $contactRepo,
        protected UserRepository $userRepo,
        protected EmployeeRepository $employeeRepo
    ) {}

    public function contact_user()
    {
        $users = User::with('contact')->get();
        return $users;
    }

    public function createUser(array $data)
    {
        try {

            return DB::transaction(function () use ($data) {
                $parts = explode(' ', $data['name']);
                $initials = count($parts) >= 2
                    ? strtoupper(substr($parts[0], 0, 1) . substr($parts[1], 0, 1))
                    : strtoupper(substr($data['name'], 0, 2));

                $latest = Contact::latest('id')->first();
                $nextId = $latest ? $latest->id + 1 : 1;
                $contact_code =  $initials . str_pad($nextId, 4, '0', STR_PAD_LEFT);

                $contact = $this->contactRepo->create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone_no' => $data['phone_no'],
                    'pan_no' => $data['pan_no'] ?? null,
                    'contact_type' => $data['contact_type'] ?? "employee",
                    'department_id' => $data['department_id'] ?? null,
                    'location_id' => $data['location_id'] ?? null,
                    'code' => $contact_code
                ]);

                $user = $this->userRepo->create([
                    'contact_id' => $contact->id,
                    'email' => $data['email'],
                    'password' => bcrypt($data['password'])

                ]);

                if ($data['contact_type'] === 'employee' || $data['contact_type'] === '') {
                    $latestEmp = Employee::latest('id')->first();
                    $nextIdEmp = $latestEmp ? $latestEmp->id + 1 : 1;
                    $employee_code =  $initials . str_pad($nextIdEmp, 4, '0', STR_PAD_LEFT);

                    $employee = $this->employeeRepo->create([
                        'contact_id' => $contact->id,
                        'code' => $employee_code
                    ]);
                }
                $user->assignRole($data['role']);
                return $user;
            });
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }
    public function updateUser($id, array $data)
    {
        try {
            return DB::transaction(function () use ($id, $data) {
                $user = $this->userRepo->find($id);
                if (!$user) {
                    throw new \Exception("user not found");
                }
                // $contact = $user->conatcts()->first();
                $contact = $this->contactRepo->find($user->contact_id);
                if (!$user) {
                    throw new \Exception("contact not found");
                }
                $this->contactRepo->update($contact->id, [
                    'name' => $data['name'] ?? $contact->name,
                    'email' => $data['email'] ?? $contact->email,
                    'phone_no' => $data['phone_no'] ?? $contact->phone_no,
                    'pan_no' => $data['pan_no'] ?? $contact->pan_no,
                    'contact_type' => $data['contact_type'] ?? $contact->contact_type,
                    'department_id' => $data['department_id'] ?? $contact->department_id,
                    'location_id' => $data['location_id'] ?? $contact->location_id
                ]);
                $userData =  [
                    'email' => $data['email'] ?? $user->email
                ];
                if (!empty($data['password'])) {
                    $userData['password'] = bcrypt($data['password']);
                }
                $this->userRepo->update($user->id, $userData);

                return $user->fresh();
            });
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function showContactUser($id)
    {
        $user = User::with('contact')->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'user' => $user
        ]);
    }
}
