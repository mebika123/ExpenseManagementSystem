<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionController extends Controller
{
    // protected 

    // public function __construct()
    // {
    //     throw new \Exception('Not implemented');
    // }
    public function index(){
        $roles = Role::whereNotIn('name', ['superadmin', 'admin'])->get();
        return response()->json(['roles'=>$roles]);

    }
    public function showAllPermission(){
        $permissions = Permission::all();
        return response()->json(['permissions'=>$permissions]);

    }
    public function create(Request $request){
           $role = Role::create()
            ->givePermissionTo();
    }
    }

