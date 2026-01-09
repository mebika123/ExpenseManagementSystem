<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Repositories\LocationRepository;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    protected LocationRepository $location;

    public function __construct(LocationRepository $location)
    {
        $this->location = $location;
    }
    public function index()
    {
        return $this->location->all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:locations,name',
        ]);
        $latest = Location::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        $code =  'Loca' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        $data['code'] = $code;
        return $this->location->create($data);
    }

    public function show($id)
    {
        return $this->location->find($id);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:locations,name,'.$id,
        ]);
        return $this->location->update($id, $data);
    }

    public function destroy($id)
    {
        return $this->location->delete($id);
    }
}
