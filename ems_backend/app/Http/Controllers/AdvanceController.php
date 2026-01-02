<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdvanceRequest;
use App\Models\Advance;
use App\Services\AdvanceService;
use Exception;
use Illuminate\Http\Request;

class AdvanceController extends Controller
{
    protected AdvanceService $advance_service;
    public function __construct(AdvanceService $advance_service)
    {
        $this->advance_service = $advance_service;
    }

    public function index(){
        try{
         $advances = Advance::with('contact:id,code','expensePlan:id,title','latestStatus')->get();
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
            $advances = $this->advance_service->storeOrUpdate($request->all());
            return response()->json([
                'message' => 'Advance is created',
                'advances' => $advances
            ], 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
    public function update(StoreAdvanceRequest $request,$id)
    {
        try {
            $advances = $this->advance_service->storeOrUpdate($request->all(),$id);
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
}
