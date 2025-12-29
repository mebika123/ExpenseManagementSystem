<?php

namespace App\Services\Validators;

use DomainException;

class StatusTransitionValidator
{
    protected array $allowedTransitions = [
        'pending' => ['checked','rejected'],
        'checked' => ['approved','rejected'],
        'approved' => [],
        'rejected' =>['pending']
    ];

    public function validate(?string $from, string $to): void
    {
        if (!in_array($to, $this->allowedTransitions[$from] ?? [])) {
            throw new DomainException("Cannot change status from {$from} to {$to}");
        }
    }

    public function setTransitions(array $transitions): void
    {
        $this->allowedTransitions = $transitions;
    }
}
