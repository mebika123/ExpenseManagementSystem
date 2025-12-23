<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    protected UserService $user_service;

    public function __construct(UserService $user_service)
    {
    
        $this->user_service = $user_service;
    }

    public function index(){
        $user = $this->user_service->contact_user();
        return response()->json(['user'=>$user]);
    }

    public function store(StoreUserRequest $request)
    {
        // dd('store called');
        $user = $this->user_service->createUser($request->all());
        return response()->json(['message' => 'User created', 'user' => $user]);
    }
    public function update(StoreUserRequest $request,$id){
        $user = $this->user_service->updateUser($id,$request->all());
        return response()->json(['message' => 'User Updated', 'user' => $user]);
        
    }

    public function show($id){
        $user = $this->user_service->showContactUser($id);
        return response()->json(['user'=>$user]);
    }
      public function getAuthUser()
    {
        return response()->json(Auth::user());
    }
}
