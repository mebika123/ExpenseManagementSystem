<?php

namespace App\Services;

use App\Models\Expense;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReportService
{
    public function expenseSummaryQuery(array $data)
    {
        // if (is_array($data)) {
        //     $data = collect($data);
        //     }
        //     Log::info($data);
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
            });

        if ($data['start_date'] && $data['final_date']) {
            $query->whereDate('e.created_at', '>=', $data['start_date'])
                ->whereDate('e.created_at', '<=', $data['final_date']);
        }

        if ($data['budgetTimeline_id']) {
            $query->where('e.budget_timeline_id', $data['budgetTimeline_id']);
        }

        if ($data['expense_category_id']) {
            $query->where('i.expense_category_id', $data['expense_category_id']);
        }

        if ($data['location_id']) {
            $query->where('i.location_id', $data['location_id']);
        }

        // if ($data['department_id']) {
        //     $query->where('i.department_id', $data['department_id']);
        // }

        if ($data['supplier']) {
            $query->where('i.contact_id', $data['supplier']);
        }

        if ($data['paid_by_id']) {
            $query->where('i.paid_by_id', $data['paid_by_id']);
        }
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
            $totalReportSum += $grouped[$expenseId]['total_amount'];
        }

        $results = array_values($grouped);

        return ['result'=>$results, 'totalSum'=>$totalReportSum];
    }
}
