<?php

namespace App\Services;

use App\Interfaces\HasStatus;
use App\Repositories\StatusRepository;
use App\Services\Validators\StatusTransitionValidator;
use Exception;
use Illuminate\Database\Eloquent\Model;

class StatusService
{
    public function __construct(
        private StatusRepository $statusrepo,
        private StatusTransitionValidator $validator
    ) {}

    public function create(
        HasStatus $model,
        string $status,
        string $userId,
        ?string $comment = null
    ): void {
        $this->statusrepo->createfor($model, [
            'status' => $status,
            'comment' => $comment,
            'updated_by_id' => $userId
        ]);
    }
    // public function changeStatus(HasStatus $model, string $status, int $userId, ?string $remarks = null)
    // {
    //     try {
    //         $this->vaildator->validate($model->currentStatus(), $status);

    //        return $this->statusrepo->createFor($model, [
    //             'status'     => $status,
    //             'changed_by' => $userId,
    //             'remarks'    => $remarks,
    //         ]);
    //     } catch (Exception $e) {
    //         return response()->json(['message' => $e->getMessage()], 400);
    //     }
    // }

    public function changeStatus(
        Model & HasStatus $model,
        string $status,
        int $userId,
        ?string $comment = null
    ) {
        // Get the latest status from DB
        $model->load('statuses');
        $from = $model->statuses->last()?->status; // get last status in memory


        // If no previous status exists, block update (must create 'pending' first)
        if ($from === null) {
            throw new \DomainException("Cannot change status: initial status not set");
        }

        // Block repeated status
        if ($from === $status) {
            throw new \DomainException("Status is already '{$status}'");
        }

        // Validate allowed transition
        $this->validator->validate($from, $status);

        // Create new status
        return $this->statusrepo->createFor($model, [
            'status' => $status,
            'updated_by_id' => $userId,
            'comment' => $comment
        ]);
    }
}
