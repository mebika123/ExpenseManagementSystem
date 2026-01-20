<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdvanceRequest;
use App\Models\Advance;
use App\Services\AdvanceService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;

class AdvanceController extends Controller
{
    protected AdvanceService $advance_service;
    public function __construct(AdvanceService $advance_service)
    {
        $this->advance_service = $advance_service;
    }
        public static function middleware(): array
    {
        return [
            new Middleware('permission:advance.view', only:['index']),
            new Middleware('permission:advance.create', only:['store']),
            new Middleware('permission:advance.update',only:['update']),
            new Middleware('permission:advance.show',only:['show']),
            new Middleware('permission:advance.delete',only:['destroy']),
            new Middleware('permission:advance.status.check|advance.status.approve',only:['updateStatus']),
        ];
    }

    public function index()
    {
        try {
            $advances = Advance::with('contact:id,code', 'expensePlan:id,title', 'latestStatus')->get()->map(function ($advances) {
                $advances->isEditable = $advances->latestStatus?->first()?->status !== 'approved';
                return $advances;
            });
            return response()->json([
                'advances' => $advances
            ], 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
    public function store(StoreAdvanceRequest $request)
    {
        try {
            $advances = $this->advance_service->storeOrUpdate($request->validate());
            return response()->json([
                'message' => 'Advance is created',
                'advances' => $advances
            ], 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
    public function update(StoreAdvanceRequest $request, $id)
    {
        try {
            $advances = $this->advance_service->storeOrUpdate($request->all(), $id);
            return response()->json([
                'message' => 'Advance is created',
                'advances' => $advances
            ], 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $advance = $this->advance_service->show($id);
            return response()->json([
                'advance' => $advance
            ], 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
    public function destroy($id)
    {
        try {
            $delete = $this->advance_service->delete($id);
            return response()->json(['message' => 'advance deleted sucessfully']);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'advance_id' => 'required|integer|exists:advances,id',
            'status'     => 'required|string',
            'comment'    => 'required|string',
        ]);

        try {
            $updatedStatus = $this->advance_service->updateStatus($validated);
            return response()->json([
                'message' => 'Status is updated',
                'updatedStatus' => $updatedStatus
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
