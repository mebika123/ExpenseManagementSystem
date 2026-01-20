<?php

namespace App\Http\Controllers;

use App\Models\AdvanceSettlement;
use App\Models\TransactionalLog;
use GuzzleHttp\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdvanceSettlementController extends Controller
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:advanceSettlement.view', only: ['index']),
            new Middleware('permission:advanceSettlement.update', only: ['update','showUnsettled']),
        ];
    }
    public function index()
    {
        $advanceSettlements = AdvanceSettlement::with([
            'contacts:id,code',
            'advance:id,purpose',
            'transactional_logs' => function ($q) {
                $q->select('id', 'isSettled', 'model_id', 'model_type');
            }
        ])->get();
        return response()->json(['advanceSettlements' => $advanceSettlements]);
    }
    public function showUnsettled()
    {
        $advanceSettlements = AdvanceSettlement::whereHas('transactional_logs', function ($p) {
            $p->where('isSettled', false);
        })->with(['contacts:id,code'])->get();
        return response()->json(['advanceSettlements' => $advanceSettlements]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:advance_settlements,id',
        ]);

        return DB::transaction(function () use ($data) {

            $ids = $data['ids'];

            AdvanceSettlement::whereIn('id', $ids)
                ->update(['settlement_date' => now()]);

            TransactionalLog::whereIn('model_id', $ids)
                ->where('model_type', AdvanceSettlement::class)
                ->update(['isSettled' => true]);

            return response()->json([
                'message' => 'advanceSettlements settled successfully'
            ]);
        });
    }
}
