<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\Contact;
use App\Repositories\ContactRepository;
use App\Services\ContactService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;

class ContactController extends Controller
{
    protected ContactRepository $contactRepo;
    protected ContactService $contact_service;

    public function __construct(ContactRepository $contactRepo, ContactService $contact_service)
    {
        $this->contactRepo = $contactRepo;
        $this->contact_service = $contact_service;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:contact.view', only: ['index']),
            new Middleware('permission:contact.create', only: ['store']),
            new Middleware('permission:contact.update', only: ['update']),
            new Middleware('permission:contact.show', only: ['show']),
            new Middleware('permission:contact.delete', only: ['destroy']),
        ];
    }


    public function index()
    {
        $contacts = Contact::with('employee:id,contact_id,code')->get();
        return response()->json(['contacts' => $contacts]);
    }

    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $contact = $this->contact_service->storeOrUpdate($data);
        return response()->json(['message' => 'Conatct Created succesfully!', 'contacts' => $contact]);
    }

    public function show($id)
    {
        $contact = $this->contactRepo->find($id);
        return response()->json(['contacts' => $contact]);
    }

    public function employees()
    {
        $contact = Contact::where('contact_type','employee')->get();
        return response()->json(['employees' => $contact]);
    }

    public function suppliers()
    {
        $contact = Contact::where('contact_type','supplier')->get();
        return response()->json(['suppliers' => $contact]);
    }

    public function update(StoreUserRequest $request, $id)
    {
        $data = $request->validated();
        $contact = $this->contactRepo->save($id, $data);
        return response()->json(['message' => 'Conatct updated succesfully!', 'contacts' => $contact]);
    }

    public function destroy($id)
    {
        $contacts = $this->contactRepo->delete($id);
        return response()->json(['message' => 'Conatct deleted succesfully!']);
    }
}
