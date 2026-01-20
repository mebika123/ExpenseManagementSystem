<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Repositories\DepartmentRepository;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;

class DepartmentController extends Controller
{
    protected DepartmentRepository $department;

    public function __construct(DepartmentRepository $department)
    {
        $this->department = $department;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:deparment.view', only: ['index']),
            new Middleware('permission:deparment.create', only: ['store']),
            new Middleware('permission:deparment.update', only: ['update']),
            new Middleware('permission:deparment.show', only: ['show']),
            new Middleware('permission:deparment.delete', only: ['destroy']),
        ];
    }
    public function index()
    {
        return $this->department->all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
        ]);
        $latest = Department::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        $code =  'DEP' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        $data['code'] = $code;
        return $this->department->create($data);
    }

    public function show($id)
    {
        return $this->department->find($id);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $id,
        ]);
        return $this->department->update($id, $data);
    }

    public function destroy($id)
    {
        return $this->department->delete($id);
    }
}
