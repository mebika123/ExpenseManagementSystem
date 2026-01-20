<?php

namespace App\Observers;

use App\Models\Expense;
use Illuminate\Support\Facades\Cache;

class ExpenseObserver
{
   public function saved(Expense $expense)
    {
        $this->clearDashboardCache($expense);
    }

    public function deleted(Expense $expense)
    {
        $this->clearDashboardCache($expense);
    }

    protected function clearDashboardCache(Expense $expense)
    {
        $userIds = $expense->expense_items->pluck('paid_by_id')->unique();
        foreach ($userIds as $userId) {
            Cache::forget("dashboard.expenseTra.$userId");
            Cache::forget("dashboard.barData.$userId");
            Cache::forget("dashboard.doughnut.$userId");
            Cache::forget("dashboard.expensestbl.$userId");
        }
    }
}
