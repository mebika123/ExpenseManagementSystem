<?php

namespace App\Http\Controllers;

use App\Imports\DepartmentImport;
use App\Imports\ExpenseImport;
use App\Services\ExpenseService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ExcelImportController extends Controller
{
    public function importExcelDepartmentData(Request $request, string $importClass)
    {
        Log::info($request->file('file'));
        $request->validate([
            'file' => 'required|mimes:xlsx,csv,xls',
        ]);

        if (!class_exists($importClass)) {
            return response()->json([
                'success' => false,
                'message' => "Import class {$importClass} not found",
            ], 400);
        }

        Excel::import($importClass, $request->file('file'));
        return response()->json([
            'success' => true,
            'message' => 'Excel data imported successfully',
        ], 200);
    }

    public function importExpenses(Request $request, ExpenseService $expenseService)
    {
        try {

            $request->validate([
                'file' => 'required|mimes:xlsx,csv,xls',
            ]);

            Log::info($request->file('file'));
            $import = new ExpenseImport($expenseService);

            Excel::import($import, $request->file('file'));

            return response()->json([
                'success' => true,
                'message' => 'Excel data imported successfully',
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
