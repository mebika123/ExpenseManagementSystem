<?php
namespace App\Observers;

use App\Models\TransactionalLog;
use Illuminate\Support\Facades\Cache;

class TransactionalLogObserver
{
    public function created(TransactionalLog $log)
    {
        $this->clearDashboardCards($log);
    }

    public function updated(TransactionalLog $log)
    {
        $this->clearDashboardCards($log);
    }

    protected function clearDashboardCards(TransactionalLog $log)
    {
        $userId = $log->contact_id;

        Cache::forget("dashboard.expenseTra.$userId");
    }
}
