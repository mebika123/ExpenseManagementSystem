<?php

namespace App\Http\Controllers;

use App\Models\AdvanceSettlement;
use App\Models\Reimbursement;
use App\Models\TransactionalLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class ReimbursementController extends Controller
{
     public static function middleware(): array
    {
        return [
            new Middleware('permission:reimbursement.view', only: ['index']),
            new Middleware('permission:reimbursement.update', only: ['update','showUnsettled']),
        ];
    }
    public function index()
    {
        $reimbursements = Reimbursement::with([
            'contacts:id,code',
            'transactional_logs' => function ($q) {
                $q->select('id', 'isSettled', 'model_id', 'model_type');
            }
        ])->get();
        return response()->json(['reimbursements' => $reimbursements]);
    }

    public function showUnsettled()
    {
        $reimbursements = Reimbursement::whereHas('transactional_logs', function ($p) {
            $p->where('isSettled', false);
        })->with(['contacts:id,code'])->get();
        return response()->json(['reimbursements' => $reimbursements]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:reimbursements,id', 
        ]);

        return DB::transaction(function () use ($data) {

            $ids = $data['ids']; 

            Reimbursement::whereIn('id', $ids)
                ->update(['settlement_date' => now()]);

            TransactionalLog::whereIn('model_id', $ids)
                ->where('model_type', Reimbursement::class)
                ->update(['isSettled' => true]);

            return response()->json([
                'message' => 'Reimbursements settled successfully'
            ]);
        });
    }
}
