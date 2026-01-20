<?php

namespace App\Observers;

use App\Models\BudgetTimeline;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class BudgetTimelineObserver
{
    public function saved(BudgetTimeline $budgetTimeline)
    {
        $this->clearBudgetCache();
    }

    public function deleted(BudgetTimeline $budgetTimeline)
    {
        $this->clearBudgetCache();
    }

    protected function clearBudgetCache()
    {

        $userIds = User::whereHas('roles.permissions', function ($q) {
            $q->where('name', 'budgetTimeline.view');
        })->pluck('id');

        foreach ($userIds as $userId) {
            Cache::forget("dashboard.doughnut.$userId");
        }
    }
}
