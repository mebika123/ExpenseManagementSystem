<?php

namespace App\Http\Controllers;

use App\Models\ExpenseCategory;
use App\Repositories\ExpenseCategoryRepository;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Log;

class ExpenseCategoryController extends Controller
{
     protected ExpenseCategoryRepository $expense_category_repo;

    public function __construct(ExpenseCategoryRepository $expense_category_repo)
    {
        $this->expense_category_repo = $expense_category_repo;
    }

        public static function middleware(): array
    {
        return [
            new Middleware('permission:expense_category.view', only: ['index']),
            new Middleware('permission:expense_category.create', only: ['store']),
            new Middleware('permission:expense_category.update', only: ['update']),
            new Middleware('permission:expense_category.show', only: ['show']),
            new Middleware('permission:expense_category.delete', only: ['destroy']),
        ];
    }
    
    public function index()
    {
        return $this->expense_category_repo->all();
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:expense_categories,name',
        ]);
        $latest = ExpenseCategory::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        $code =  'EXP_CATEGORY' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        $data['code'] = $code;
        Log::info($data);
        return $this->expense_category_repo->create($data);
    }

    public function show($id)
    {
        return $this->expense_category_repo->find($id);
    }

    public function update(Request $request, $id)
    {
         $data = $request->validate([
            'name' => 'required|string|max:255|unique:expense_categories,name,'.$id,
        ]);
        return $this->expense_category_repo->update($id, $data);
    }

    public function destroy($id)
    {
        return $this->expense_category_repo->delete($id);
    }
}
