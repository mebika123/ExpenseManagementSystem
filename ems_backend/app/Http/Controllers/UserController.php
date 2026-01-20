<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Models\Contact;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{

    protected UserService $user_service;

    public function __construct(UserService $user_service)
    {

        $this->user_service = $user_service;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:user.view', only: ['index']),
            new Middleware('permission:user.create', only: ['store']),
            new Middleware('permission:user.update', only: ['update']),
            new Middleware('permission:user.show', only: ['show']),
            new Middleware('permission:user.delete', only: ['destroy']),
        ];
    }

    public function index()
    {
        $user = $this->user_service->contact_user();
        return response()->json(['user' => $user]);
    }

    public function store(StoreUserRequest $request)
    {
        // dd('store called');
        $user = $this->user_service->createUser($request->all());
        return response()->json(['message' => 'User created', 'user' => $user]);
    }
    public function update(StoreUserRequest $request, $id)
    {
        $user = $this->user_service->updateUser($id, $request->all());
        return response()->json(['message' => 'User Updated', 'user' => $user]);
    }

    public function show($id)
    {
        $user = $this->user_service->showContactUser($id);
        return response()->json(['user' => $user]);
    }
    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $user = User::findOrFail($id);
            $contacts = Contact::findOrFail($user->contact_id);
            $contacts->delete();
            $user->delete();
        });
    }
    public function getAuthUser()
    {
        $user = Auth::user();
        $name = '';
        $code = '';
        if ($user->contact_id) {
            $contact = Contact::findOrFail($user->contact_id);
            $name = $contact->name;
            $code = $contact->code;
        }

        return response()->json([
            'id' => $user->id,
            'name' => $name,
            'code' => $code,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }
}
