<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class ReportExport implements FromCollection, WithHeadings, WithMapping
{
    protected $data;

    public function __construct($data)
    {
        $this->data = collect($data);
    }

    /**
     * Collection method required by FromCollection
     * Prepares rows including total per expense
     */
    public function collection()
    {
        $rows = collect();

        foreach ($this->data['result'] as $expense) {
            $items = collect($expense['items'] ?? []);
            $expenseTotal = $items->sum('amount');

            // Add each item
            foreach ($items as $item) {
                $rows->push([
                    'title' => $expense['title'],
                    'expense_code' => $expense['code'],
                    'budget_code' => $expense['budget_code'],
                    'item_name' => $item['name'],
                    'amount' => $item['amount'],
                    // 'location' => $item['location'],
                    'category_code' => $item['category_code'],
                    'supplier_code' => $item['supplier_code'],
                    'employee_code' => $item['employee_code'],
                ]);
            }

            // Add total row
            $rows->push([
                'title' => 'Total Expense Amount',
                'expense_code' => $expense['code'],
                'budget_code' => $expense['budget_code'],
                'item_name' => '',
                'amount' => $expenseTotal,
                // 'location' => '',
                'category_code' => '',
                'supplier_code' => '',
                'employee_code' => '',
            ]);
        }

        return $rows;
    }

    public function headings(): array
    {
        return [
            'Title',
            'Expense Code',
            'Budget Code',
            'Item Name',
            'Amount(Rs)',
            // 'Location',
            'Category Code',
            'Supplier Code',
            'Employee Code',
        ];
    }

    public function map($row): array
    {
        return [
            $row['title'],
            $row['expense_code'],
            $row['budget_code'],
            $row['item_name'],
            $row['amount'],
            // $row['location'],
            $row['category_code'],
            $row['supplier_code'],
            $row['employee_code'],
        ];
    }
}
