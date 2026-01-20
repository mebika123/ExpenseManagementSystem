<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
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
    public static function middleware(): array
    {
        return [
            new Middleware('permission:role.view', only: ['index']),
            new Middleware('permission:role.create', only: ['store']),
            new Middleware('permission:role.update', only: ['update']),
            new Middleware('permission:role.show', only: ['show']),
            new Middleware('permission:role.delete', only: ['destroy']),
        ];
    }
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

    public function show($id)
    {
        $role = Role::with('permissions')->findOrFail($id);

        $permissions = $role->permissions->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
            ];
        });

        return response()->json([
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
            ],
            'permissions' => $permissions
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        return DB::transaction(function () use ($data) {
            $role = Role::create([
                'name' => $data['name'],
                'guard_name' => 'web' // need to change
            ]);

            $permissions = Permission::whereIn('id', $data['permissions'])->get();
            $role->syncPermissions($permissions);
            return response()->json([
                'message' => 'Role created successfully',
                'role' => $role
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role = Role::findOrFail($id);

        $role->name = $request->name;
        $role->save();
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        } else {
            $role->syncPermissions([]);
        }

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => $role
        ], 201);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        $role->syncPermissions([]);

        $role->delete();

        return response()->json([
            'message' => 'Role deleted successfully'
        ]);
    }
}
