<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // public function login(Request $request)
    // {

    //     $request->validate([
    //         'email' => 'required|email|exists:users',
    //         'password' => 'required|min:8'
    //     ]);
    //     // dd($request->all());
    //     if (Auth::attempt(['email' => $request->input('email'), 'password' => $request->input('password')])) {
    //         /** @var \App\Models\User $user */
    //         $user = Auth::user();
    //         dd($user);
    //         $token = $user->createToken("token")->plainTextToken;
    //         return response()->json(['message' => 'Login Succesfull', 'user' => $user, 'token' => $token]);
    //     } else {
    //         return response()->json(['message' => 'Login failed']);
    //     }
    // }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8',
        ]);

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            /** @var \App\Models\User $user */

            $user = Auth::user();

            $userData['id']= $user->id;
            $userData['email']= $user->email;


            $token = $user->createToken('api-token')->plainTextToken;

            // dd($user);
            // dd($token);
            return response()->json([
                'message' => 'Login Successful',
                'user' => $userData,
                'token' => $token,
                // 'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ]);
        }

        return response()->json(['message' => 'Login failed'], 401);
    }

    public function logout(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged Out'], 200);
    }
}
