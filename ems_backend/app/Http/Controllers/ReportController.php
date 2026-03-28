<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Services\ReportService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReportExport;
use Illuminate\Routing\Controllers\Middleware;



class ReportController extends Controller
{
    protected ReportService $report_service;

    public function __construct(ReportService $report_service)
    {
        $this->report_service = $report_service;
    }
    public static function middleware(): array
    {
        return [
            new Middleware('permission:report.view', only: ['index', 'export']),
        ];
    }
    public function index(Request $request)
    {
        $data = $request->validate([
            'start_date' => 'nullable|date',
            'final_date' => 'nullable|date',
            'supplier' => 'nullable|exists:contacts,id',
            'paid_by_id' => 'nullable|exists:contacts,id',
            'location_id' => 'nullable|exists:locations,id',
            'department_id' => 'nullable|exists:departments,id',
            'budget_timeline_id' => 'nullable|exists:budget_timelines,id',
            'expense_category_id' => 'nullable|exists:expense_categories,id',
        ]);
        try {
            // $data = $request->all();
            $report = $this->report_service->expenseSummaryQuery($data);
            return response()->json(['message' => 'Report generated successfully!', 'report' => $report]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function export(Request $request)
    {
        $reportData = $this->report_service->expenseSummaryQuery($request->all());

        return Excel::download(new ReportExport($reportData), 'expenses.xlsx');
    }
}
