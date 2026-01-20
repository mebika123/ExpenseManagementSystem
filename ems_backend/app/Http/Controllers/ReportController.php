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


class ReportController extends Controller
{
    protected ReportService $report_service;

    public function __construct(ReportService $report_service)
    {

        $this->report_service = $report_service;
    }
    public function index(Request $request)
    {
        try {
            $data = $request->all();
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
