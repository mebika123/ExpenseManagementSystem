<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionController extends Controller
{
    // protected 

    // public function __construct()
    // {
    //     throw new \Exception('Not implemented');
    // }
    public function index()
    {
        $roles = Role::whereNotIn('name', ['superadmin', 'admin'])->get();
        return response()->json(['roles' => $roles]);
    }
    public function showAllPermission()
    {
        $permissions = Permission::all();
        return response()->json(['permissions' => $permissions]);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'permission' => 'sometimes|array',
            'permission.*' => 'integer|exists:permissions,id',
        ]);

        return DB::transaction(function () use ($data) {
            $role = Role::create([
                'name' => $data['name'],
                'guard_name' => 'web' // need to change
            ]);

            $permissions = Permission::whereIn('id', $data['permission'])->get();
            $role->syncPermissions($permissions);
            return response()->json([
                'message' => 'Role created successfully',
                'role' => $role
            ], 201);
        });
    }
}
