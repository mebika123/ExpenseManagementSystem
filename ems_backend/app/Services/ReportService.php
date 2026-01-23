<?php

namespace App\Services;

use App\Models\Expense;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReportService
{
    public function expenseSummaryQuery(array $data)
    {
        // $results=Expense::with('expense_items','expense_items.buget_time_lines')->get();
        // dd(Log::info(json_encode($results)));
        $query = DB::table('expenses as e')
            ->join('expense_items as i', 'e.id', '=', 'i.expense_id')
            ->join('statuses as st', function ($join) {
                $join->on('st.model_id', '=', 'e.id')
                    ->where('st.model_type', Expense::class)
                    ->where('st.status', 'approved');
            })
            ->leftJoin('budget_timelines as b', 'e.budget_timeline_id', '=', 'b.id')
            ->leftJoin('expense_categories as c', 'i.expense_category_id', '=', 'c.id')
            ->leftJoin('contacts as sup', function ($join) {
                $join->on('i.contact_id', '=', 'sup.id')
                    ->where('sup.contact_type', 'supplier');
            })
            ->leftJoin('contacts as emp', function ($join) {
                $join->on('i.paid_by_id', '=', 'emp.id')
                    ->where('emp.contact_type', 'employee');
            })
            ->when(!empty($data['start_date']) && !empty($data['final_date']), function ($query) use ($data) {
                $query->whereDate('e.created_at', '>=', $data['start_date'])
                    ->whereDate('e.created_at', '<=', $data['final_date']);
            })
            ->when(!empty($data['budgetTimeline_id']), function ($query) use ($data) {
                $query->where('e.budget_timeline_id', $data['budgetTimeline_id']);
            })
            ->when(!empty($data['expense_category_id']), function ($query) use ($data) {
                $query->where('i.expense_category_id', $data['expense_category_id']);
            })
            ->when(!empty($data['location_id']), function ($query) use ($data) {
                $query->where('i.location_id', $data['location_id']);
            })
            ->when(!empty($data['supplier']), function ($query) use ($data) {
                $query->where('i.contact_id', $data['supplier']);
            })
            ->when(!empty($data['paid_by_id']), function ($query) use ($data) {
                $query->where('i.paid_by_id', $data['paid_by_id']);
            });

        // if ($data['start_date'] && $data['final_date']) {
        //     $query->whereDate('e.created_at', '>=', $data['start_date'])
        //         ->whereDate('e.created_at', '<=', $data['final_date']);
        // }

        // if ($data['budgetTimeline_id']) {
        //     $query->where('e.budget_timeline_id', $data['budgetTimeline_id']);
        // }

        // if ($data['expense_category_id']) {
        //     $query->where('i.expense_category_id', $data['expense_category_id']);
        // }

        // if ($data['location_id']) {
        //     $query->where('i.location_id', $data['location_id']);
        // }

        // if ($data['supplier']) {
        //     $query->where('i.contact_id', $data['supplier']);
        // }

        // if ($data['paid_by_id']) {
        //     $query->where('i.paid_by_id', $data['paid_by_id']);
        // }

        $query->select([
            'e.id as expense_id',
            'e.title',
            'e.code as expense_code',
            'b.code as budget_code',

            'i.id as item_id',
            'i.amount',
            'i.name',
            'i.location_id',
            'c.code as category_code',
            'sup.code as supplier_code',
            'emp.code as employee_code',
        ]);

        $rawData = $query->get();
        $grouped = [];
        $totalReportSum = 0;

        foreach ($rawData as $row) {
            $expenseId = $row->expense_id;

            if (!isset($grouped[$expenseId])) {
                $grouped[$expenseId] = [
                    'expense_id' => $expenseId,
                    'title' => $row->title,
                    'code' => $row->expense_code,
                    'budget_code' => $row->budget_code,
                    'total_amount' => 0,
                    'items' => [],
                ];
            }

            $grouped[$expenseId]['items'][] = [
                'item_id' => $row->item_id,
                'amount' => $row->amount,
                'name' => $row->name,
                'location' => $row->location_id,
                'category_code' => $row->category_code,
                'supplier_code' => $row->supplier_code,
                'employee_code' => $row->employee_code,
            ];

            $grouped[$expenseId]['total_amount'] += $row->amount;
        }
        $totalReportSum = array_sum(array_column($grouped, 'total_amount'));

        $results = array_values($grouped);

        return ['result' => $results, 'totalSum' => $totalReportSum];
    }

    //     public function expenseSummaryQuery(array $data)
    //     {
    //         // Log::info($data);

    //         // Ensure numeric values are safe
    //         $locationId = isset($data['location_id']) ? (int)$data['location_id'] : null;

    //         // Optional filters
    //         $expenseFilters = [];
    //         if (!empty($data['start_date'])) {
    //             $expenseFilters[] = "e.created_at >= '{$data['start_date']}'";
    //         }
    //         if (!empty($data['final_date'])) {
    //             $expenseFilters[] = "e.created_at <= '{$data['final_date']} 23:59:59'";
    //         }
    //         if (!empty($data['budgetTimeline_id'])) {
    //             $budgetTimelineId = (int)$data['budgetTimeline_id'];
    //             $expenseFilters[] = "e.budget_timeline_id = $budgetTimelineId";
    //         }

    //         $expenseWhereClause = $expenseFilters ? 'AND ' . implode(' AND ', $expenseFilters) : '';

    //         $itemFilters = [];
    //         if ($locationId) {
    //             $itemFilters[] = "i.location_id = $locationId";
    //         }
    //         if (!empty($data['expense_category_id'])) {
    //             $categoryId = (int)$data['expense_category_id'];
    //             $itemFilters[] = "i.expense_category_id = $categoryId";
    //         }
    //         if (!empty($data['supplier'])) {
    //             $supplierId = (int)$data['supplier'];
    //             $itemFilters[] = "i.contact_id = $supplierId";
    //         }
    //         if (!empty($data['paid_by_id'])) {
    //             $paidById = (int)$data['paid_by_id'];
    //             $itemFilters[] = "i.paid_by_id = $paidById";
    //         }

    //         $itemWhereClause = $itemFilters ? 'WHERE ' . implode(' AND ', $itemFilters) : '';
    // // Log::info($itemWhereClause);
    // // Log::info($expenseWhereClause);
    //         // Build the CTE SQL
    //         $sql = "
    //         WITH ApprovedExpense AS (
    //             SELECT e.id as expense_id, e.title, e.code as expense_code, e.budget_timeline_id
    //             FROM expenses e
    //             INNER JOIN statuses st ON st.model_id = e.id
    //             WHERE st.model_type = 'App\\Models\\Expense'
    //               AND st.status = 'approved'
    //               $expenseWhereClause
    //         ),
    //         ExpenseItemDetails AS (
    //             SELECT 
    //                 ae.expense_id,
    //                 ae.title,
    //                 ae.expense_code,
    //                 b.code as budget_code,
    //                 i.id as item_id,
    //                 i.amount,
    //                 i.name,
    //                 i.location_id,
    //                 c.code as category_code,
    //                 sup.code as supplier_code,
    //                 emp.code as employee_code
    //             FROM ApprovedExpense ae
    //             INNER JOIN expense_items i ON ae.expense_id = i.expense_id
    //             LEFT JOIN budget_timelines b ON ae.budget_timeline_id = b.id
    //             LEFT JOIN expense_categories c ON i.expense_category_id = c.id
    //             LEFT JOIN contacts sup ON i.contact_id = sup.id AND sup.contact_type = 'supplier'
    //             LEFT JOIN contacts emp ON i.paid_by_id = emp.id AND emp.contact_type = 'employee'
    //             $itemWhereClause
    //         )
    //         SELECT * FROM ExpenseItemDetails
    //         ORDER BY expense_id;
    //     ";

    //     Log::info($sql);
    //         $rawData = DB::select($sql);


    //         return $this->groupExpenseData($rawData);
    //     }

    //     private function groupExpenseData($rawData)
    //     {
    //         $grouped = [];
    //         $totalReportSum = 0;

    //         foreach ($rawData as $row) {
    //             $expenseId = $row->expense_id;

    //             if (!isset($grouped[$expenseId])) {
    //                 $grouped[$expenseId] = [
    //                     'expense_id' => $expenseId,
    //                     'title' => $row->title,
    //                     'code' => $row->expense_code,
    //                     'budget_code' => $row->budget_code,
    //                     'total_amount' => 0,
    //                     'items' => [],
    //                 ];
    //             }

    //             $grouped[$expenseId]['items'][] = [
    //                 'item_id' => $row->item_id,
    //                 'amount' => $row->amount,
    //                 'name' => $row->name,
    //                 'location' => $row->location_id,
    //                 'category_code' => $row->category_code,
    //                 'supplier_code' => $row->supplier_code,
    //                 'employee_code' => $row->employee_code,
    //             ];

    //             $grouped[$expenseId]['total_amount'] += $row->amount;
    //         }

    //         $totalReportSum = array_sum(array_column($grouped, 'total_amount'));

    //         return [
    //             'result' => array_values($grouped),
    //             'totalSum' => $totalReportSum,
    //         ];
    //     }
}
