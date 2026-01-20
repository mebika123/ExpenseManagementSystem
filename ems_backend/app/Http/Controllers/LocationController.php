<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Repositories\LocationRepository;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;

class LocationController extends Controller
{
    protected LocationRepository $location;

    public function __construct(LocationRepository $location)
    {
        $this->location = $location;
    }

      public static function middleware(): array
    {
        return [
            new Middleware('permission:location.view', only: ['index']),
            new Middleware('permission:location.create', only: ['store']),
            new Middleware('permission:location.update', only: ['update']),
            new Middleware('permission:location.show', only: ['show']),
            new Middleware('permission:location.delete', only: ['destroy']),
        ];
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
