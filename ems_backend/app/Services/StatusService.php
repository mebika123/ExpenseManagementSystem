<?php

namespace App\Services;

use App\Interfaces\HasStatus;
use App\Repositories\StatusRepository;
use App\Services\Validators\StatusTransitionValidator;

class StatusService
{
    public function __construct(
        private StatusRepository $statusrepo,
        private StatusTransitionValidator $vaildator
    ) {}

    public function create(
        HasStatus $model,
        string $status,
        int $userId,
        ?string $comment = null
    ): void {
        $this->statusrepo->createfor($model, [
            'status' => $status,
            'comment' => $comment,
            'updated_by_id' => $userId
        ]);
    }
    public function changeStatus(HasStatus $model, string $status, string $userId, ?string $remarks = null)
    {
        $this->vaildator->validate($model->currentStatus(), $status);

        $this->statusrepo->createFor($model, [
            'status'     => $status,
            'changed_by' => $userId,
            'remarks'    => $remarks,
        ]);
    }
}
