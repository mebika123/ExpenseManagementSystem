<?php

namespace App\Traits;

use App\Models\Statuses;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasStatusTrait
{
    public function statuses()
    {
        return $this->morphMany(Statuses::class, 'model')->orderBy('created_at');
    }
    public function currentStatus(): ?string
    {
        return $this->statuses()->latest('created_at')->value('status');
    }
    public function latestStatus(): MorphMany
    
    {
        return $this->morphMany(Statuses::class, 'model')
            ->latest('created_at')  // order by newest first
            ->limit(1);             // only latest
    }
}
