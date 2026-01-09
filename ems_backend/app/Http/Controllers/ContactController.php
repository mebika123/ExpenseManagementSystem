<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\Contact;
use App\Repositories\ContactRepository;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    protected ContactRepository $contactRepo;

    public function __construct(ContactRepository $contactRepo)
    {
        $this->contactRepo = $contactRepo;
    }
    public function index()
    {
        return $this->contactRepo->all();
    }
    public function showAllEmployee()
    {
        return Contact::where('contact_type','employee')->get();
    }

    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        return $this->contactRepo->create($data);
    }

    public function show($id)
    {
        return $this->contactRepo->find($id);
    }

    public function update(Request $request, $id)
    {
        return $this->contactRepo->update($id, $request->all());
    }

    public function destroy($id)
    {
        return $this->contactRepo->delete($id);
    }
}
