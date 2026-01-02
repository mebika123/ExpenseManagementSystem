<?php

namespace App\Services;

use App\Http\Requests\StoreAdvanceRequest;
use App\Models\Advance;
use App\Repositories\AdvanceRepository;
use App\Repositories\TransactionalLogRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdvanceService
{

    public function __construct(
        protected AdvanceRepository $advance_repo,
        protected TransactionalLogRepository $transactional_log_repo,
        private StatusService $status_service

    ) {}

    public function storeOrUpdate(array $data, $id = null)
    {
        return DB::transaction(function () use ($data, $id) {

            $user = Auth::user();

            if (!empty($data['expense_plan_id'])) {
                $exists = Advance::where('contact_id', $data['contact_id'])
                    ->where('expense_plan_id', $data['expense_plan_id'])
                    ->when($id, fn($q) => $q->where('id', '!=', $id))
                    ->exists();

                if ($exists) {
                    throw ValidationException::withMessages([
                        'expense_plan_id' => ['This contact already has an advance for this expense plan.']
                    ]);
                }
            }


            $advance = $this->advance_repo->save($id, $data);

            if (!$id) {
                $this->status_service->create($advance, 'pending', $user->id, 'Status Created');
            }

            return $advance;
        });
    }

    public function show($id)
    {
        $advance = Advance::with('latestStatus')->find($id);
        return $advance;
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $advance = $this->advance_repo->find($id);

            $advance->statuses()->delete();
            $this->advance_repo->delete($id);
        });
    }
}
