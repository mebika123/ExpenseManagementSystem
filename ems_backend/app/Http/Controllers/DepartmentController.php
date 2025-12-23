<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Repositories\DepartmentRepository;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    protected DepartmentRepository $department;

    public function __construct(DepartmentRepository $department)
    {
        $this->department = $department;
    }
    public function index()
    {
        return $this->department->all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
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
        return $this->department->update($id, $request->all());
    }

    public function destroy($id)
    {
        return $this->department->delete($id);
    }
}
