<?php

namespace App\Http\Controllers;

use App\Models\ExpenseCategory;
use App\Repositories\ExpenseCategoryRepository;
use Illuminate\Http\Request;

class ExpenseCategoryController extends Controller
{
     protected ExpenseCategoryRepository $expense_category_repo;

    public function __construct(ExpenseCategoryRepository $expense_category_repo)
    {
        $this->expense_category_repo = $expense_category_repo;
    }
    public function index()
    {
        return $this->expense_category_repo->all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
        ]);
        $latest = ExpenseCategory::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        $code =  'EXP_CATEGORY' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        $data['code'] = $code;
        return $this->expense_category_repo->create($data);
    }

    public function show($id)
    {
        return $this->expense_category_repo->find($id);
    }

    public function update(Request $request, $id)
    {
        return $this->expense_category_repo->update($id, $request->all());
    }

    public function destroy($id)
    {
        return $this->expense_category_repo->delete($id);
    }
}
